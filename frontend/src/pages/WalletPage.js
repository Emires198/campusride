import React, { useState, useEffect } from 'react';
import './WalletPage.css';

function WalletPage() {
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [addMoneyForm, setAddMoneyForm] = useState({ amount: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, []);

  const fetchWallet = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/wallet/summary', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (response.ok) setWalletData(data);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/wallet/transactions', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (response.ok) setTransactions(data.transactions);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoney = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/wallet/add-money', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: parseFloat(addMoneyForm.amount),
          description: addMoneyForm.description
        })
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Money added successfully!');
        setAddMoneyForm({ amount: '', description: '' });
        fetchWallet();
        fetchTransactions();
      } else {
        setError(data.error || 'Failed to add money');
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <main className="wallet-page">
      <h1>💰 Wallet</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Wallet Stats */}
      <div className="card-grid">
        <div className="card-small">
          <h3>Current Balance</h3>
          <div className="value">${walletData?.current_balance?.toFixed(2)}</div>
        </div>
        <div className="card-small">
          <h3>Total Credited</h3>
          <div className="value">${walletData?.total_credited?.toFixed(2)}</div>
        </div>
        <div className="card-small">
          <h3>Total Debited</h3>
          <div className="value">${walletData?.total_debited?.toFixed(2)}</div>
        </div>
      </div>

      {/* Add Money */}
      <div className="card">
        <h2>Add Money to Wallet</h2>
        <form onSubmit={handleAddMoney} style={{maxWidth: '500px'}}>
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              value={addMoneyForm.amount}
              onChange={(e) => setAddMoneyForm({...addMoneyForm, amount: e.target.value})}
              placeholder="Enter amount"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              value={addMoneyForm.description}
              onChange={(e) => setAddMoneyForm({...addMoneyForm, description: e.target.value})}
              placeholder="e.g., Top-up via card"
            />
          </div>
          <button type="submit" className="btn btn-success">Add Money</button>
        </form>
      </div>

      {/* Transaction History */}
      <div className="card">
        <h2>Transaction History</h2>
        {transactions.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Balance After</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
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
          <p>No transactions</p>
        )}
      </div>
    </main>
  );
}

export default WalletPage;
