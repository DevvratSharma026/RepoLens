const fs = require('fs');

const CHUCK_SIZE = 2000;
const CHUNK_OVERLAP = 2000;
const MAX_CHUNKS = 2000;

function detectLanguage(ext) {
    if(ext === 'js' || ext === '.jsx') return 'javascript';
    if(ext === 'ts' || ext === '.tsx') return 'typescript';
    return 'unkown';
}

function chunkText(text) {
    const chunks = [];
    let start = 0;

    while(start < text.length) {
        const end = start + CHUCK_SIZE;
        chunks.push(text.slice(start, end));
        start = end - CHUNK_OVERLAP;

        if(start < 0) start = 0;
    }
    return chunks;
}

function chunkFiles({files}) {
    const allChunks = [];

    for(const file of files) {
        if(allChunks.length >= MAX_CHUNKS) break;

        const content = fs.readFileSync(file.absolutePath, 'utf-8');
        const chunks = chunkText(content);
        const totalChunks = chunks.length;

        for(let i = 0; i < chunks.length; i++) {
            if(allChunks.length >= MAX_CHUNKS) break;

            allChunks.push({
                filePath: file.path,
                chunkIndex: i,
                totalChunks,
                language: detectLanguage(file.extension),
                content: chunks[i]
            });
        }
    }
    return {
        chunks: allChunks,
        truncated: allChunks.length >= MAX_CHUNKS
    };
}