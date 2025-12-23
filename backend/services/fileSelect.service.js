const fs = require('fs');
const path = require('path');

const ALLOWED_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx']);
const IGNORED_DIRS = new Set([
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.next',
  'out',
  '.cache',
  'tmp'
]);

const MAX_FILE_SIZE = 50 * 1024; // 50 KB
const MAX_FILES = 25;

//recursive directory walk
function walk(dir, baseDir, results) {
    const entires = fs.readFileSync(dir, {withFileTypes: true});

    for(const entry of entires) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(baseDir, fullPath);

        if(entry.isDirectory()) {
            if(IGNORED_DIRS.has(entry.name)) continue;
            walk(fullPath, baseDir, results);
        } else {
            const ext = path.extname(entry.name);
            if(!ALLOWED_EXTENSIONS.has(ext)) continue;

            const stats = fs.statSync(fullPath);
            if(stats.size > MAX_FILE_SIZE) continue;

            results.push({
                path: relativePath, 
                absolutPath: fullPath,
                size: stats.size,
                extension: ext
            });
        }
    }
}

function selectFiles({ baseDir }) {
    const collected = [];

    walk(baseDir, baseDir, collected);

    //sort by size DESC (bigger files are usually important)
    collected.sort((a, b) => b.size - a.size);

    return collected.slice(0, MAX_FILES);
}
module.exports = {selectFiles};