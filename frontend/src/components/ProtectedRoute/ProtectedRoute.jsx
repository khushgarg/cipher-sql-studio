import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Wraps a route so only authenticated users can access it.
 * Unauthenticated users are redirected to /login (preserving intended destination).
 *
 * Usage:
 *   <Route path="/attempt/:id" element={<ProtectedRoute><AttemptPage /></ProtectedRoute>} />
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, isAdmin } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
