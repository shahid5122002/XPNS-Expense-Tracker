 
import React, { useState, useContext } from 'react'
import AuthContext from '../store/AuthContext'

const API = 'http://localhost:5000/api'

export default function LoginPage({ onSwitch }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useContext(AuthContext)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (!res.ok) return setError(data.error)
      login(data.token, data.username)
    } catch {
      setError('Server error. Make sure backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32, color: 'var(--accent2)', letterSpacing: '-1px' }}>
            💸 xpns
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>
            Sign in to your account
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={fieldGroup}>
            <label style={labelStyle}>Username</label>
            <input
              style={inputStyle}
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div style={fieldGroup}>
            <label style={labelStyle}>Password</label>
            <input
              style={inputStyle}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div style={errorStyle}>{error}</div>}

          <button type="submit" style={btnStyle} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <span onClick={onSwitch} style={{ color: 'var(--accent2)', cursor: 'pointer', fontWeight: 600 }}>
            Register here
          </span>
        </div>
      </div>
    </div>
  )
}

const pageStyle = {
  minHeight: '100vh', display: 'flex', alignItems: 'center',
  justifyContent: 'center', background: 'var(--bg)',
}
const cardStyle = {
  background: 'var(--bg2)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius)', padding: '40px 36px',
  width: 400, maxWidth: '90vw',
  boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
}
const fieldGroup = { display: 'flex', flexDirection: 'column', gap: 6 }
const labelStyle = { fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }
const inputStyle = {
  background: 'var(--bg3)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)', padding: '11px 14px',
  color: 'var(--text)', fontSize: 14, outline: 'none',
}
const errorStyle = { fontSize: 13, color: 'var(--red)', background: 'rgba(248,113,113,0.08)', padding: '8px 12px', borderRadius: 8 }
const btnStyle = {
  background: 'rgba(124,106,247,0.2)', color: 'var(--accent2)',
  border: '1px solid rgba(124,106,247,0.3)', borderRadius: 'var(--radius-sm)',
  padding: '12px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 8,
}