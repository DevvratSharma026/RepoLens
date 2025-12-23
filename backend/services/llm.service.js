const fetch = require('node-fetch');
const {buildPrompt} = require('./promptBuilder.service');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini'; // cheap + good enough for MVP

async function reviewChunkWithLLM(chunk) {
    const {system, user} = buildPrompt(chunk);

    const response = await fetch(OPENAI_URL, {
        method: "POST", 
        headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            method: MODEL,
            temperature: 0.2,
            messages: [
                {role: 'system', content: system},
                {role: 'user', content: user}
            ]
        })
    });

    if(!response.ok) {
        const text = await response.text();
        throw new Error('LLM API error ', text);
    }

    const data = await response.json();
    const content = data.choices?.messages?.content;

    if(!content) {
        throw new Error('Empty LLM response');
    }

    //strict JSON parsing
    try{
        return JSON.parse(content);
    } catch(err) {
        throw new Error('LLM returned invalid JSON');
    }
}

module.exports = { reviewChunkWithLLM }