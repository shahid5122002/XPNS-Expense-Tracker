import React, { useState, useContext } from 'react'
import HistoryContext from '../store/HistoryContext'
import HistoryModal from './HistoryModal'

const MONTHS = [
  { label: 'January', value: '1' },
  { label: 'February', value: '2' },
  { label: 'March', value: '3' },
  { label: 'April', value: '4' },
  { label: 'May', value: '5' },
  { label: 'June', value: '6' },
  { label: 'July', value: '7' },
  { label: 'August', value: '8' },
  { label: 'September', value: '9' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' },
]

const YEARS = ['2024', '2025', '2026', '2027']

export default function HistoryStack() {
  const {
    history,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
  } = useContext(HistoryContext)

  const [selected, setSelected] = useState(null)

  return (
    <div style={{
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--text-dim)', letterSpacing: 1, textTransform: 'uppercase' }}>
          Transaction History
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--bg3)', padding: '3px 10px', borderRadius: 99 }}>
          {history.length} items
        </span>
      </div>

      {/* Month & Year Filter */}
      <div style={{ display: 'flex', gap: 10 }}>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={selectStyle}
        >
          {MONTHS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          style={selectStyle}
        >
          {YEARS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Transaction List */}
      <div style={{ overflowY: 'auto', maxHeight: 280, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: 13 }}>
            No transactions for this month
          </div>
        ) : (
          history.map((item) => {
            const isIncome = item.type === 'Budget' || item.type === 'Expenses Reset'
            const color = isIncome ? 'var(--green)' : 'var(--red)'
            const dateStr = item.date_created
              ? new Date(item.date_created).toLocaleDateString('en-IN')
              : ''
            return (
              <div
                key={item.id}
                onClick={() => setSelected(item)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg3)', cursor: 'pointer',
                  border: '1px solid var(--border)',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.75'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
                    {item.label.length > 36 ? item.label.slice(0, 36) + '…' : item.label}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    {dateStr} · {item.category}
                  </div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color, fontFamily: 'var(--font-display)' }}>
                  {isIncome ? '+' : '-'}₹{parseFloat(item.amount).toLocaleString('en-IN')}
                </div>
              </div>
            )
          })
        )}
      </div>

      {selected && <HistoryModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

const selectStyle = {
  background: 'var(--bg3)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  padding: '8px 12px',
  color: 'var(--text)',
  fontSize: 13,
  outline: 'none',
  cursor: 'pointer',
}