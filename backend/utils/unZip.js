const unzipper = require('unzipper');
const fs = require('fs');
const path = require('path');
const { error } = require('console');

module.exports = async function unzipFile(zipPath) {
    try {
        const outputFolder = path.join("tmp", "extracted", Date.now().toString());

        //ensure folder exists
        fs.mkdirSync(outputFolder, { recursive: true });

        await fs
            .createReadStream(zipPath)
            .pipe(unzipper.Extract({ path: outputFolder }))
            .promise();

        return outputFolder; //return the path where zip is extracted
    } catch (err) {
        console.error("unzip error", err)
        throw new Error("Failed to unzip file");
    }
}