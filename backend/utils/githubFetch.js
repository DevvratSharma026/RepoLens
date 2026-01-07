//Download a github repo as ZIP and return a local downloaded zip path.
const fs = require('fs');
const path = require('path');
const os = require('os');
const axios = require('axios');

function parseGitHubUrl(repoUrl) {
    //normalize
    try {
        const u = new URL(repoUrl);
        if (u.hostname !== 'github.com') return null;

        //path parts e.g. ['', 'repo', 'tree', 'branch',..]
        const parts = u.pathname.split('/').filter(Boolean);
        if (parts.length < 2) return null;

        const owner = parts[0];
        const repo = parts[1].replace(/\.git$/, '');
        //branch if provided via /tree/<branch>
        let branch = null;
        if (parts.length >= 4 && (parts[2] === 'tree' || parts[2] === 'blob')) {
            branch = parts[3];
        }
        return { owner, repo, branch };
    } catch (err) {
        return null;
    }
}

async function tryDownload(url, targetPath) {
    const writer = fs.createWriteStream(targetPath);
    const resp = await axios({
        method: 'get', 
        url,
        responseType: 'stream',
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        validateStatus: status => (status >=200 && status < 400) //follow redirects too
    });
    return new Promise((resolve, reject) => {
        resp.data.pipe(writer);
        let error = null;
        writer.on('error', err => {
            error = err;
            writer.close();
            reject(err);
        });
        writer.on('close', () => {
            if(!error) resolve(targetPath);
        });
    });
}

async function fetchGitHubUrl(repoUrl, options = {}) {
    //this will return the owner,repo,branch
    const parsed = parseGitHubUrl(repoUrl);

    if (!parsed) {
        throw new Error("Invalid github url");
    }

    const { owner, repo, branch } = parsed;
    const tryBranches = options.tryBranches || ['main', 'master'];

    //computer candidate zip URLs
    const candidates = [];
    if (branch) {
        candidates.push(`https://github.com/${owner}/${repo}/archive/refs/heads/${branch}.zip`);
    } else {
        for(const b of tryBranches) {
            candidates.push(`https://github.com/${owner}/${repo}/archive/refs/heads/${b}.zip`);
        }
    }

    //create temp files
    const nameSafe = `${owner}-${repo}-${Date.now()}`;
    const tmpZip = path.join(os.tmpdir(), `${nameSafe}.zip`);

    let lastError = null;
    for(const url of candidates) {
        try {
            //quick HEAD check to avoid large downloads of 404 pages 
            const response = await axios({
                method: 'GET',
                url,
                responseType: 'stream',
                maxRedirects: 5,
                validateStatus: status => status >= 200 && status < 300,
            });

            await new Promise((resolve, reject) => {
                const writer = fs.createWriteStream(tmpZip);
                response.data.pipe(writer);
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
            return tmpZip;
        } catch(err) {
            lastError = err;
            //try next candidate
        }
    }
    //cleanup maybe partial files
    try { if(fs.existsSync(tmpZip)) fs.unlinkSync(tmpZip); } catch(e){}
    
    throw new Error(`Failed to download GitHub for ${owner}/${repo}. Last error: ${lastError?.message || ''}`);

}

module.exports = fetchGitHubUrl;