import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const icon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const AdminDashboard = ({ listings = [], onClose }) => {
  
  const center = listings?.[0]?.location || [20.5937, 78.9629];

  return (
    <div className="card" style={{ height: '80vh', display: 'flex', flexDirection: 'column', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}><i className="fas fa-map-marked-alt"></i> Property Locations</h3>
        {onClose && (
          <button onClick={onClose} className="btn btn-danger btn-sm">
            <i className="fas fa-times"></i> Close
          </button>
        )}
      </div>
      
      <div style={{ flex: 1, borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
        <MapContainer 
          center={center} 
          zoom={5} 
          style={{ height: '100%', width: '100%' }}
          icon={icon}
        >
          <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {listings && listings
            .filter(listing => listing.location && listing.location.lat && listing.location.lng)
            .map(listing => (
              <Marker 
                key={listing._id} 
                position={[listing.location.lat, listing.location.lng]}
                icon={icon}
              >
                <Popup>
                  <div style={{ minWidth: '200px' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-primary)', fontSize: '1rem' }}>
                      {listing.title}
                    </h4>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                      ₹{listing.price?.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                      <i className="fas fa-map-pin"></i> {listing.location?.city}
                    </div>
                    <a 
                      href={`https://wa.me/${listing.contact}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-success btn-sm btn-block"
                      style={{ color: 'white', textDecoration: 'none', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                    >
                       WhatsApp
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
      
      {(!listings || listings.filter(l => l.location && l.location.lat).length === 0) && (
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '1rem' }}>
          <i className="fas fa-info-circle"></i> No location data available for current listings.
        </p>
      )}
    </div>
  );
};

export default AdminDashboard;
