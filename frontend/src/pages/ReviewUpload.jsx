import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { uploadRepoZip } from '../api/repo.api';

const ReviewUpload = () => {

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!file) {
            return setError("Please select a file to upload.");
        }

        setLoading(true);
        setError(null);

        try {
            const data = await uploadRepoZip(file);
            console.log("snapshot created", data);

            //temp: store snapshotID for next step
            navigate(`/review/create/${data.snapshotId}`);
        } catch(err) {
            setError(err.message || "Failed to upload file. Please try again.");
        } finally {
            setLoading(false);
        }
    }
 
  return (
    <div className='p-8 max-w-xl'>
        <h1 className='text-2xl font-bold mb-4'>Upload Repository Zip</h1>

        <form onSubmit={handleSubmit} className='space-y-4'>
            <input 
                type='file'
                accept='.zip'
                onChange={(e) => setFile(e.target.files[0])}
                className='block w-full text-sm'
            />

            {error && (
                <p className='text-red-500 text-sm'>{error}</p>
            )}

            <button className='px-4 py-2 bg-primary text-white rounded'
            disabled={loading}>
                {loading? "Uploading...": "Upload"}
            </button>
        </form>
    </div>
  )
}

export default ReviewUpload