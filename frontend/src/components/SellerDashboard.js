import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SellerUpload from './SellerUpload';

import { API_URL } from '../config';

const SellerDashboard = () => {
  const [listings, setListings] = useState([]);
  const [soldListings, setSoldListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = { headers: { 'x-auth-token': token } };
     
      const activeRes = await axios.get(`${API_URL}/api/listings/seller/me`, config);
      const soldRes = await axios.get(`${API_URL}/api/listings/seller/me/sold`, config);
      
      setListings(activeRes.data || []);
      setSoldListings(soldRes.data || []);
    } catch (err) {
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkSold = async (listingId) => {
    if (!window.confirm('Are you sure you want to mark this property as sold?')) return;
    
    try {
      await axios.put(`${API_URL}/api/listings/${listingId}/sold`, {}, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      fetchListings(); 
    } catch (err) {
      alert('Error updating status');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <i className="fas fa-spinner fa-spin fa-3x" style={{ color: 'var(--color-primary)' }}></i>
        <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-grid">
      {/* Sidebar / Controls */}
      <div className="card" style={{ height: 'fit-content' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            width: '80px', height: '80px', background: '#dcfce7', color: '#166534',
            borderRadius: '50%', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem' 
          }}>
            <i className="fas fa-user-tie"></i>
          </div>
          <h3 style={{ fontSize: '1.25rem' }}>Seller Portal</h3>
        </div>

        <button 
          className={`btn btn-block ${activeTab === 'active' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('active')}
          style={{ marginBottom: '1rem', justifyItems: 'start' }}
        >
          <i className="fas fa-list"></i> Active Listings ({listings.length})
        </button>
        <button 
          className={`btn btn-block ${activeTab === 'sold' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('sold')}
          style={{ marginBottom: '1rem' }}
        >
          <i className="fas fa-check-circle"></i> Sold History ({soldListings.length})
        </button>
        <button 
          className="btn btn-outline btn-block"
          onClick={fetchListings}
          style={{ color: 'var(--color-text-main)', borderColor: 'var(--color-border)' }}
        >
          <i className="fas fa-sync-alt"></i> Refresh Data
        </button>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Upload Form (Only on Active Tab) */}
        {activeTab === 'active' && (
          <div className="card">
            <h3 className="card-title">
              <i className="fas fa-plus-circle"></i> List New Property
            </h3>
            <SellerUpload onUpload={fetchListings} />
          </div>
        )}

        {/* Listings List */}
        <div className="card">
          <h3 className="card-title">
            {activeTab === 'active' ? 'Your Active Properties' : 'Sales History'}
          </h3>
          
          {(activeTab === 'active' ? listings : soldListings).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
              <i className="fas fa-clipboard-list" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}></i>
              <p>No properties found in this section.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {(activeTab === 'active' ? listings : soldListings).map(listing => (
                <div key={listing._id} style={{ 
                  display: 'flex', gap: '1.5rem', padding: '1.5rem', 
                  border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)',
                  background: listing.status === 'sold' ? '#f0fdf4' : 'white'
                }}>
                  <img 
                    src={listing.images?.[0] || 'https://via.placeholder.com/150'}
                    alt={listing.title}
                    style={{ 
                      width: '180px', height: '140px', objectFit: 'cover', 
                      borderRadius: 'var(--radius-md)'
                    }}
                  />
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <h4 style={{ margin: 0, fontSize: '1.25rem' }}>{listing.title}</h4>
                      <span className={`badge ${
                        listing.status === 'approved' ? 'badge-success' : 
                        listing.status === 'pending' ? 'badge-warning' : 
                        listing.status === 'sold' ? 'badge-success' : 'badge-danger'
                      }`}>
                        {listing.status}
                      </span>
                    </div>

                    <div style={{ color: 'var(--color-primary)', fontWeight: '700', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                      ₹{Number(listing.price || 0).toLocaleString()}
                    </div>

                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                      <i className="fas fa-map-marker-alt"></i> {listing.city} • Posted {formatDate(listing.createdAt)}
                    </p>

                    {activeTab === 'active' && (
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button 
                          className="btn btn-success"
                          onClick={() => handleMarkSold(listing._id)}
                          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                        >
                          <i className="fas fa-check"></i> Mark as Sold
                        </button>
                        {listing.googleMapUrl && (
                          <a href={listing.googleMapUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                             Map
                          </a>
                        )}
                      </div>
                    )}
                    
                    {activeTab === 'sold' && (
                      <div style={{ color: 'var(--color-success)', fontWeight: '600' }}>
                        <i className="fas fa-handshake"></i> Sold on {formatDate(listing.soldAt)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SellerDashboard;
