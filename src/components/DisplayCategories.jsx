import React, { useContext } from 'react'
import CategoriesContext from '../store/CategoriesContext'
import AvailableCategoriesContext from '../store/AvailableCategoriesContext'

const COLORS = ['#7c6af7', '#34d399', '#f87171', '#fbbf24', '#60a5fa', '#f472b6', '#a78bfa', '#fb923c']

export default function DisplayCategories() {
  const { categories, getTotalAmount, deleteCategory } = useContext(CategoriesContext)
  const { availableCategories, setAvailableCategories } = useContext(AvailableCategoriesContext)

  const expenseCategories = categories.filter((c) => c.label !== 'Budget')
  const totalExpenses = getTotalAmount('Expenses')

  function handleDelete(label) {
    const cat = availableCategories.find((c) => c.label === label)
    if (cat && cat.isused) {
      alert(`Cannot delete "${label}" — it has active transactions. Delete those transactions first.`)
      return
    }
    setAvailableCategories((prev) => prev.filter((c) => c.label !== label))
    deleteCategory(label)
  }

  if (expenseCategories.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontSize: 14 }}>
        No expense categories yet. Add some expenses first!
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
      {expenseCategories.map((cat, i) => {
        const pct = totalExpenses > 0 ? Math.round((cat.amount / totalExpenses) * 100) : 0
        const color = COLORS[i % COLORS.length]
        return (
          <div key={cat.label} style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: 20,
            borderTop: `3px solid ${color}`,
            display: 'flex', flexDirection: 'column', gap: 10,
            animation: 'fadeUp 0.35s ease both',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{cat.label}</div>
              <button
                onClick={() => handleDelete(cat.label)}
                title="Delete category"
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}
              >×</button>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color, letterSpacing: '-0.5px' }}>
              ₹{cat.amount.toLocaleString('en-IN')}
            </div>
            {/* Progress bar */}
            <div style={{ background: 'var(--bg3)', borderRadius: 99, height: 5, overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.5s ease' }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{pct}% of total expenses</div>
          </div>
        )
      })}
    </div>
  )
}
