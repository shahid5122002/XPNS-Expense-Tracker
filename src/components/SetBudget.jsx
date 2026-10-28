import React, { useState, useContext } from 'react'
import CategoriesContext from '../store/CategoriesContext'
import HistoryContext from '../store/HistoryContext'

export default function SetBudget() {
  const [label, setLabel] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const { getTotalAmount, resetAmount, addCategory } = useContext(CategoriesContext)
  const { addHistoryElement } = useContext(HistoryContext)

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!label.trim()) return setError('Please enter a label.')
    const amt = parseFloat(amount)
    if (!amount || isNaN(amt) || amt <= 0) return setError('Enter a valid positive amount.')
    const currentBudget = getTotalAmount('Budget')
    if (currentBudget > 0) {
      setShowConfirm(true)
    } else {
      applySet(amt, label.trim())
    }
  }

  function applySet(amt, lbl) {
    const currentBudget = getTotalAmount('Budget')
    resetAmount('Budget')
    const id = crypto.randomUUID()
    addCategory({ label: 'Budget', amount: amt, id, type: 'Budget' })
    addHistoryElement({ id, label: lbl, amount: currentBudget > 0 ? -currentBudget : 0, type: 'Budget Reset', category: 'Budget' })
    const id2 = crypto.randomUUID()
    addHistoryElement({ id: id2, label: lbl, amount: amt, type: 'Budget', category: 'Budget' })
    setLabel('')
    setAmount('')
    setSuccess(true)
    setShowConfirm(false)
    setTimeout(() => setSuccess(false), 2500)
  }

  return (
    <>
      <form onSubmit={handleSubmit} style={formCard}>
        <div style={formTitle}>Set Budget</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>This will replace your existing budget.</div>
        <div style={fieldGroup}>
          <label style={labelStyle}>Label</label>
          <input style={inputStyle} placeholder="e.g. Monthly Budget" value={label} onChange={(e) => setLabel(e.target.value)} />
        </div>
        <div style={fieldGroup}>
          <label style={labelStyle}>Amount (₹)</label>
          <input style={inputStyle} type="number" min="0" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        {error && <div style={errorStyle}>{error}</div>}
        {success && <div style={successStyle}>✓ Budget set successfully!</div>}
        <button type="submit" style={btnPurple}>Set Budget</button>
      </form>

      {showConfirm && (
        <div onClick={() => setShowConfirm(false)} style={overlay}>
          <div onClick={(e) => e.stopPropagation()} style={dialog}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Replace Budget?</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>
              Your current budget of <strong style={{ color: 'var(--text)' }}>₹{getTotalAmount('Budget').toLocaleString('en-IN')}</strong> will be replaced with <strong style={{ color: 'var(--text)' }}>₹{parseFloat(amount).toLocaleString('en-IN')}</strong>.
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowConfirm(false)} style={btnCancel}>Cancel</button>
              <button onClick={() => applySet(parseFloat(amount), label.trim())} style={btnConfirm}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const formCard = { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }
const formTitle = { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--text)' }
const fieldGroup = { display: 'flex', flexDirection: 'column', gap: 6 }
const labelStyle = { fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }
const inputStyle = { background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '11px 14px', color: 'var(--text)', fontSize: 14, outline: 'none', width: '100%' }
const errorStyle = { fontSize: 13, color: 'var(--red)', background: 'rgba(248,113,113,0.08)', padding: '8px 12px', borderRadius: 8 }
const successStyle = { fontSize: 13, color: 'var(--green)', background: 'rgba(52,211,153,0.08)', padding: '8px 12px', borderRadius: 8 }
const btnPurple = { background: 'rgba(124,106,247,0.15)', color: 'var(--accent2)', border: '1px solid rgba(124,106,247,0.3)', borderRadius: 'var(--radius-sm)', padding: '12px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }
const overlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(4px)' }
const dialog = { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 32, width: 380, maxWidth: '90vw', boxShadow: '0 24px 64px rgba(0,0,0,0.6)', animation: 'fadeUp 0.25s ease both' }
const btnCancel = { flex: 1, padding: '10px 16px', borderRadius: 'var(--radius-sm)', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer', background: 'var(--bg3)', color: 'var(--text)' }
const btnConfirm = { flex: 1, padding: '10px 16px', borderRadius: 'var(--radius-sm)', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer', background: 'rgba(124,106,247,0.15)', color: 'var(--accent2)' }
