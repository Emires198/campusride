import React, { useState, useEffect } from 'react';
import './TrackingPage.css';

function TrackingPage() {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBuses();
    const interval = setInterval(fetchBuses, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/buses');
      const data = await response.json();
      setBuses(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <main className="tracking-page">
      <h1>🚌 Real-time Bus Tracking</h1>
      
      <div className="tracking-container">
        {/* Bus List */}
        <div className="bus-list">
          <h2>Available Buses</h2>
          {buses.map(bus => (
            <div 
              key={bus.id} 
              className={`bus-card ${selectedBus?.id === bus.id ? 'active' : ''}`}
              onClick={() => setSelectedBus(bus)}
            >
              <div className="bus-number">{bus.registration_number}</div>
              <div className="bus-info">
                <div>📍 {bus.current_location}</div>
                <div>👥 Capacity: {bus.capacity}</div>
                <div>
                  <span className={`status status-${bus.status}`}>
                    {bus.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bus Details */}
        <div className="bus-details">
          {selectedBus ? (
            <div className="card">
              <h2>{selectedBus.registration_number}</h2>
              <div className="detail-grid">
                <div>
                  <strong>Current Location:</strong>
                  <p>{selectedBus.current_location}</p>
                </div>
                <div>
                  <strong>Capacity:</strong>
                  <p>{selectedBus.capacity} passengers</p>
                </div>
                <div>
                  <strong>Status:</strong>
                  <p>
                    <span className={`badge badge-${selectedBus.status === 'in_transit' ? 'info' : 'success'}`}>
                      {selectedBus.status.toUpperCase()}
                    </span>
                  </p>
                </div>
                <div>
                  <strong>Coordinates:</strong>
                  <p>Lat: {selectedBus.latitude}, Long: {selectedBus.longitude}</p>
                </div>
              </div>
              <div className="map-placeholder">
                <p>🗺️ Map view will be displayed here (Google Maps integration)</p>
                <p>Location: {selectedBus.latitude}, {selectedBus.longitude}</p>
              </div>
            </div>
          ) : (
            <div className="card">
              <p style={{textAlign: 'center', color: '#999'}}>Select a bus to view details</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default TrackingPage;
