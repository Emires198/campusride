import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ student, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          🚌 CampusRide
        </Link>
        
        <div className="navbar-menu">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/booking" className="nav-link">Book Ride</Link>
          <Link to="/tracking" className="nav-link">Track Bus</Link>
          <Link to="/schedule" className="nav-link">Schedule</Link>
          <Link to="/wallet" className="nav-link">Wallet</Link>
          {student && student.is_admin && (
            <Link to="/admin" className="nav-link admin">Admin</Link>
          )}
        </div>

        <div className="navbar-user">
          <span className="user-name">{student?.first_name || 'User'}</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
