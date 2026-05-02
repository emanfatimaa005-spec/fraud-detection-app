// Login.js - handles user login and registration
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser, registerUser } from './api'

function Login() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let response
      if (isLogin) {
        response = await loginUser({ email: formData.email, password: formData.password })
      } else {
        response = await registerUser(formData)
      }
      localStorage.setItem('token', response.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🛡️ Fraud Detection System</h2>
        <h3 style={styles.subtitle}>{isLogin ? 'Login' : 'Register'}</h3>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              style={styles.input}
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p style={styles.toggleText}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span style={styles.link} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5'
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '5px'
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '20px'
  },
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
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '10px'
  },
  toggleText: {
    textAlign: 'center',
    marginTop: '15px',
    color: '#666'
  },
  link: {
    color: '#4CAF50',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
}

export default Login