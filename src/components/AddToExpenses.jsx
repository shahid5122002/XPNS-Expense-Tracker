import React, { useState, useContext } from 'react'
import CategoriesContext from '../store/CategoriesContext'
import AvailableCategoriesContext from '../store/AvailableCategoriesContext'
import HistoryContext from '../store/HistoryContext'

export default function AddToExpenses() {
  const [label, setLabel] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [newCat, setNewCat] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const { addCategory } = useContext(CategoriesContext)
  const { availableCategories, setAvailableCategories } = useContext(AvailableCategoriesContext)
  const { addHistoryElement } = useContext(HistoryContext)

  function handleAddCategory() {
    const val = newCat.trim()
    if (!val) return
    if (availableCategories.find((c) => c.label === val)) {
      setError('Category already exists.')
      return
    }
    setAvailableCategories((prev) => [...prev, { label: val, value: val, isused: false }])
    setNewCat('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!label.trim()) return setError('Please enter a label.')
    const amt = parseFloat(amount)
    if (!amount || isNaN(amt) || amt <= 0) return setError('Enter a valid positive amount.')
    if (!category) return setError('Please select a category.')

    const id = crypto.randomUUID()
    addCategory({ label: category, amount: amt, id, type: 'Expense' })
    addHistoryElement({ id, label: label.trim(), amount: amt, type: 'Expense', category })

    setAvailableCategories((prev) => prev.map((c) => c.value === category ? { ...c, isused: true } : c))

    setLabel('')
    setAmount('')
    setCategory('')
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2500)
  }

  return (
    <form onSubmit={handleSubmit} style={formCard}>
      <div style={formTitle}>Add Expense</div>

      <div style={fieldGroup}>
        <label style={labelStyle}>Label</label>
        <input style={inputStyle} placeholder="e.g. Lunch at Cafe" value={label} onChange={(e) => setLabel(e.target.value)} />
      </div>

      <div style={fieldGroup}>
        <label style={labelStyle}>Amount (₹)</label>
        <input style={inputStyle} type="number" min="0" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>

      <div style={fieldGroup}>
        <label style={labelStyle}>Category</label>
        <select style={{ ...inputStyle, appearance: 'none' }} value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">-- Select Category --</option>
          {availableCategories.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
        <label style={labelStyle}>Add New Category</label>
        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          <input
            style={{ ...inputStyle, flex: 1 }}
            placeholder="New category name"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
          />
          <button type="button" onClick={handleAddCategory} style={btnAdd}>+ Add</button>
        </div>
      </div>

      {error && <div style={errorStyle}>{error}</div>}
      {success && <div style={successStyle}>✓ Expense recorded!</div>}

      <button type="submit" style={btnRed}>Record Expense</button>
    </form>
  )
}

const formCard = { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }
const formTitle = { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--text)' }
const fieldGroup = { display: 'flex', flexDirection: 'column', gap: 6 }
const labelStyle = { fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }
const inputStyle = { background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '11px 14px', color: 'var(--text)', fontSize: 14, outline: 'none', width: '100%' }
const errorStyle = { fontSize: 13, color: 'var(--red)', background: 'rgba(248,113,113,0.08)', padding: '8px 12px', borderRadius: 8 }
const successStyle = { fontSize: 13, color: 'var(--green)', background: 'rgba(52,211,153,0.08)', padding: '8px 12px', borderRadius: 8 }
const btnRed = { background: 'rgba(248,113,113,0.15)', color: 'var(--red)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 'var(--radius-sm)', padding: '12px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }
const btnAdd = { background: 'var(--bg3)', color: 'var(--text-dim)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '11px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }
