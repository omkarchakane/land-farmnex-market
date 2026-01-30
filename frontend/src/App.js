import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import BuyerListings from './components/BuyerListings';
import SellerDashboard from './components/SellerDashboard';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';

function AppContent() {
  const { user, logout, loading } = useAuth();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    setAppReady(true);
  }, []);

  if (!appReady || loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'var(--color-background)',
        color: 'var(--color-primary)',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <i className="fas fa-spinner fa-spin fa-3x"></i>
        <h2 style={{fontSize: '1.25rem', color: 'var(--color-text-muted)'}}>Loading FarmNex...</h2>
      </div>
    );
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <a href="/" className="navbar-brand">
            <i className="fas fa-leaf"></i>
            FarmNex Market
          </a>
          <div className="navbar-nav">
            {!user ? (
              <>
                <a href="/login" className="btn btn-primary">
                  <i className="fas fa-sign-in-alt"></i> Login
                </a>
                <a href="/register" className="btn btn-secondary">
                  <i className="fas fa-user-plus"></i> Register
                </a>
              </>
            ) : (
              <>
                <a href="/listings" className="nav-link">Listings</a>
                {user.role === 'seller' && (
                  <a href="/seller" className="nav-link">
                    <i className="fas fa-tractor"></i> Dashboard
                  </a>
                )}
                {user.role === 'admin' && (
                  <a href="/admin" className="nav-link">
                    <i className="fas fa-shield-alt"></i> Admin
                  </a>
                )}
                <button onClick={logout} className="btn btn-danger">
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="main-container">
        <Routes>
          <Route path="/" element={<Navigate to="/listings" />} />
          <Route path="/listings" element={<BuyerListings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/seller" element={
            <ProtectedRoute roles={['seller']}>
              <SellerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
