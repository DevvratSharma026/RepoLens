import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import logo from '../assets/mainLogo.png'

const DashboardLayout = ({ children, user, onLogout }) => {

    const navigate = useNavigate();
    const location = useLocation();

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const isActive = (path) => {
        if (path === '/dashboard') {
            return location.pathname === '/dashboard';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className='min-h-screen w-full flex bg-bg text-text-primary'>
            {/* Sidebar */}
            <aside className='w-64 h-screen bg-bg-secondary border-r border-bg-border flex flex-col shrink-0 sticky top-0'>
                {/* Logo/Brand */}
                <div className='px-6 py-5 border-b border-bg-border'>
                    <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center'>
                            <img src={logo} className='rounded-xl'/>
                        </div>
                        <div className='text-xl font-bold text-text-primary'>
                            Code Nexus
                        </div>
                    </div>
                </div>

                {/* New Review Button */}
                <div className='px-4 py-4'>
                    <button
                        onClick={() => navigate("/review/new")}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>New Review</span>
                    </button>
                </div>

                {/* Navigation */}
                <nav className='px-3 flex-1'>
                    <NavItem
                        label="Dashboard"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        }
                        active={isActive('/dashboard')}
                        onClick={() => navigate('/dashboard')}
                    />
                    <NavItem
                        label="Reviews"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                        }
                        active={isActive('/review')}
                        onClick={() => navigate('/dashboard')}
                    />
                    <NavItem
                        label="Repositories"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                        }
                        active={isActive('/repositories')}
                        onClick={() => navigate('/repositories')}
                    />
                    <NavItem
                        label="Settings"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        }
                        active={isActive('/settings')}
                        onClick={() => navigate('/settings')}
                    />
                </nav>

                {/* User Profile Section */}
                <div className='px-4 py-4 border-t border-bg-border'>
                    <div className='flex items-center gap-3 mb-3'>
                        <div className='w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30'>
                            <span className='text-sm font-semibold text-primary'>
                                {getInitials(user?.firstName || user?.email)}
                            </span>
                        </div>
                        <div className='flex-1 min-w-0'>
                            <div className='text-sm font-medium text-text-primary truncate'>
                                {user?.firstName || 'User'} {user?.lastName || ''}
                            </div>
                            <div className='text-xs text-text-muted truncate'>
                                {user?.email || ''}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onLogout}
                        className='w-full flex items-center gap-2 text-sm text-text-secondary hover:text-red-400 transition-colors px-2 py-1.5 rounded hover:bg-bg-card'
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign out</span>
                    </button>
                </div>
            </aside>

            <main className='flex-1 h-full overflow-y-auto flex flex-col'>
                {children}
            </main>
        </div>
    )
}

const NavItem = ({ label, icon, active, onClick }) => (
    <div
        onClick={onClick}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-colors mb-1 ${active
                ? "bg-bg-card text-primary"
                : "text-text-secondary hover:bg-bg-card hover:text-text-primary"
            }`}
    >
        {icon}
        <span>{label}</span>
    </div>
);


export default DashboardLayout