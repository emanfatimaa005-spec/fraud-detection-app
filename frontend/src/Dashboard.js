// Dashboard.js - shows fraud reports and rankings
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFraudReports } from './api'

function Dashboard() {
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await getFraudReports()
        setReports(response.data)
      } catch (err) {
        setError('Failed to load fraud reports')
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/')
  }

  function getRiskColor(riskLevel) {
    if (riskLevel === 'high') return '#ff4444'
    if (riskLevel === 'medium') return '#ffaa00'
    return '#4CAF50'
  }

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>🛡️ Fraud Detection System</h2>
        <div>
          <button style={styles.navBtn} onClick={() => navigate('/transactions')}>
            Transactions
          </button>
          <button style={styles.navBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <h2 style={styles.pageTitle}>📊 Fraud Reports & Rankings</h2>

        {loading && <p>Loading reports...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {!loading && reports.length === 0 && (
          <div style={styles.emptyBox}>
            <p>No fraud reports yet!</p>
            <p>Add some transactions to see fraud analysis here.</p>
            <button style={styles.button} onClick={() => navigate('/transactions')}>
              Add Transactions
            </button>
          </div>
        )}

        {reports.map((report) => (
          <div key={report._id} style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.rank}>#{report.rank}</span>
              <span style={{
                ...styles.riskBadge,
                backgroundColor: getRiskColor(report.riskLevel)
              }}>
                {report.riskLevel.toUpperCase()} RISK
              </span>
            </div>
            <p><strong>Risk Score:</strong> {report.riskScore}/100</p>
            <p><strong>Amount:</strong> ${report.transaction?.amount}</p>
            <p><strong>Merchant:</strong> {report.transaction?.merchantName}</p>
            <p><strong>Status:</strong> {report.resolvedStatus}</p>
            <div style={styles.reasons}>
              <strong>Reasons:</strong>
              {report.reasons.map((reason, index) => (
                <p key={index} style={styles.reason}>⚠️ {reason}</p>
              ))}
            </div>
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
  pageTitle: { color: '#333', marginBottom: '20px' },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '15px'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  rank: { fontSize: '24px', fontWeight: 'bold', color: '#333' },
  riskBadge: {
    padding: '5px 12px',
    borderRadius: '20px',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '12px'
  },
  reasons: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#fff8e1',
    borderRadius: '5px'
  },
  reason: { margin: '5px 0', color: '#666' },
  emptyBox: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px'
  },
  error: { color: 'red' }
}

export default Dashboard