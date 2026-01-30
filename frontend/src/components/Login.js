import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData);
    
    if (result.success) {
      const userRole = result.user.role;
      if (userRole === 'seller') navigate('/seller');
      else if (userRole === 'admin') navigate('/admin');
      else navigate('/listings');
    } else {
      setError(result.msg);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <i className="fas fa-user-circle"></i>
          <h2>Welcome Back</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              name="username" 
              className="form-input"
              value={formData.username} 
              onChange={handleChange} 
              placeholder="Enter your username"
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              className="form-input"
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Enter your password"
              required 
            />
          </div>
          
          {error && (
            <div style={{ 
              background: '#fee2e2', 
              color: '#b91c1c', 
              padding: '0.75rem', 
              borderRadius: 'var(--radius-md)', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}
          
          <button 
            type="submit" 
            className="btn btn-primary btn-block" 
            disabled={loading}
          >
            {loading ? (
              <><i className="fas fa-spinner fa-spin"></i> Signing in...</>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--color-text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Register now</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
