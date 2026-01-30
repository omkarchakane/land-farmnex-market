import React from 'react';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>
              <i className="fas fa-leaf"></i> FarmNex Market
            </h3>
            <p>
              Connecting farmers and buyers across India. The most trusted platform for agricultural land and farm produce.
            </p>
          </div>

          
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/listings">Browse Farms</a></li>
              <li><a href="/login">Seller Login</a></li>
              <li><a href="/register">Join Us</a></li>
              <li><a href="/listings">Map View</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contact Us</h4>
            <ul>
              <li><i className="fas fa-map-marker-alt"></i> Pune, Maharashtra, India</li>
              <li><i className="fas fa-phone"></i> +91 8459577556</li>
              <li><i className="fas fa-envelope"></i> support@farmnex.in</li>
            </ul>
          </div>

          <div className="footer-social">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon"><i className="fab fa-facebook-f"></i></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon"><i className="fab fa-twitter"></i></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon"><i className="fab fa-instagram"></i></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
            </div>
            <p style={{ fontSize: '0.85rem', marginTop: '1rem', color: '#9ca3af' }}>
              &copy; {new Date().getFullYear()} FarmNex Market. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
