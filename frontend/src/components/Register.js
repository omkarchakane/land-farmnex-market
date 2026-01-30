import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../config';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', password: '', role: 'buyer' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/auth/register`, formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <i className="fas fa-user-plus"></i>
          <h2>Create Account</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Join FarmNex Market today</p>
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
              placeholder="Choose a username"
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
              placeholder="Create a strong password"
              required 
            />
          </div>
          <div className="form-group">
            <label>I am a...</label>
            <select 
              name="role" 
              className="form-select"
              value={formData.role} 
              onChange={handleChange}
            >
              <option value="buyer">Buyer (Looking for Land)</option>
              <option value="seller">Seller (Selling Land)</option>
            </select>
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

          <button type="submit" className="btn btn-primary btn-block">
            Create Account
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--color-text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
