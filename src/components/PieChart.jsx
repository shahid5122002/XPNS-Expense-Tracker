import React, { useRef, useEffect, useContext } from 'react'
import CategoriesContext from '../store/CategoriesContext'

function drawPie(context, data) {
  const total = data.reduce((s, d) => s + d.amount, 0)
  if (total === 0) return

  const cx = 130, cy = 130, r = 110
  context.clearRect(0, 0, 260, 260)

  let startAngle = -Math.PI / 2
  data.forEach((entry) => {
    const slice = (entry.amount / total) * Math.PI * 2
    const endAngle = startAngle + slice

    context.beginPath()
    context.moveTo(cx, cy)
    context.arc(cx, cy, r, startAngle, endAngle)
    context.fillStyle = entry.color
    context.fill()
    context.strokeStyle = '#0a0a0f'
    context.lineWidth = 3
    context.stroke()
    context.closePath()

    // label
    const mid = startAngle + slice / 2
    const lx = cx + Math.cos(mid) * (r * 0.65)
    const ly = cy + Math.sin(mid) * (r * 0.65)
    context.beginPath()
    context.font = 'bold 12px DM Sans'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillStyle = '#fff'
    const pct = Math.round((entry.amount / total) * 100)
    context.fillText(`${pct}%`, lx, ly)
    context.closePath()

    startAngle = endAngle
  })
}

export default function PieChart() {
  const { getTotalAmount } = useContext(CategoriesContext)
  const expenses = getTotalAmount('Expenses')
  const budget = getTotalAmount('Budget')
  const canvasRef = useRef(null)

  const data = [
    { label: 'Budget',   amount: Math.max(0, budget - expenses), color: '#34d399' },
    { label: 'Expenses', amount: expenses,                        color: '#f87171' },
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    drawPie(ctx, data)
  }, [budget, expenses])

  const isEmpty = budget === 0 && expenses === 0

  return (
    <div style={{
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
    }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--text-dim)', letterSpacing: 1, textTransform: 'uppercase' }}>
        Budget Overview
      </div>
      {isEmpty ? (
        <div style={{ padding: 40, color: 'var(--text-muted)', fontSize: 13, textAlign: 'center' }}>
          No data yet.<br/>Add a budget or expense to see the chart.
        </div>
      ) : (
        <>
          <canvas ref={canvasRef} width={260} height={260} />
          <div style={{ display: 'flex', gap: 20, fontSize: 12 }}>
            {[{ label: 'Remaining', color: '#34d399' }, { label: 'Expenses', color: '#f87171' }].map(({ label, color }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-dim)' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                {label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
