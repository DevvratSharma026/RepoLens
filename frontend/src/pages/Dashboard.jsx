import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHeader from "../components/DashboardHeader";
import { useAuth } from "../context/AuthContext";
import { getDashboardStats, getUserReviews } from "../api/review.api";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  const [stats, setStats] = useState(null);
  const [recentReviews, setRecentReviews] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add this useEffect after your state declarations
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDashboardLoading(true);
        setError(null);

        // Fetch both stats and recent reviews
        const [statsResponse, reviewsResponse] = await Promise.all([
          getDashboardStats(),
          getUserReviews(4), // Get 4 recent reviews for the table
        ]);

        if (statsResponse.success) {
          setStats(statsResponse.stats);
        }

        if (reviewsResponse.success) {
          setRecentReviews(reviewsResponse.reviews);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Replace the existing formatTimeAgo function with:
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return date.toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Completed
          </span>
        );
      case "in-progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            In Progress
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  if (loading || dashboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
          <h1 className="text-2xl font-bold text-text-primary">
            Loading Dashboard...
          </h1>
        </div>
      </div>
    );
  }

  // Add this after your loading check:
  if (error) {
    return (
      <DashboardLayout user={user} onLogout={handleLogout}>
        <div className="flex-1 overflow-y-auto bg-bg">
          <DashboardHeader user={user} />
          <div className="p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-400 text-5xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                Error Loading Dashboard
              </h2>
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <div className="flex-1 overflow-y-auto bg-bg">
        {/* Header */}
        <DashboardHeader user={user} />

        {/* Main Content */}
        <div className="p-8">
          {/* Statistics Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Total Reviews Card */}
              <div className="bg-bg-card border border-bg-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-text-primary mb-1">
                  {stats.totalReviews}
                </div>
                <div className="text-sm text-text-secondary">Total Reviews</div>
              </div>

              {/* Total Issues Card */}
              <div className="bg-bg-card border border-bg-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-text-primary mb-1">
                  {stats.totalIssues}
                </div>
                <div className="text-sm text-text-secondary">Total Issues</div>
              </div>

              {/* Total Suggestions Card */}
              <div className="bg-bg-card border border-bg-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-text-primary mb-1">
                  {stats.totalSuggestions}
                </div>
                <div className="text-sm text-text-secondary">
                  Total Suggestions
                </div>
              </div>
            </div>
          )}

          {/* Recent Reviews Table */}
          <div className="bg-bg-card border border-bg-border rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-bg-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">
                Recent Reviews
              </h2>
              <button className="text-sm text-primary hover:text-primary-hover font-medium flex items-center gap-1">
                View all
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-bg-border">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Repository
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Branch
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Issues/Suggestions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bg-border">
                  {recentReviews.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center">
                        <div className="text-text-muted">
                          <svg
                            className="w-12 h-12 mx-auto mb-4 opacity-50"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <p className="text-lg font-medium mb-2">
                            No reviews yet
                          </p>
                          <p className="text-sm">
                            Start by creating your first code review
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    recentReviews.map((review) => (
                      <tr
                        key={review.id}
                        className="hover:bg-bg-secondary transition-colors cursor-pointer"
                        onClick={() => navigate(`/review/${review.id}`)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-text-muted"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                              />
                            </svg>
                            <span className="text-sm font-medium text-text-primary">
                              {review.repository}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-bg-secondary text-text-secondary border border-bg-border">
                            {review.branch}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(review.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            {review.issues !== null ? (
                              <span className="text-sm text-orange-400">
                                {review.issues} issues
                              </span>
                            ) : (
                              <span className="text-sm text-text-muted">—</span>
                            )}
                            {review.suggestions !== null &&
                              review.suggestions > 0 && (
                                <span className="text-xs text-green-400">
                                  {review.suggestions} suggestions
                                </span>
                              )}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-text-secondary">
                            {formatTimeAgo(review.time)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/review/${review.id}`);
                            }}
                            className="text-sm text-primary hover:text-primary-hover font-medium flex items-center gap-1"
                          >
                            View
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
