import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BookingPage from './pages/BookingPage';
import WalletPage from './pages/WalletPage';
import AdminDashboard from './pages/AdminDashboard';
import TrackingPage from './pages/TrackingPage';
import SchedulePage from './pages/SchedulePage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      const studentData = localStorage.getItem('student');
      if (studentData) {
        setStudent(JSON.parse(studentData));
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('student');
    setIsAuthenticated(false);
    setStudent(null);
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Navbar student={student} onLogout={handleLogout} />}
        <Routes>
          <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} setStudent={setStudent} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={isAuthenticated ? <DashboardPage student={student} /> : <Navigate to="/login" />} />
          <Route path="/booking" element={isAuthenticated ? <BookingPage student={student} /> : <Navigate to="/login" />} />
          <Route path="/wallet" element={isAuthenticated ? <WalletPage student={student} /> : <Navigate to="/login" />} />
          <Route path="/tracking" element={isAuthenticated ? <TrackingPage /> : <Navigate to="/login" />} />
          <Route path="/schedule" element={isAuthenticated ? <SchedulePage /> : <Navigate to="/login" />} />
          <Route path="/admin" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
