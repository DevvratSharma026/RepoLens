const fs = require('fs');
const path = require('path');

// extension -> language map
const extensionToLanguage = {
  ".js": "javascript",
  ".mjs": "javascript",
  ".cjs": "javascript",
  ".jsx": "javascript",
  ".ts": "typescript",
  ".tsx": "typescript",
  ".json": "json",
  ".html": "html",
  ".htm": "html",
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

function getAllFiles(dirPath, arrayOfFiles = []) {
  let entries;
  try { entries = fs.readdirSync(dirPath); } catch { return arrayOfFiles; }

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry);
    let stat;
    try { stat = fs.statSync(fullPath); } catch { continue; }

    if (stat.isDirectory()) {
      const base = entry.toLowerCase();
      if (['node_modules', '.git', 'dist', 'build'].includes(base)) continue;
      getAllFiles(fullPath, arrayOfFiles);
    } else if (stat.isFile()) {
      arrayOfFiles.push(fullPath);
    }
  }
  return arrayOfFiles;
}

function guessLanguageByContent(filePath) {
  try {
    const fd = fs.openSync(filePath, 'r');
    const buf = Buffer.alloc(1024);
    const bytes = fs.readSync(fd, buf, 0, 1024, 0);
    fs.closeSync(fd);
    const text = buf.slice(0, bytes).toString('utf8').trim();
    if (!text) return null;

    if (/^\s*#!/.test(text) && /node|nodejs/.test(text)) return 'javascript';
    if (/^\s*<(?:!doctype|html)/i.test(text) || /<html/i.test(text)) return 'html';
    if (/^\s*[{[]/.test(text) && /["']?\w+["']?\s*[:=]/.test(text)) return 'json';
    if (/^\s*(import|export)\s+/.test(text) || /\bmodule\.exports\b/.test(text) || /\brequire\(/.test(text)) return 'javascript';
    if (/\bfunction\b|\bconsole\.log\b/.test(text)) return 'javascript';

    return null;
  } catch {
    return null;
  }
}

module.exports = function detectLanguages(folderPath) {
  const languageStats = {};
  if (!folderPath) return languageStats;

  const allFiles = getAllFiles(folderPath);

  for (const file of allFiles) {
    try {
      const ext = path.extname(file).toLowerCase();
      let lang = extensionToLanguage[ext];
      if (!lang) {
        lang = guessLanguageByContent(file);
      }
      if (!lang) continue;

      const size = fs.statSync(file).size;
      languageStats[lang] = (languageStats[lang] || 0) + size;
    } catch {
      // skip unreadable files
      continue;
    }
  }

  return languageStats;
};
