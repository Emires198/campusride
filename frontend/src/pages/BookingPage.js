import React, { useState, useEffect } from 'react';
import './BookingPage.css';

function BookingPage() {
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [formData, setFormData] = useState({
    route_id: '',
    bus_id: '',
    pickup_stop: '',
    dropoff_stop: '',
    booking_date: '',
    seat_number: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchRoutes();
    fetchBuses();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/routes');
      const data = await response.json();
      setRoutes(data);
    } catch (err) {
      console.error('Error fetching routes:', err);
    }
  };

  const fetchBuses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/buses');
      const data = await response.json();
      setBuses(data);
    } catch (err) {
      console.error('Error fetching buses:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Booking created successfully!');
        setFormData({
          route_id: '',
          bus_id: '',
          pickup_stop: '',
          dropoff_stop: '',
          booking_date: '',
          seat_number: ''
        });
      } else {
        setError(data.error || 'Booking failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="booking-page">
      <div className="card">
        <h1>📖 Book a Ride</h1>
        
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
            <div className="form-group">
              <label>Route</label>
              <select name="route_id" value={formData.route_id} onChange={handleChange} required>
                <option value="">Select a route</option>
                {routes.map(route => (
                  <option key={route.id} value={route.id}>
                    {route.name} - {route.start_point} to {route.end_point}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Bus</label>
              <select name="bus_id" value={formData.bus_id} onChange={handleChange} required>
                <option value="">Select a bus</option>
                {buses.map(bus => (
                  <option key={bus.id} value={bus.id}>
                    {bus.registration_number} - Cap: {bus.capacity}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Pickup Stop</label>
              <input
                type="text"
                name="pickup_stop"
                value={formData.pickup_stop}
                onChange={handleChange}
                placeholder="e.g., Hostel A"
                required
              />
            </div>

            <div className="form-group">
              <label>Dropoff Stop</label>
              <input
                type="text"
                name="dropoff_stop"
                value={formData.dropoff_stop}
                onChange={handleChange}
                placeholder="e.g., Lecture Hall"
                required
              />
            </div>

            <div className="form-group">
              <label>Booking Date & Time</label>
              <input
                type="datetime-local"
                name="booking_date"
                value={formData.booking_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Seat Number</label>
              <input
                type="text"
                name="seat_number"
                value={formData.seat_number}
                onChange={handleChange}
                placeholder="e.g., A01"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Booking...' : 'Book Now'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default BookingPage;
