import React, { useContext } from 'react'
import DisplayCategories from '../components/DisplayCategories'
import CategoriesContext from '../store/CategoriesContext'

export default function DisplayCategoriesPage() {
  const { getTotalAmount } = useContext(CategoriesContext)
  const expenses = getTotalAmount('Expenses')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.5px' }}>Categories</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Spending broken down by category</div>
      </div>

      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '20px 24px',
      }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Total Tracked</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32, color: 'var(--red)', letterSpacing: '-1px', marginTop: 4 }}>
          ₹{expenses.toLocaleString('en-IN')}
        </div>
      </div>

      <DisplayCategories />
    </div>
  )
}
