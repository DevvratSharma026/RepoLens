/**
 * Normalize a message string for deduplication
 * - Convert to lowercase
 * - Remove extra whitespace
 * - Trim
 */
function normalizeMessage(message) {
    if (typeof message !== 'string') {
        return String(message || '').toLowerCase().trim().replace(/\s+/g, ' ');
    }
    return message.toLowerCase().trim().replace(/\s+/g, ' ');
}

function aggregateChunkResults({ chunkResults, meta }) {
    const summaries = [];
    const issueMap = new Map();
    const suggestionSet = new Set();

    for(const result of chunkResults) {
        if(!result || typeof result !== 'object') continue;

        //summaries
        if(typeof result.summary === 'string') {
            summaries.push(result.summary.trim());
        }

        //issues
        if(Array.isArray(result.issues)) {
            for(const issue of result.issues) {
                if(!issue?.message || !issue?.type) continue;

                const key = `${issue.type}:${normalizeMessage(issue.message)}`;

                if(!issueMap.has(key)) {
                    issueMap.set(key, {
                        type: issue.type,
                        message: issue.message, 
                        occurrences: 1
                    });
                } else {
                    issueMap.get(key).occurrences += 1;
                }
            }
        }

        //suggestions
        if(Array.isArray(result.suggestions)) {
            for(const s of result.suggestions) {
                if(typeof s === 'string' && s.trim()) {
                    suggestionSet.add(s.trim());
                }
            }
        }
    }

    //summary: merge top summaries
    const finalSummary = summaries
        .slice(0, 7)
        .join(' ')
        .slice(0, 800);     //hard cap to avoid bloat


    return {
        summary: finalSummary || 'No meaningful summary generated.',
        issues: Array.from(issueMap.values()),
        suggestions: Array.from(suggestionSet).slice(0, 10),
        meta: {
            ...meta,
            issuesFound: issueMap.size,
            suggestionsCount: suggestionSet.size
        }
    };
}

module.exports = { aggregateChunkResults };