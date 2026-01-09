import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHeader from "../components/DashboardHeader";
import { useAuth } from "../context/AuthContext";
import { getDashboardStats, getUserReviews } from "../api/review.api";
import DashboardError from "../components/DashboardComponents/DashboardError";
import DashboardTable from "../components/DashboardComponents/DashboardTable";
import { getStatusBadge } from "../components/DashboardComponents/DashboardSwitchCase";
import { formatTimeAgo } from "../components/DashboardComponents/TimeFormatAgo";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  const [stats, setStats] = useState(null);
  const [recentReviews, setRecentReviews] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDashboardLoading(true);
        setError(null);

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

  formatTimeAgo();
  getStatusBadge();

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

  if (error) {
    return (
      <DashboardError />
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

            </div>
          )}

          {/* Recent Reviews Table */}
          <div className="bg-bg-card border border-bg-border rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-bg-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">
                Recent Reviews
              </h2>
              <Link className="text-sm text-primary hover:text-primary-hover font-medium flex items-center gap-1">
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
              </Link>
            </div>

            <div>
              {/* Table for md+ */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <DashboardTable />
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
                            <p className="text-lg font-medium mb-2">No reviews yet</p>
                            <p className="text-sm">Start by creating your first code review</p>
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
                          <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(review.status)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-1">
                              {review.issues !== null ? (
                                <span className="text-sm text-orange-400">{review.issues} issues</span>
                              ) : (
                                <span className="text-sm text-text-muted">—</span>
                              )}
                              {review.suggestions !== null && review.suggestions > 0 && (
                                <span className="text-xs text-green-400">{review.suggestions} suggestions</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-text-secondary">{formatTimeAgo(review.time)}</span>
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
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile list for small screens */}
              <div className="md:hidden p-4 flex flex-col gap-4">
                {recentReviews.length === 0 ? (
                  <div className="text-center text-text-muted py-8">
                    <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg font-medium mb-2">No reviews yet</p>
                    <p className="text-sm">Start by creating your first code review</p>
                  </div>
                ) : (
                  recentReviews.map((review) => (
                    <div
                      key={review.id}
                      onClick={() => navigate(`/review/${review.id}`)}
                      className="bg-bg-card border border-bg-border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-text-primary">{review.repository}</span>
                            <span className="px-2 py-0.5 text-xs bg-bg-secondary text-text-secondary rounded-full border border-bg-border">{review.branch}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-text-secondary">
                            <div>{getStatusBadge(review.status)}</div>
                            <div>
                              {review.issues !== null ? (
                                <span className="text-sm text-orange-400">{review.issues} issues</span>
                              ) : (
                                <span className="text-sm text-text-muted">—</span>
                              )}
                            </div>
                            {review.suggestions !== null && review.suggestions > 0 && (
                              <div className="text-xs text-green-400">{review.suggestions} suggestions</div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="text-sm text-text-secondary">{formatTimeAgo(review.time)}</div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/review/${review.id}`);
                            }}
                            className="text-sm text-primary hover:text-primary-hover font-medium flex items-center gap-1"
                          >
                            View
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
