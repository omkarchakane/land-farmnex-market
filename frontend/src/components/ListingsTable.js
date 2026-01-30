import React from 'react';
import axios from 'axios';

import { API_URL } from '../config';

const ListingsTable = ({ listings, onUpdate }) => {
  const handleApprove = async (id) => {
    try {
      await axios.put(
        `${API_URL}/api/admin/listings/${id}/approve`,
        {},
        { headers: { 'x-auth-token': localStorage.getItem('adminToken') } }
      );
      onUpdate();
    } catch (err) {
      alert('Error approving listing');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(
        `${API_URL}/api/admin/listings/${id}/reject`,
        {},
        { headers: { 'x-auth-token': localStorage.getItem('adminToken') } }
      );
      onUpdate();
    } catch (err) {
      alert('Error rejecting listing');
    }
  };

  return (
    <div className="card">
      <h3 className="card-title">
        <i className="fas fa-tasks"></i> Manage Listings
      </h3>
      <div className="table-responsive" style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Property Details</th>
              <th>Price</th>
              <th>Location</th>
              <th>Seller</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map(listing => (
              <tr key={listing._id}>
                <td>
                  <img 
                    src={listing.images?.[0] || 'https://via.placeholder.com/60'} 
                    alt="Preview"
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                  />
                </td>
                <td>
                  <div style={{ fontWeight: '600', color: 'var(--color-text-main)' }}>{listing.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    {listing.info?.substring(0, 30)}...
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: '700', color: 'var(--color-primary)' }}>
                    ₹{Number(listing.price || 0).toLocaleString()}
                  </div>
                </td>
                <td>{listing.location?.city || listing.city}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fas fa-user-circle" style={{ color: 'var(--color-text-muted)' }}></i>
                    {listing.sellerName || 'Seller'}
                  </div>
                </td>
                <td>
                  <span className={`badge ${
                    listing.status === 'approved' ? 'badge-success' : 
                    listing.status === 'pending' ? 'badge-warning' : 'badge-danger'
                  }`}>
                    {listing.status}
                  </span>
                </td>
                <td>
                  {listing.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn btn-success" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                        onClick={() => handleApprove(listing._id)}
                        title="Approve"
                      >
                         <i className="fas fa-check"></i>
                      </button>
                      <button 
                        className="btn btn-danger" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                        onClick={() => handleReject(listing._id)}
                        title="Reject"
                      >
                         <i className="fas fa-times"></i>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListingsTable;
