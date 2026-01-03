import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../api/auth.api';
import DashboardLayout from '../layouts/DashboardLayout';

const NewReview = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('token');
        document.cookie = "token=; Max-Age=0; path=/;";
        navigate('/login');
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getMe();
                setUser(data.user);
            } catch (err) {
                handleLogout();
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
                    <h1 className="text-2xl font-bold text-text-primary">Loading...</h1>
                </div>
            </div>
        )
    }

    return (
        <DashboardLayout user={user} onLogout={handleLogout}>
            <div className="flex-1 overflow-y-auto bg-bg">
                {/* Header */}
                <header className="px-8 py-6 border-b border-bg-border bg-bg">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">
                            New Code Review
                        </h1>
                        <p className="text-text-secondary mt-1">
                            Choose how you want to submit your code to review.
                        </p>
                    </div>
                </header>

                {/* Main Content */}
                <div className="p-8">
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl'>
                        <div
                            onClick={() => navigate("/review/upload")}
                            className='cursor-pointer p-8 rounded-lg border border-bg-border bg-bg-card hover:bg-bg-secondary hover:border-primary/50 transition-all group'
                        >
                            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            <h2 className='text-xl font-semibold mb-2 text-text-primary'>Upload Zip</h2>
                            <p className='text-text-muted'>Upload a zipped file from your local machine</p>
                        </div>

                        <div
                            onClick={() => navigate("/review/github")}
                            className='cursor-pointer p-8 rounded-lg border border-bg-border bg-bg-card hover:bg-bg-secondary hover:border-primary/50 transition-all group'
                        >
                            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h2 className='text-xl font-semibold mb-2 text-text-primary'>GitHub Repository</h2>
                            <p className='text-text-muted'>Analyze a public GitHub repository by URL</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default NewReview