import React, { useState, useEffect } from 'react';
import './SchedulePage.css';

function SchedulePage() {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/routes');
      const data = await response.json();
      setRoutes(data);
      if (data.length > 0) setSelectedRoute(data[0]);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <main className="schedule-page">
      <h1>📅 Route Schedule</h1>

      <div className="schedule-container">
        {/* Routes List */}
        <div className="routes-list">
          <h2>Available Routes</h2>
          {routes.map(route => (
            <div 
              key={route.id}
              className={`route-card ${selectedRoute?.id === route.id ? 'active' : ''}`}
              onClick={() => setSelectedRoute(route)}
            >
              <div className="route-name">{route.name}</div>
              <div className="route-info">
                <span>🚀 {route.start_point}</span>
                <span className="arrow">→</span>
                <span>🎯 {route.end_point}</span>
              </div>
              <div className="route-meta">
                <span>⏱️ {route.estimated_time_minutes} min</span>
                <span>📏 {route.distance_km} km</span>
              </div>
            </div>
          ))}
        </div>

        {/* Route Details */}
        <div className="route-details">
          {selectedRoute && (
            <div className="card">
              <h2>{selectedRoute.name}</h2>
              <div className="route-info-large">
                <div className="info-item">
                  <strong>Start Point:</strong>
                  <p>{selectedRoute.start_point}</p>
                </div>
                <div className="info-item">
                  <strong>End Point:</strong>
                  <p>{selectedRoute.end_point}</p>
                </div>
                <div className="info-item">
                  <strong>Distance:</strong>
                  <p>{selectedRoute.distance_km} km</p>
                </div>
                <div className="info-item">
                  <strong>Estimated Time:</strong>
                  <p>{selectedRoute.estimated_time_minutes} minutes</p>
                </div>
              </div>

              {/* Stops */}
              <h3>Route Stops</h3>
              {selectedRoute.stops && selectedRoute.stops.length > 0 ? (
                <div className="stops-timeline">
                  {selectedRoute.stops.map((stop, index) => (
                    <div key={stop.id} className="stop-item">
                      <div className="stop-circle">{index + 1}</div>
                      <div className="stop-content">
                        <strong>{stop.name}</strong>
                        <p>Wait time: {stop.waiting_time_minutes} min</p>
                        <small>Lat: {stop.latitude}, Long: {stop.longitude}</small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No stops for this route</p>
              )}

              {/* Schedule Times */}
              <h3>Departure Schedule</h3>
              <div className="schedule-grid">
                <div className="schedule-slot">06:00 AM</div>
                <div className="schedule-slot">08:00 AM</div>
                <div className="schedule-slot">10:00 AM</div>
                <div className="schedule-slot">12:00 PM</div>
                <div className="schedule-slot">02:00 PM</div>
                <div className="schedule-slot">04:00 PM</div>
                <div className="schedule-slot">06:00 PM</div>
                <div className="schedule-slot">08:00 PM</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default SchedulePage;
