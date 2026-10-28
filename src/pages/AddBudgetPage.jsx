import React, { useContext } from 'react'
import AddToBudget from '../components/AddToBudget'
import SetBudget from '../components/SetBudget'
import CategoriesContext from '../store/CategoriesContext'
import HistoryContext from '../store/HistoryContext'

export default function AddBudgetPage() {
  const { getTotalAmount, resetAmount } = useContext(CategoriesContext)
  const { addHistoryElement } = useContext(HistoryContext)
  const budget = getTotalAmount('Budget')

  function handleReset() {
    if (!window.confirm(`Reset your entire budget of ₹${budget.toLocaleString('en-IN')}? This cannot be undone.`)) return
    const id = crypto.randomUUID()
    addHistoryElement({ id, label: 'Budget Reset', amount: budget, type: 'Budget Reset', category: 'Budget' })
    resetAmount('Budget')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.5px' }}>Budget Management</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Add income or set a new budget limit</div>
      </div>

      {/* Current budget banner */}
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '20px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Current Budget</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32, color: 'var(--green)', letterSpacing: '-1px' }}>
            ₹{budget.toLocaleString('en-IN')}
          </div>
        </div>
        {budget > 0 && (
          <button onClick={handleReset} style={{
            background: 'rgba(248,113,113,0.1)', color: 'var(--red)',
            border: '1px solid rgba(248,113,113,0.2)', borderRadius: 'var(--radius-sm)',
            padding: '10px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>
            Reset Budget
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <AddToBudget />
        <SetBudget />
      </div>
    </div>
  )
}
