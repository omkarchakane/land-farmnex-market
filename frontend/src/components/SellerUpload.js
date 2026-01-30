import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const SellerUpload = ({ onUpload }) => {
  const [formData, setFormData] = useState({
    title: '',
    city: '',
    price: '',
    contact: '',
    info: '',
    googleMapUrl: ''
  });
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const extractCoordsFromUrl = (url) => {
    try {
      const match = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (match) {
        return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
      }
      const match2 = url.match(/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (match2) {
        return { lat: parseFloat(match2[1]), lng: parseFloat(match2[2]) };
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleMapUrlChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, googleMapUrl: url });
    
    if (url.includes('google.com/maps')) {
      const coords = extractCoordsFromUrl(url);
      if (coords) {
        // Optional feedback could be a toast, but keeping it simple for now
        // console.log(`Found coords: ${coords.lat}, ${coords.lng}`);
      }
    }
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      alert('Maximum 3 images allowed');
      return;
    }
    setImages(files);
    setPreviewImages(files.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) return alert('Please select at least one image');

    setUploading(true);
    const data = new FormData();
    
    data.append('title', formData.title);
    data.append('city', formData.city);
    data.append('price', formData.price);
    data.append('contact', formData.contact);
    data.append('info', formData.info);
    data.append('googleMapUrl', formData.googleMapUrl);
    
    images.forEach(img => data.append('images', img));

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/listings`, data, {
        headers: { 'x-auth-token': token }
      });
      
      onUpload();
      e.target.reset();
      setFormData({ title: '', city: '', price: '', contact: '', info: '', googleMapUrl: '' });
      setImages([]);
      setPreviewImages([]);
      alert('Property listed successfully!');
    } catch (err) {
      alert('Error: ' + (err.response?.data?.msg || 'Upload failed'));
    }
    setUploading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="form-group">
          <label>Property Title <span style={{ color: 'red' }}>*</span></label>
          <input 
            className="form-input"
            placeholder="e.g. 5 Acre Farm in Nashik" 
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required 
          />
        </div>
        
        <div className="form-group">
          <label>City / District <span style={{ color: 'red' }}>*</span></label>
          <input 
            className="form-input"
            placeholder="e.g. Pune" 
            onChange={(e) => setFormData({...formData, city: e.target.value})}
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Price (₹) <span style={{ color: 'red' }}>*</span></label>
          <input 
            type="number" 
            className="form-input"
            placeholder="e.g. 2500000" 
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            required 
          />
        </div>
        
        <div className="form-group">
          <label>WhatsApp Number <span style={{ color: 'red' }}>*</span></label>
          <input 
            type="tel" 
            className="form-input"
            placeholder="e.g. 919876543210" 
            onChange={(e) => setFormData({...formData, contact: e.target.value})}
            required 
          />
        </div>
      </div>

      <div className="form-group">
        <label>Google Maps Link (Optional but Recommended)</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span style={{ padding: '0.75rem', background: '#f1f5f9', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-primary)' }}>
            <i className="fas fa-map-marker-alt"></i>
          </span>
          <input 
            type="url" 
            className="form-input"
            placeholder="Paste link from Google Maps"
            value={formData.googleMapUrl}
            onChange={handleMapUrlChange}
          />
        </div>
        <small style={{ color: 'var(--color-text-muted)', display: 'block', marginTop: '0.25rem' }}>
          Open Google Maps → Select Location → Share → Copy Link
        </small>
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea 
          className="form-textarea"
          rows="4" 
          placeholder="Describe soil type, water availability, crops suitable, etc..."
          onChange={(e) => setFormData({...formData, info: e.target.value})}
        />
      </div>

      <div className="form-group">
        <label>Photos (Max 3) <span style={{ color: 'red' }}>*</span></label>
        <div style={{ 
          border: '2px dashed var(--color-border)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '2rem',
          textAlign: 'center',
          background: '#f8fafc',
          cursor: 'pointer',
          position: 'relative'
        }}>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={handleImages} 
            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
            required 
          />
          <i className="fas fa-cloud-upload-alt" style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '1rem' }}></i>
          <p style={{ color: 'var(--color-text-main)', fontWeight: '500' }}>Click to upload property photos</p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>JPG, PNG allowed</p>
        </div>
        
        {previewImages.length > 0 && (
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            {previewImages.map((src, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img 
                  src={src} 
                  style={{ 
                    width: '100px', height: '100px', objectFit: 'cover', 
                    borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' 
                  }}
                  alt={`Preview ${i+1}`}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <button 
        type="submit" 
        className="btn btn-primary btn-block"
        disabled={uploading}
        style={{ marginTop: '2rem' }}
      >
        {uploading ? (
          <><i className="fas fa-spinner fa-spin"></i> Uploading...</>
        ) : (
          <><i className="fas fa-paper-plane"></i> Publish Listing</>
        )}
      </button>
    </form>
  );
};

export default SellerUpload;
