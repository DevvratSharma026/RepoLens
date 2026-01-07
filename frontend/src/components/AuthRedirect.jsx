import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom';

const AuthRedirect = ({children}) => {

    const {isAuthenticated, loading} = useAuth();

    if(loading) return null;

    if(isAuthenticated) {
        return <Navigate to='/dashboard' replace />
    }

  return children;
}

export default AuthRedirect