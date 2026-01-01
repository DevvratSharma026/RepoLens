import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getMe } from '../api/auth.api';

const ProtectedRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if(!token) {
            setLoading(false);
            setAuthorized(false);
            return;
        }
    })

    useEffect(() => {
        const validateUser = async () => {
            try {
                await getMe();
                setAuthorized(true);
            } catch (err) {
                localStorage.removeItem('token');
                setAuthorized(false);
            } finally {
                setLoading(false);
            }
        }
        validateUser();
    }, []);

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <p>Checking Authentication...</p>
            </div>
        )
    }

    if (!authorized) {
        return <Navigate to='/login' replace />;
    }

    return children;
}

export default ProtectedRoute