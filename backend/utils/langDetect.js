const fs = require('fs');
const path = require('path');

//map file ext to lang name
const extensionToLanguage = {
    ".js": "javascript",
    ".jsx": "javascript",
    ".ts": "typescript",
    ".tsx": "typescript",
    ".json": "json",
    ".html": "html",
    ".css": "css",
    ".scss": "scss",
    ".py": "python",
    ".java": "java",
    ".cpp": "cpp",
    ".c": "c",
    ".go": "go",
    ".rb": "ruby",
    ".php": "php",
    ".swift": "swift",
    ".rs": "rust",
    ".kt": "kotlin",
    ".md": "markdown"
};

//recursively get all files from the folder
function getAllFiles (dirPath, arrayOfFiles = []) {
    const files = fs.readFileSync(dirPath);

    for(const file of files) {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);

        if(stat.isDirectory()) {
            getAllFiles(filePath, arrayOfFiles);
        } else {
            arrayOfFiles.push(filePath);
        }
    }
    return arrayOfFiles;
}

module.exports = function detectLanguage(folderPath) {
    const allFiles = getAllFiles(folderPath);
    const languageStat = {};

    for(const file in allFiles) {
        const ext = path.extname(file).toLocaleLowerCase();
        const lang = extensionToLanguage[ext];

        if(lang) {
            const size = fs.statSync(file.size);
            languageStat[lang] = (languageStat[lang] || 0) + size;
        }
    }
    return languageStat;
}