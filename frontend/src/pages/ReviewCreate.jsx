import React, { useEffect, useState } from 'react'
import { data, useNavigate, useParams } from 'react-router-dom'
import { createReview } from '../api/repo.api';

const ReviewCreate = () => {

    const {snapshotId} = useParams();
    const navigate = useNavigate();

    const [error, setError] = useState(null);

    useEffect(() => {
      const startReview = async () =>{
        try {
          const response = await createReview(snapshotId);

          navigate(`/review/${response.reviewId}`);
        } catch(err) {
          setError(err.message || "Error starting review");
        }
      }
      startReview();
    }, [snapshotId, navigate])

  return (
    <div className='p-8'>
        <h1 className='text-2xl font-bold mb-2'>Starting Code Review</h1>

        <p className='text-text-secondary'>Analyzing your repository. This may take a moment...</p>

        {error && (
            <p className='text-text-secondary'>{error}</p>
        )}
    </div>
  )
}

export default ReviewCreate