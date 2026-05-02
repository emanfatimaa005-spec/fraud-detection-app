// App.js - main app with routing
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './Login'
import Dashboard from './Dashboard'
import Transactions from './Transactions'

// Protected route - redirect to login if no token
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/" />
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/transactions" element={
          <PrivateRoute>
            <Transactions />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App