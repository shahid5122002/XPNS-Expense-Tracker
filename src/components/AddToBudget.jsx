import React, { useState, useContext } from 'react'
import CategoriesContext from '../store/CategoriesContext'
import HistoryContext from '../store/HistoryContext'

export default function AddToBudget() {
  const [label, setLabel] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const { addCategory } = useContext(CategoriesContext)
  const { addHistoryElement } = useContext(HistoryContext)

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!label.trim()) return setError('Please enter a label.')
    const amt = parseFloat(amount)
    if (!amount || isNaN(amt) || amt <= 0) return setError('Enter a valid positive amount.')

    const id = crypto.randomUUID()
    addCategory({ label: 'Budget', amount: amt, id, type: 'Budget' })
    addHistoryElement({ id, label: label.trim(), amount: amt, type: 'Budget', category: 'Budget' })

    setLabel('')
    setAmount('')
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2500)
  }

  return (
    <form onSubmit={handleSubmit} style={formCard}>
      <div style={formTitle}>Add Income</div>
      <div style={fieldGroup}>
        <label style={labelStyle}>Label</label>
        <input
          style={inputStyle}
          placeholder="e.g. Monthly Salary"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </div>
      <div style={fieldGroup}>
        <label style={labelStyle}>Amount (₹)</label>
        <input
          style={inputStyle}
          type="number"
          min="0"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      {error && <div style={errorStyle}>{error}</div>}
      {success && <div style={successStyle}>✓ Income added successfully!</div>}
      <button type="submit" style={btnGreen}>Add to Budget</button>
    </form>
  )
}

const formCard = {
  background: 'var(--bg2)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius)', padding: 28,
  display: 'flex', flexDirection: 'column', gap: 18,
}
const formTitle = {
  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--text)',
}
const fieldGroup = { display: 'flex', flexDirection: 'column', gap: 6 }
const labelStyle = { fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }
const inputStyle = {
  background: 'var(--bg3)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)', padding: '11px 14px',
  color: 'var(--text)', fontSize: 14, outline: 'none', width: '100%',
}
const errorStyle = { fontSize: 13, color: 'var(--red)', background: 'rgba(248,113,113,0.08)', padding: '8px 12px', borderRadius: 8 }
const successStyle = { fontSize: 13, color: 'var(--green)', background: 'rgba(52,211,153,0.08)', padding: '8px 12px', borderRadius: 8 }
const btnGreen = {
  background: 'rgba(52,211,153,0.15)', color: 'var(--green)', border: '1px solid rgba(52,211,153,0.3)',
  borderRadius: 'var(--radius-sm)', padding: '12px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
}
