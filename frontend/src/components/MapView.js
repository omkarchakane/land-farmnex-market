import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapView = ({ listings, onClose }) => {
  const center = listings[0]?.location?.lat && listings[0]?.location?.lng 
    ? [listings[0].location.lat, listings[0].location.lng]
    : [20.5937, 78.9629]; 

  return (
    <div className="card" style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0', overflow: 'hidden' }}>
      <div style={{ 
        padding: '1.5rem', 
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--color-surface)'
      }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
          <i className="fas fa-map-marked-alt"></i> Property Locations ({listings.filter(l => l.location?.lat && l.location?.lng).length})
        </h3>
        <button 
          onClick={onClose} 
          className="btn btn-danger"
          style={{ padding: '0.5rem 1rem' }}
        >
          <i className="fas fa-times"></i> Close Map
        </button>
      </div>

      <div style={{ height: '600px', width: '100%', position: 'relative' }}>
        <MapContainer 
          center={center} 
          zoom={5} 
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {listings
            .filter(listing => listing.location?.lat && listing.location?.lng)
            .map((listing) => (
              <Marker 
                key={listing._id} 
                position={[listing.location.lat, listing.location.lng]}
              >
                <Popup maxWidth={350}>
                  <div style={{ minWidth: '300px' }}>
                    <h4 style={{ 
                      margin: '0 0 0.5rem 0', 
                      color: 'var(--color-primary-dark)', 
                      fontSize: '1.1rem',
                      borderBottom: '1px solid var(--color-border)',
                      paddingBottom: '0.5rem'
                    }}>
                      {listing.title}
                    </h4>
                    
                    <div className="badge badge-success" style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>
                      ₹{Number(listing.price || 0).toLocaleString()}
                    </div>
                    
                    <div style={{ marginBottom: '0.75rem' }}>
                      <strong><i className="fas fa-map-pin"></i> Location:</strong><br/>
                      <span style={{ color: 'var(--color-text-muted)' }}>{listing.location?.city || 'N/A'}</span>
                    </div>
                    
                    <p style={{ 
                      color: 'var(--color-text-main)', 
                      fontSize: '0.9rem',
                      marginBottom: '1rem'
                    }}>
                      {listing.info?.substring(0, 100) || 'No description available'}...
                    </p>
                    
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <a 
                        href={`https://wa.me/${listing.contact}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-success"
                        style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}
                      >
                         <i className="fab fa-whatsapp"></i> WhatsApp
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>

      {listings.filter(l => l.location?.lat && l.location?.lng).length === 0 && (
        <div style={{ 
          padding: '3rem', 
          textAlign: 'center', 
          color: 'var(--color-text-muted)',
          background: 'var(--color-background)'
        }}>
          <i className="fas fa-map-marker-slash" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}></i>
          <h4 style={{ margin: '0 0 0.5rem 0' }}>No Coordinates Found</h4>
          <p>Sellers need to add latitude/longitude coordinates for properties to appear on the map.</p>
        </div>
      )}
    </div>
  );
};

export default MapView;
