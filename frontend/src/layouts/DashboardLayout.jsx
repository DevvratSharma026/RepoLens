import React, { Children } from 'react'
import { useNavigate } from 'react-router-dom'
import NewReviewButton from '../Components/NewReviewButton';

const DashboardLayout = ({ children, user, onLogout }) => {

    const navigate = useNavigate();

    return (
        <div className='min-h-screen w-full flex bg-bg text-text-primary'>
            {/*sidebar*/}
            <aside className='w-64 h-full bg-bg-secondary border-r border-bg-border flex flex-col shrink-0'>
                <div className='px-6 py-5 text-xl font-bold'>
                    Code Nexus
                </div>

                <div className='px-4'>
                    <NewReviewButton props={"+ New Review"} />
                </div>

                <nav>
                    <NavItem label="Dashboard" active />
                    <NavItem label="Reviews" />
                    <NavItem label="Repositories" />
                    <NavItem label="Settings" />
                </nav>

                <div className='px-4 py-4 border-t border-bg-border mt-92'>
                    <div className='text-sm'>
                        {user.firstName}
                    </div>
                    <div className='text-xs text-text-muted'>
                        {user.email}
                    </div>

                    <button
                        onClick={onLogout}
                        className='mt-2 text-sm text-red-400 hover:underline'>
                        Sign Out
                    </button>
                </div>

            </aside>

            <main className='flex-1 h-full overflow-y-auto flex flex-col'>
                {children}
            </main>
        </div>
    )
}

const NavItem = ({ label, active }) => (
  <div
    className={`px-3 py-2 rounded-lg cursor-pointer text-md ${
      active
        ? "bg-bg-card text-primary"
        : "text-text-secondary hover:bg-bg-card hover:text-text-primary"
    }`}
  >
    {label}
  </div>
);


export default DashboardLayout