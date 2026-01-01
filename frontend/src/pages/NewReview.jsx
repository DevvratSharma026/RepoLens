import React from 'react'
import { useNavigate } from 'react-router-dom'

const NewReview = () => {
    const navigate = useNavigate();
    return (
        <div className='p-8 max-w-3xl'>
            <h1 className='text-3xl font-bold mb-2'>New Code Review</h1>

            <p className='text-text-secondary mb-8'>Choose how you want to submit your code to review.</p>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div
                    onClick={() => navigate("/review/upload")}
                    className='cursor-pointer p-6 rounded-lg border border-bg-border bg-bg-card hover:bg-bg-secondary transition'
                >
                    <h2 className='text-xl font-semibold mb-2'>Upload Zip</h2>
                    <p className='text-text-muted text-md'>Upload a zipped file from your local machine</p>
                </div>

                <div
                    onClick={() => navigate("/review/github")}
                    className='cursor-pointer p-6 rounded-lg border border-bg-border bg-bg-card hover:bg-bg-secondary transition'>
                    <h2 className='text-xl font-semibold mb-2'>GitHub Repository</h2>
                    <p className='text-text-muted text-md'>Analyze a public GitHub repository by URL</p>
                </div>
            </div>
        </div>
    )
}

export default NewReview