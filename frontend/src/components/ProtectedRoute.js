import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh',
        color: 'var(--color-primary)'
      }}>
        <i className="fas fa-spinner fa-spin fa-3x" style={{ marginBottom: '1rem' }}></i>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Verifying access...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/listings" />;
  }

  return children;
};

export default ProtectedRoute;
