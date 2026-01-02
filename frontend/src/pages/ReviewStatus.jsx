import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getReviewById } from '../api/review.api';
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

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">
        Code Review Status
      </h1>

      {/* STATUS */}
      {status === "pending" && (
        <p className="text-text-secondary">
          Review queued. Waiting for worker…
        </p>
      )}

      {status === "processing" && (
        <p className="text-text-secondary">
          Review in progress. Analyzing your code…
        </p>
      )}

      {/* ERROR */}
      {status === "failed" && (
        <p className="text-red-500">
          {error}
        </p>
      )}

      {/* RESULT (TEMP VIEW) */}
      {status === "completed" && result && (
        <pre className="mt-6 p-4 bg-bg-card rounded text-sm overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default ReviewStatus