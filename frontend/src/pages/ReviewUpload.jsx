import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadRepoZip } from "../api/repo.api";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";

const ReviewUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const navigate = useNavigate();

  const { user, loading: userLoading, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith(".zip")) {
        setFile(droppedFile);
        setError(null);
      } else {
        setError("Please upload a valid .zip file.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      return setError("Please select a file to upload.");
    }

    setLoading(true);
    setError(null);

    try {
      const data = await uploadRepoZip(file);

      //temp: store snapshotID for next step
      navigate(`/review/create/${data.snapshotId}`);
    } catch (err) {
      setError(err.message || "Failed to upload file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
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
        <header className="px-8 py-6 border-b border-bg-border bg-bg">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              Upload Repository Zip
            </h1>
            <p className="text-text-secondary mt-1">
              Upload a zipped file containing your repository code for review.
            </p>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-8">
          <div className="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload Area */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Select Zip File
                </label>
                <div className="mt-2">
                  <label
                    className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-bg-card transition-colors group ${
                      isDragging
                        ? "border-primary bg-bg-secondary"
                        : "border-bg-border hover:bg-bg-secondary hover:border-primary/50"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {file ? (
                        <>
                          <svg
                            className="w-12 h-12 text-primary mb-2"
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
                          <p className="text-sm font-medium text-text-primary mb-1">
                            {file.name}
                          </p>
                          <p className="text-xs text-text-muted">
                            Click to change file
                          </p>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-12 h-12 text-text-muted mb-2 group-hover:text-primary transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-text-secondary">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-text-muted">
                            ZIP file only
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept=".zip"
                      onChange={(e) => {
                        setFile(e.target.files[0]);
                        setError(null);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2">
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
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={loading || !file}
                  className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-[50%] justify-center"
                >
                  {loading ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span>Upload & Review</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/review/new")}
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
};

export default ReviewUpload;
