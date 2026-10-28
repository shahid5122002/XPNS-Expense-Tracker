import React from 'react'

export default function DisplayCard({ label, amount, color, icon }) {
  return (
    <div style={{
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '28px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      boxShadow: 'var(--card-shadow)',
      position: 'relative',
      overflow: 'hidden',
      animation: 'fadeUp 0.4s ease both',
    }}>
      {/* Glow blob
      <div style={{
       position: 'absolute', top: -30, right: -30,
        width: 100, height: 100,
        background: color === 'green' ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)',
        borderRadius: '50%',
        filter: 'blur(20px)',
        pointerEvents: 'none',
      }} />--> */}
      <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.5, color: 'var(--text-muted)', fontWeight: 600 }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 34,
        fontWeight: 800,
        color: color === 'green' ? 'var(--green)' : color === 'red' ? 'var(--red)' : 'var(--text)',
        letterSpacing: '-1px',
      }}>
        ₹{amount.toLocaleString('en-IN')}
      </div>
    </div>
  )
}
