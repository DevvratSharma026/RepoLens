import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHeader from "../components/DashboardHeader";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  // Mock data - TODO: Replace with actual API calls
  const [stats] = useState({
    totalReviews: 142,
    totalReviewsChange: 12,
    issuesDetected: 847,
    issuesDetectedChange: 5,
    issuesResolved: 739,
    issuesResolvedChange: 18,
    avgReviewTime: 2.3,
    avgReviewTimeChange: -8,
  });

  const [recentReviews] = useState([
    {
      id: "1",
      repository: "frontend-app",
      branch: "feature/auth",
      status: "completed",
      issues: 12,
      time: "5 mins ago",
    },
    {
      id: "2",
      repository: "api-service",
      branch: "fix/performance",
      status: "in-progress",
      issues: null,
      time: "12 mins ago",
    },
    {
      id: "3",
      repository: "shared-components",
      branch: "main",
      status: "completed",
      issues: 3,
      time: "1 hour ago",
    },
    {
      id: "4",
      repository: "mobile-app",
      branch: "feature/notifications",
      status: "completed",
      issues: 8,
      time: "2 hours ago",
    },
  ]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatTimeAgo = (timeStr) => timeStr;

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
          <h1 className="text-2xl font-bold text-text-primary">Loading...</h1>
        </div>
      </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  <span
                    className={`text-xs font-medium ${stats.totalReviewsChange > 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    {stats.totalReviewsChange > 0 ? "+" : ""}
                    {stats.totalReviewsChange}%
                  </span>
                </div>
                <div className="text-3xl font-bold text-text-primary mb-1">
                  {stats.totalReviews}
                </div>
                <div className="text-sm text-text-secondary">Total Reviews</div>
              </div>

              {/* Issues Detected Card */}
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
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <span
                    className={`text-xs font-medium ${stats.issuesDetectedChange > 0 ? "text-red-400" : "text-green-400"}`}
                  >
                    {stats.issuesDetectedChange > 0 ? "+" : ""}
                    {stats.issuesDetectedChange}%
                  </span>
                </div>
                <div className="text-3xl font-bold text-text-primary mb-1">
                  {stats.issuesDetected}
                </div>
                <div className="text-sm text-text-secondary">
                  Issues Detected
                </div>
              </div>

              {/* Issues Resolved Card */}
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span
                    className={`text-xs font-medium ${stats.issuesResolvedChange > 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    {stats.issuesResolvedChange > 0 ? "+" : ""}
                    {stats.issuesResolvedChange}%
                  </span>
                </div>
                <div className="text-3xl font-bold text-text-primary mb-1">
                  {stats.issuesResolved}
                </div>
                <div className="text-sm text-text-secondary">
                  Issues Resolved
                </div>
              </div>

              {/* Avg Review Time Card */}
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span
                    className={`text-xs font-medium ${stats.avgReviewTimeChange < 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    {stats.avgReviewTimeChange > 0 ? "+" : ""}
                    {stats.avgReviewTimeChange}%
                  </span>
                </div>
                <div className="text-3xl font-bold text-text-primary mb-1">
                  {stats.avgReviewTime}m
                </div>
                <div className="text-sm text-text-secondary">
                  Avg. Review Time
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
                      Issues
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
                  {recentReviews.map((review) => (
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
                        {review.issues !== null ? (
                          <span className="text-sm text-orange-400">
                            {review.issues} issues
                          </span>
                        ) : (
                          <span className="text-sm text-text-muted">—</span>
                        )}
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
                  ))}
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
