import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('buses');
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [newBusForm, setNewBusForm] = useState({ registration_number: '', capacity: '' });
  const [newRouteForm, setNewRouteForm] = useState({ name: '', start_point: '', end_point: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [busRes, routeRes] = await Promise.all([
        fetch('http://localhost:5000/api/buses'),
        fetch('http://localhost:5000/api/routes')
      ]);
      
      const busData = await busRes.json();
      const routeData = await routeRes.json();
      
      setBuses(busData);
      setRoutes(routeData);
    } catch (err) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBus = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/buses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newBusForm)
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Bus added successfully!');
        setNewBusForm({ registration_number: '', capacity: '' });
        fetchData();
      } else {
        setError(data.error || 'Failed to add bus');
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  const handleAddRoute = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/routes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newRouteForm)
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Route added successfully!');
        setNewRouteForm({ name: '', start_point: '', end_point: '' });
        fetchData();
      } else {
        setError(data.error || 'Failed to add route');
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <main className="admin-dashboard">
      <h1>🔧 Admin Dashboard</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'buses' ? 'active' : ''}`}
          onClick={() => setActiveTab('buses')}
        >
          🚌 Buses
        </button>
        <button 
          className={`tab-btn ${activeTab === 'routes' ? 'active' : ''}`}
          onClick={() => setActiveTab('routes')}
        >
          🗺️ Routes
        </button>
      </div>

      {/* Buses Tab */}
      {activeTab === 'buses' && (
        <div className="tab-content">
          <div className="card">
            <h2>Add New Bus</h2>
            <form onSubmit={handleAddBus} style={{maxWidth: '500px'}}>
              <div className="form-group">
                <label>Registration Number</label>
                <input
                  type="text"
                  value={newBusForm.registration_number}
                  onChange={(e) => setNewBusForm({...newBusForm, registration_number: e.target.value})}
                  placeholder="BUS001"
                  required
                />
              </div>
              <div className="form-group">
                <label>Capacity</label>
                <input
                  type="number"
                  value={newBusForm.capacity}
                  onChange={(e) => setNewBusForm({...newBusForm, capacity: e.target.value})}
                  placeholder="45"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Add Bus</button>
            </form>
          </div>

          <div className="card">
            <h2>Current Buses</h2>
            <table>
              <thead>
                <tr>
                  <th>Registration</th>
                  <th>Capacity</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {buses.map(bus => (
                  <tr key={bus.id}>
                    <td>{bus.registration_number}</td>
                    <td>{bus.capacity}</td>
                    <td>{bus.current_location || 'N/A'}</td>
                    <td><span className={`badge badge-${bus.status === 'in_transit' ? 'info' : 'success'}`}>{bus.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Routes Tab */}
      {activeTab === 'routes' && (
        <div className="tab-content">
          <div className="card">
            <h2>Add New Route</h2>
            <form onSubmit={handleAddRoute} style={{maxWidth: '500px'}}>
              <div className="form-group">
                <label>Route Name</label>
                <input
                  type="text"
                  value={newRouteForm.name}
                  onChange={(e) => setNewRouteForm({...newRouteForm, name: e.target.value})}
                  placeholder="Hotel to Lecture Hall"
                  required
                />
              </div>
              <div className="form-group">
                <label>Start Point</label>
                <input
                  type="text"
                  value={newRouteForm.start_point}
                  onChange={(e) => setNewRouteForm({...newRouteForm, start_point: e.target.value})}
                  placeholder="Hotel"
                  required
                />
              </div>
              <div className="form-group">
                <label>End Point</label>
                <input
                  type="text"
                  value={newRouteForm.end_point}
                  onChange={(e) => setNewRouteForm({...newRouteForm, end_point: e.target.value})}
                  placeholder="Lecture Hall"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Add Route</button>
            </form>
          </div>

          <div className="card">
            <h2>Current Routes</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Distance</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {routes.map(route => (
                  <tr key={route.id}>
                    <td>{route.name}</td>
                    <td>{route.start_point}</td>
                    <td>{route.end_point}</td>
                    <td>{route.distance_km || 'N/A'} km</td>
                    <td>{route.estimated_time_minutes || 'N/A'} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}

export default AdminDashboard;
