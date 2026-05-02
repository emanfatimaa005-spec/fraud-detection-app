// Transactions.js - add and view transactions
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { addTransaction, getTransactions } from './api'

function Transactions() {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    amount: '',
    transactionType: 'purchase',
    location: '',
    merchantName: ''
  })

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await getTransactions()
        setTransactions(response.data)
      } catch (err) {
        setError('Failed to load transactions')
      } finally {
        setLoading(false)
      }
    }
    fetchTransactions()
  }, [])

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await addTransaction(formData)
      setMessage(response.data.message)
      setTransactions([response.data.transaction, ...transactions])
      setFormData({
        amount: '',
        transactionType: 'purchase',
        location: '',
        merchantName: ''
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setSubmitLoading(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>🛡️ Fraud Detection System</h2>
        <div>
          <button style={styles.navBtn} onClick={() => navigate('/dashboard')}>
            Dashboard
          </button>
          <button style={styles.navBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>➕ Add New Transaction</h3>

          {error && <p style={styles.error}>{error}</p>}
          {message && <p style={styles.success}>{message}</p>}

          <form onSubmit={handleSubmit}>
            <input
              style={styles.input}
              type="number"
              name="amount"
              placeholder="Amount ($)"
              value={formData.amount}
              onChange={handleChange}
              required
            />
            <select
              style={styles.input}
              name="transactionType"
              value={formData.transactionType}
              onChange={handleChange}
            >
              <option value="purchase">Purchase</option>
              <option value="transfer">Transfer</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="deposit">Deposit</option>
            </select>
            <input
              style={styles.input}
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              required
            />
            <input
              style={styles.input}
              type="text"
              name="merchantName"
              placeholder="Merchant Name"
              value={formData.merchantName}
              onChange={handleChange}
              required
            />
            <button style={styles.button} type="submit" disabled={submitLoading}>
              {submitLoading ? 'Processing...' : 'Add Transaction'}
            </button>
          </form>
        </div>

        <h3 style={styles.listTitle}>📋 Transaction History</h3>
        {loading && <p>Loading transactions...</p>}

        {!loading && transactions.length === 0 && (
          <p style={styles.emptyText}>No transactions yet. Add one above!</p>
        )}

        {transactions.map((transaction) => (
          <div key={transaction._id} style={{
            ...styles.transactionCard,
            borderLeft: transaction.isFlagged ? '5px solid red' : '5px solid #4CAF50'
          }}>
            <div style={styles.transactionHeader}>
              <span style={styles.amount}>${transaction.amount}</span>
              <span style={{
                ...styles.badge,
                backgroundColor: transaction.isFlagged ? '#ff4444' : '#4CAF50'
              }}>
                {transaction.isFlagged ? '🚨 FLAGGED' : '✅ SAFE'}
              </span>
            </div>
            <p><strong>Type:</strong> {transaction.transactionType}</p>
            <p><strong>Merchant:</strong> {transaction.merchantName}</p>
            <p><strong>Location:</strong> {transaction.location}</p>
            <p><strong>Fraud Score:</strong> {transaction.fraudScore}/100</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f2f5' },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: '15px 30px',
    color: 'white'
  },
  navTitle: { margin: 0 },
  navBtn: {
    marginLeft: '10px',
    padding: '8px 16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  content: { padding: '30px', maxWidth: '800px', margin: '0 auto' },
  card: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '25px'
  },
  cardTitle: { color: '#333', marginBottom: '15px' },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  error: { color: 'red', marginBottom: '10px' },
  success: { color: 'green', marginBottom: '10px' },
  listTitle: { color: '#333', marginBottom: '15px' },
  emptyText: { color: '#666', textAlign: 'center' },
  transactionCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '15px'
  },
  transactionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  amount: { fontSize: '22px', fontWeight: 'bold', color: '#333' },
  badge: {
    padding: '5px 12px',
    borderRadius: '20px',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '12px'
  }
}

export default Transactions