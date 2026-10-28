import React, { useContext } from 'react'
import CategoriesContext from '../store/CategoriesContext'
import DisplayCard from '../components/DisplayCard'
import PieChart from '../components/PieChart'
import HistoryStack from '../components/HistoryStack'
import CsvImport from '../components/CsvImport'
import AIAssistant from '../components/AIAssistant'

export default function HomePage() {
  const { getTotalAmount } = useContext(CategoriesContext)
  const budget = getTotalAmount('Budget')
  const expenses = getTotalAmount('Expenses')
  const balance = budget - expenses

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Page title */}
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.5px' }}>Dashboard</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Your financial overview at a glance</div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        <DisplayCard label="Total Budget" amount={budget} color="green" />
        <DisplayCard label="Total Expenses" amount={expenses} color="red" />
        <DisplayCard label="Balance" amount={balance} color={balance >= 0 ? 'green' : 'red'} />
      </div>

      {/* Chart + History */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: 20 }}>
        <PieChart />
        <HistoryStack />
      </div>

      <AIAssistant />

      {/* CSV Import Section */}
      <CsvImport />
    </div>
  )
}
