import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getReviewById } from '../api/review.api';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
const POLL_INTERVAL = 3000;

const ReviewStatus = () => {

    const [status, setStatus] = useState("pending");
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const {reviewId} = useParams();

    useEffect(() => {
        let intervalId;

        const fetchStatus = async () => {
            try {
                const data = await getReviewById(reviewId);
                const review = data.review;
                setStatus(review.status);

                if(review.status === "completed") {
                    setResult(review.result);
                    clearInterval(intervalId);
                }

                if(review.status === "failed") {
                    setError(review.error || "Review failed");
                    clearInterval(intervalId);
                }
            } catch(err) {
                setError(err.message || "Error fetching review status");
                clearInterval(intervalId);
            }
        };

        //initial fetch 
        fetchStatus();
        //polling
        intervalId = setInterval(fetchStatus, POLL_INTERVAL);

        return () => clearInterval(intervalId);
    }, [reviewId]);

    const getIssueTypeColor = (type) => {
        switch(type?.toLowerCase()) {
            case 'bug':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'risk':
                return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
            case 'smell':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const getIssueTypeLabel = (type) => {
        return type?.charAt(0).toUpperCase() + type?.slice(1).toLowerCase() || 'Issue';
    };

  return (
    <div className="h-full flex flex-col bg-bg">
      {/* Header */}
      <div className="px-8 py-6 border-b border-bg-border bg-bg-secondary">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Code Review Results
        </h1>
        {status === "completed" && result && (
          <p className="text-text-secondary text-sm">
            Review completed • {result.meta?.filesReviewed || 0} files reviewed
          </p>
        )}
      </div>

      {/* Loading States */}
      {status === "pending" && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
            <p className="text-text-secondary text-lg">
              Review queued. Waiting for worker…
            </p>
          </div>
        </div>
      )}

      {status === "processing" && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
            <p className="text-text-secondary text-lg">
              Review in progress. Analyzing your code…
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {status === "failed" && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-red-400 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Review Failed</h2>
            <p className="text-red-400">
              {error || "An error occurred during the review process"}
            </p>
          </div>
        </div>
      )}

      {/* Results View */}
      {status === "completed" && result && (
        <div className="flex-1 overflow-hidden flex">
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-bg-border scrollbar-track-bg-card">
            {/* Summary Section */}
            {result.summary && (
              <div className="mb-8">
                  <Link to='/dashboard' className='text-blue-700 hover:text-blue-400 hover:underline'>dashboard</Link>
                <h2 className="text-xl font-semibold text-text-primary mb-3">Summary</h2>
                <div className="bg-bg-card border border-bg-border rounded-lg p-6">
                  <p className="text-text-secondary leading-relaxed">
                    {result.summary}
                  </p>
                </div>
              </div>
            )}

            {/* Issues Section */}
            {result.issues && result.issues.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-text-primary">
                    Issues Found
                  </h2>
                  <span className="px-3 py-1 bg-bg-card border border-bg-border rounded-full text-sm text-text-secondary">
                    {result.issues.length} {result.issues.length === 1 ? 'issue' : 'issues'}
                  </span>
                </div>
                <div className="space-y-4">
                  {result.issues.map((issue, index) => (
                    <div
                      key={index}
                      className="bg-bg-card border border-bg-border rounded-lg p-5 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-md text-xs font-semibold border ${getIssueTypeColor(issue.type)}`}>
                              {getIssueTypeLabel(issue.type)}
                            </span>
                            {issue.occurrences > 1 && (
                              <span className="text-xs text-text-muted">
                                {issue.occurrences} occurrences
                              </span>
                            )}
                          </div>
                          <p className="text-text-primary">
                            {issue.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Meta Information */}
            {result.meta && (
              <div className="bg-bg-card border border-bg-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Review Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-text-muted text-sm mb-1">Files Reviewed</div>
                    <div className="text-2xl font-bold text-text-primary">
                      {result.meta.filesReviewed || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-text-muted text-sm mb-1">Chunks Analyzed</div>
                    <div className="text-2xl font-bold text-text-primary">
                      {result.meta.chunkAnalyzed || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-text-muted text-sm mb-1">Issues Found</div>
                    <div className="text-2xl font-bold text-text-primary">
                      {result.meta.issuesFound || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-text-muted text-sm mb-1">Languages</div>
                    <div className="text-sm font-semibold text-text-primary">
                      {result.meta.languages?.join(', ') || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI Suggestions Sidebar */}
          {result.suggestions && result.suggestions.length > 0 && (
            <div className="w-80 border-l border-bg-border bg-bg-secondary overflow-y-auto">
              <div className="p-6 sticky top-0 bg-bg-secondary border-b border-bg-border z-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-text-primary">AI Suggestions</h3>
                  <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs font-semibold">
                    {result.suggestions.length}
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {result.suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="bg-bg-card border border-bg-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 shrink-0">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-primary text-xs font-bold">AI</span>
                        </div>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed flex-1">
                        {suggestion}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ReviewStatus