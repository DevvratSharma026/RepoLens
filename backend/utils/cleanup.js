const fs = require('fs/promises');

async function cleanupPath(targetPath) {
  try {
    if (!targetPath) return;
    await fs.rm(targetPath, { recursive: true, force: true });
    console.log('[cleanup] removed:', targetPath);
  } catch (err) {
    console.warn('[cleanup] failed to remove:', targetPath, err.message);
  }
}

module.exports = cleanupPath;
