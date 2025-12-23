function buildPrompt(chunk) {
    const systemPrompt = `
You are a senior software engineer performing a code review.
You are concise, practical, and precise.
You do not speculate beyond the given code.
If something cannot be inferred, say "Not enough context".
`;

    const userPrompt = `
Review the following code chunk.

Tasks:
1. Briefly summarize what this code does.
2. Identify potential bugs, code smells, or risks.
3. Suggest concrete improvements or best practices.

Rules:
- Only comment on the given code.
- Do not assume other files exist.
- Do not rewrite the entire file.
- Do not mention formatting unless harmful.
- Respond ONLY in valid JSON.

Required JSON format:
{
  "summary": "string",
  "issues": [
    {
      "type": "bug | smell | risk | improvement",
      "message": "string"
    }
  ],
  "suggestions": ["string"]
}

File: ${chunk.filePath}
Language: ${chunk.language}
Chunk: ${chunk.chunkIndex + 1} of ${chunk.totalChunks}

Code:
${chunk.content}
`;

    return {
        system: systemPrompt.trim(),
        user: userPrompt.trim()
    };
}

module.exports = { buildPrompt };
