import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createGitHubSnapshot } from '../api/github.api';
import { createReview } from '../api/repo.api';
import DashboardLayout from '../layouts/DashboardLayout';
import { getMe } from '../api/auth.api';

const ReviewGithub = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [repoUrl, setRepoUrl] = useState("");
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getMe();
                setUser(res.user);
            } catch(err) {
                localStorage.removeItem('token');
                document.cookie = "token=; Max-Age=0; path=/;";
                navigate('/login');
            } finally {
                setUserLoading(false);
            }
        }
        fetchUser();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        document.cookie = "token=; Max-Age=0; path=/;";
        navigate('/login');
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!repoUrl.trim()) {
            setError("Please enter a valid GitHub repository URL.");
            return;
        }
        try {
            setLoading(true);

            //create snapshot from github
            const snapshotRes = await createGitHubSnapshot({ repoUrl });
            const snapshotId = snapshotRes.snapshotId;

            //create review (reuse existing flow)
            const reviewRes = await createReview(snapshotId);

            //navigate to review status page
            navigate(`/review/${reviewRes.reviewId}`);
        } catch (err) {
            setError(err.message || "Failed to create review from GitHub repository.");
        } finally {
            setLoading(false);
        }
    }

    if (userLoading) {
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
                            Review GitHub Repository
                        </h1>
                        <p className="text-text-secondary mt-1">
                            Enter a public GitHub repository URL to analyze and review.
                        </p>
                    </div>
                </header>

                {/* Main Content */}
                <div className="p-8">
                    <div className="max-w-2xl">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* GitHub URL Input */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">
                                    GitHub Repository URL
                                </label>
                                <div className="mt-2 relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-text-muted" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        type="url"
                                        placeholder="https://github.com/username/repository"
                                        value={repoUrl}
                                        onChange={(e) => {
                                            setRepoUrl(e.target.value);
                                            setError(null);
                                        }}
                                        className="w-full pl-12 pr-4 py-3 bg-bg-card border border-bg-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                    />
                                </div>
                                <p className="mt-2 text-xs text-text-muted">
                                    Enter the full URL of a public GitHub repository
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-red-400 text-sm">{error}</p>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="flex items-center gap-4">
                                <button
                                    type="submit"
                                    disabled={loading || !repoUrl.trim()}
                                    className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-[50%] justify-center"
                                >
                                    {loading ? (
                                        <>
                                            <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            <span>Starting Review...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                            </svg>
                                            <span>Start Review</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/review/new')}
                                    className="px-6 py-3 border border-bg-border text-text-secondary hover:text-text-primary hover:border-primary/50 rounded-lg font-medium transition-colors w-[50%]"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default ReviewGithub