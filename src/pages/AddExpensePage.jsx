import React, { useContext } from 'react'
import AddToExpenses from '../components/AddToExpenses'
import CategoriesContext from '../store/CategoriesContext'
import HistoryContext from '../store/HistoryContext'

export default function AddExpensePage() {
  const { getTotalAmount, resetAmount } = useContext(CategoriesContext)
  const { addHistoryElement } = useContext(HistoryContext)
  const expenses = getTotalAmount('Expenses')
  const budget = getTotalAmount('Budget')

  function handleReset() {
    if (!window.confirm(`Reset all expenses (₹${expenses.toLocaleString('en-IN')})?`)) return
    const id = crypto.randomUUID()
    addHistoryElement({ id, label: 'Expenses Reset', amount: expenses, type: 'Expenses Reset', category: 'Uncategorized' })
    resetAmount('Expenses')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.5px' }}>Add Expense</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Record a new spending transaction</div>
      </div>

      {/* Stats banner */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', overflow: 'hidden',
      }}>
        <div style={{ padding: '20px 24px', borderRight: '1px solid var(--border)' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Total Expenses</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--red)', letterSpacing: '-0.5px', marginTop: 4 }}>
            ₹{expenses.toLocaleString('en-IN')}
          </div>
        </div>
        <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Remaining</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: budget - expenses >= 0 ? 'var(--green)' : 'var(--red)', letterSpacing: '-0.5px', marginTop: 4 }}>
              ₹{(budget - expenses).toLocaleString('en-IN')}
            </div>
          </div>
          {expenses > 0 && (
            <button onClick={handleReset} style={{
              background: 'rgba(248,113,113,0.1)', color: 'var(--red)',
              border: '1px solid rgba(248,113,113,0.2)', borderRadius: 'var(--radius-sm)',
              padding: '10px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>Reset</button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 560 }}>
        <AddToExpenses />
      </div>
    </div>
  )
}
