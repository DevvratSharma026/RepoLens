import React from 'react'
import { useNavigate } from 'react-router-dom'

const DashboardHeader = ({user}) => {
    
    const navigate = useNavigate();

  return (
    <header className="px-8 py-6 border-b border-bg-border bg-bg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">
                Dashboard
              </h1>
              <p className="text-text-secondary mt-1">
                Welcome back, {user?.firstName}! Here's your code review overview.
              </p>
            </div>

            <button
              onClick={() => navigate("/review/new")}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors"
            >
              <span>New Review</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </header>
  )
}

export default DashboardHeader