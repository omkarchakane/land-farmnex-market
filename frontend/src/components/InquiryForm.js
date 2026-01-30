import React, { useState } from 'react';

const InquiryForm = ({ listing, onClose }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', message: `I am interested in ${listing.title}` });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Name: ${formData.name}\nPhone: ${formData.phone}\nMessage: ${formData.message}`);
    window.open(`https://wa.me/${listing.contact}?text=${text}`, '_blank');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Contact Seller</h3>
          <p style={{ color: 'var(--color-primary)', fontWeight: '600' }}>{listing.title}</p>
        </div>

        <form>
          <div className="form-group">
            <label>Your Name</label>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <i className="fas fa-user" style={{ position: 'absolute', left: '1rem', color: 'var(--color-text-muted)' }}></i>
              <input 
                name="name" 
                className="form-input" 
                style={{ paddingLeft: '2.5rem' }}
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Full Name"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Your Phone</label>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <i className="fas fa-phone-alt" style={{ position: 'absolute', left: '1rem', color: 'var(--color-text-muted)' }}></i>
              <input 
                type="tel" 
                name="phone" 
                className="form-input" 
                style={{ paddingLeft: '2.5rem' }}
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="Mobile Number"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Message</label>
            <textarea 
              name="message" 
              className="form-textarea" 
              rows="3" 
              value={formData.message} 
              onChange={handleChange} 
            />
          </div>
          
          <button type="button" className="btn btn-success btn-block" onClick={handleWhatsApp}>
            <i className="fab fa-whatsapp"></i> Send via WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
};

export default InquiryForm;
