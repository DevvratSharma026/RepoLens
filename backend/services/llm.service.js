let fetch = globalThis.fetch;
if (!fetch) {
    try {
        const _nodeFetch = require('node-fetch');
        // node-fetch v2 doesn't have .default, v3 does
        fetch = _nodeFetch.default || _nodeFetch;
    } catch (err) {
        console.error('[LLM] Failed to load node-fetch:', err.message);
        // leave undefined; validateConfig() or the fetch call will throw a clear error
    }
}
const { buildPrompt } = require('./promptBuilder.service');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_URL = process.env.OPENAI_URL;
const MODEL = process.env.OPENAI_MODEL;

function validateConfig() {
    const missing = [];
    if (!OPENAI_API_KEY) missing.push('OPENAI_API_KEY');
    if (!OPENAI_URL) missing.push('OPENAI_URL');
    if (!MODEL) missing.push('OPENAI_MODEL');
    if (missing.length) throw new Error(`LLM config missing: ${missing.join(', ')}`);
}


/**
 * Safely extract JSON from LLM output
 * - handle fenced ```json blocks
 * - find the first balanced { ... } object
 */
function extractJSON(text) {
    if (!text || typeof text !== 'string') {
        throw new Error('Invalid LLM response');
    }

    const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (fenceMatch && fenceMatch[1]) {
        text = fenceMatch[1].trim();
    }

    try {
        return JSON.parse(text);
    } catch (_) { }

    const startIdx = text.indexOf('{');
    if (startIdx === -1) {
        throw new Error('No JSON object found in LLM response');
    }

    let depth = 0;
    for (let i = startIdx; i < text.length; i++) {
        const ch = text[i];
        if (ch === '{') depth++;
        else if (ch === '}') depth--;

        if (depth === 0) {
            const candidate = text.slice(startIdx, i + 1);
            try {
                return JSON.parse(candidate);
            } catch (_) {
                break;
            }
        }
    }

    throw new Error('Failed to parse extracted JSON');
}

async function reviewChunkWithLLM(chunk) {
    validateConfig();
    
    if (!fetch) {
        throw new Error('fetch is not available. Install node-fetch or use Node.js 18+');
    }
    
    const { system, user } = buildPrompt(chunk);

    const payload = {
        model: MODEL,
        temperature: 0.2,
        messages: [
            { role: 'system', content: system },
            { role: 'user', content: user }
        ]
    };

    let response;
    try {
        response = await fetch(OPENAI_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
    } catch (err) {
        console.error('[LLM] fetch failed:', err);
        throw new Error(`LLM fetch failed: ${err.message}`);
    }

    if (!response.ok) {
        const text = await response.text().catch(() => '<failed-to-read-body>');
        console.error('[LLM] API error response:', response.status, response.statusText, text);
        throw new Error(`LLM API error: ${response.status} ${response.statusText} - ${text}`);
    }

    let data;
    try {
        data = await response.json();
    } catch (err) {
        const text = await response.text().catch(() => '<failed-to-read-body>');
        console.error('[LLM] invalid JSON response body:', text);
        throw new Error('LLM returned invalid JSON');
    }

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
        console.error('[LLM] missing content in API response');
        throw new Error('Empty LLM response');
    }

    return extractJSON(content);
}

module.exports = { reviewChunkWithLLM, validateConfig };