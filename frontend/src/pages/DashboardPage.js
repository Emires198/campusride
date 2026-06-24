import React, { useState, useEffect } from 'react';
import './DashboardPage.css';

function DashboardPage({ student }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/students/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setDashboardData(data);
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <main className="dashboard-page">
      <h1>Welcome, {student?.first_name}! 👋</h1>
      
      {/* Profile Card */}
      <div className="card">
        <h2>Your Profile</h2>
        <div className="profile-grid">
          <div><strong>Registration Number:</strong> {dashboardData?.student?.registration_number}</div>
          <div><strong>Level:</strong> {dashboardData?.student?.level}</div>
          <div><strong>Hostel:</strong> {dashboardData?.student?.hostel}</div>
          <div><strong>Department:</strong> {dashboardData?.student?.department || 'N/A'}</div>
          <div><strong>Email:</strong> {dashboardData?.student?.email}</div>
          <div><strong>Phone:</strong> {dashboardData?.student?.phone || 'N/A'}</div>
        </div>
      </div>

      {/* Stats */}
      <div className="card-grid">
        <div className="card-small">
          <h3>💰 Wallet Balance</h3>
          <div className="value">${dashboardData?.wallet?.balance?.toFixed(2)}</div>
        </div>
        <div className="card-small">
          <h3>💸 Total Spent</h3>
          <div className="value">${dashboardData?.wallet?.total_spent?.toFixed(2)}</div>
        </div>
        <div className="card-small">
          <h3>🚌 Total Bookings</h3>
          <div className="value">{dashboardData?.bookings?.total || 0}</div>
        </div>
        <div className="card-small">
          <h3>✅ Completed</h3>
          <div className="value">{dashboardData?.bookings?.completed || 0}</div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <h2>Recent Transactions</h2>
        {dashboardData?.recent_transactions?.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Balance</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData?.recent_transactions?.map((transaction) => (
                <tr key={transaction.id}>
                  <td>
                    <span className={`badge badge-${transaction.transaction_type === 'credit' ? 'success' : 'warning'}`}>
                      {transaction.transaction_type.toUpperCase()}
                    </span>
                  </td>
                  <td>{transaction.description}</td>
                  <td>${transaction.amount?.toFixed(2)}</td>
                  <td>${transaction.balance_after?.toFixed(2)}</td>
                  <td>{new Date(transaction.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No transactions yet</p>
        )}
      </div>
    </main>
  );
}

export default DashboardPage;
