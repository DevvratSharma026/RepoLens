const fs = require('fs');

const CHUNK_SIZE = 2000;
const CHUNK_OVERLAP = 200; // Reduced overlap to prevent infinite loops
const MAX_CHUNKS = 2000;

function detectLanguage(ext) {
    // ext comes from path.extname() which includes the dot (e.g., '.js')
    const normalized = ext.toLowerCase();
    if(normalized === '.js' || normalized === '.jsx') return 'javascript';
    if(normalized === '.ts' || normalized === '.tsx') return 'typescript';
    return 'unknown';
}

function chunkText(text) {
    if (!text || typeof text !== 'string' || text.length === 0) {
        return [];
    }
    
    const chunks = [];
    let start = 0;
    let lastStart = -1; // Track last start position to detect infinite loops

    while(start < text.length) {
        // Safety check: prevent infinite loops
        if (start === lastStart) {
            break;
        }
        lastStart = start;
        
        const end = Math.min(start + CHUNK_SIZE, text.length);
        const chunk = text.slice(start, end);
        
        if (chunk.length > 0) {
            chunks.push(chunk);
        }

        //if we have reached the end, stop
        if(end >= text.length) break;
        
        // Move start forward with overlap
        start = end - CHUNK_OVERLAP;
        
        // Ensure we always make progress (move forward by at least 1)
        if (start <= lastStart) {
            start = lastStart + 1;
        }
        
        if(start < 0) start = 0;
    }
    return chunks;
}

function chunkFiles({files}) {
    const allChunks = [];

    for(const file of files) {
        if(allChunks.length >= MAX_CHUNKS) break;

        // Check if file exists and get stats
        let stats;
        try {
            stats = fs.lstatSync(file.absolutePath);
        } catch (statErr) {
            console.error(`[chunker] file not found or cannot access: ${file.absolutePath}`, statErr.message);
            continue;
        }
        
        if(!stats.isFile()) {
            console.warn(`[chunker] path is not a file: ${file.absolutePath}`);
            continue;
        }

        let content;
        try {
            content = fs.readFileSync(file.absolutePath, 'utf-8');
        } catch (readErr) {
            console.error(`[chunker] failed to read file: ${file.absolutePath}`, readErr.message);
            continue;
        }
        
        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            continue;
        }
        
        const chunks = chunkText(content);
        if (chunks.length === 0) {
            continue;
        }

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

module.exports = {chunkFiles, chunkText, detectLanguage};