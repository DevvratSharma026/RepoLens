import React from 'react'

const DashboardError = () => {
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
  )
}

export default DashboardError