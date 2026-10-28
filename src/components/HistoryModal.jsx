import React, { useContext } from 'react'
import CategoriesContext from '../store/CategoriesContext'
import HistoryContext from '../store/HistoryContext'

export default function HistoryModal({ item, onClose }) {
  const { deleteHistoryElement } = useContext(HistoryContext)
  const { subtractCategoryAmount, addCategory } = useContext(CategoriesContext)

  if (!item) return null

  const isIncome = item.type === 'Budget' || item.type === 'Expenses Reset'
  const color = isIncome ? 'var(--green)' : 'var(--red)'
  const dateStr = item.date_created
    ? new Date(item.date_created).toLocaleDateString('en-IN')
    : ''

  async function handleDelete() {
    await deleteHistoryElement(item.id)
    if (item.type === 'Expenses Reset') {
      await addCategory({ label: 'Uncategorized', amount: item.amount, id: crypto.randomUUID() })
    } else if (item.type === 'Budget Reset') {
      await addCategory({ label: 'Budget', amount: item.amount, id: crypto.randomUUID() })
    }
    await subtractCategoryAmount(item.category, item.amount)
    onClose()
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: 32, width: 420, maxWidth: '90vw',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          animation: 'fadeUp 0.25s ease both',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>Transaction Details</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 22, lineHeight: 1, cursor: 'pointer' }}>×</button>
        </div>

        {[
          ['Label', item.label],
          ['Type', item.type],
          ['Amount', `₹${parseFloat(item.amount).toLocaleString('en-IN')}`],
          ['Category', item.category],
          ['Date', dateStr],
          ['ID', item.id.slice(0, 18) + '…'],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
            <span style={{ color: 'var(--text-muted)' }}>{k}</span>
            <span style={{ color: k === 'Amount' ? color : 'var(--text)', fontWeight: k === 'Amount' ? 700 : 400 }}>{v}</span>
          </div>
        ))}

        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button onClick={onClose} style={btnStyle('default')}>Close</button>
          <button onClick={handleDelete} style={btnStyle('danger')}>Delete Transaction</button>
        </div>
      </div>
    </div>
  )
}

function btnStyle(variant) {
  return {
    flex: 1, padding: '10px 16px', borderRadius: 'var(--radius-sm)', border: 'none',
    fontWeight: 600, fontSize: 13, cursor: 'pointer',
    background: variant === 'danger' ? 'rgba(248,113,113,0.15)' : 'var(--bg3)',
    color: variant === 'danger' ? 'var(--red)' : 'var(--text)',
  }
}