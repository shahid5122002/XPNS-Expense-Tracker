 
import React, { useState, useContext } from 'react'
import AuthContext from '../store/AuthContext'
import HistoryContext from '../store/HistoryContext'
import NotificationContext from '../store/NotificationContext'

const API = 'http://localhost:5000/api'

export default function CsvImport() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const { token } = useContext(AuthContext)
  const { fetchNotifications } = useContext(NotificationContext)

  function handleFileChange(e) {
    const selected = e.target.files[0]
    if (selected && selected.name.endsWith('.csv')) {
      setFile(selected)
      setError('')
      setResult(null)
    } else {
      setError('Please select a valid CSV file')
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped && dropped.name.endsWith('.csv')) {
      setFile(dropped)
      setError('')
      setResult(null)
    } else {
      setError('Please drop a valid CSV file')
    }
  }

  async function handleUpload() {
    if (!file) return setError('Please select a file first')

    setLoading(true)
    setError('')
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch(`${API}/import-csv`, {
        method: 'POST',
        headers: { 'authorization': token },
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Import failed')
        if (data.errors) setResult({ errors: data.errors })
      } else {
        setResult(data)
        setFile(null)
        // Refresh notifications
        setTimeout(() => fetchNotifications(), 1000)
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={card}>
      <div style={title}>Import Transactions from CSV</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
        Upload a CSV file with columns: <strong>label</strong>, <strong>amount</strong>, <strong>type</strong> (Expense/Budget), <strong>category</strong>, <strong>date</strong> (YYYY-MM-DD, optional)
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          ...dropZone,
          borderColor: dragOver ? 'var(--blue, #60a5fa)' : 'var(--border)',
          background: dragOver ? 'rgba(96,165,250,0.05)' : 'var(--bg3)',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <polyline points="9 15 12 12 15 15" />
        </svg>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>
          {file ? `Selected: ${file.name}` : 'Drag & drop CSV file here, or click to browse'}
        </div>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
        />
      </div>

      {/* Sample Format */}
      <details style={{ marginTop: 12 }}>
        <summary style={{ fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' }}>
          View sample CSV format
        </summary>
        <pre style={samplePre}>
{`label,amount,type,category,date
Lunch at Cafe,250,Expense,Food,2025-01-15
Freelance Payment,5000,Budget,Income,2025-01-14
Groceries,800,Expense,Groceries,2025-01-13
Netflix,199,Expense,Entertainment,2025-01-12`}
        </pre>
      </details>

      {/* Error */}
      {error && <div style={errorStyle}>{error}</div>}

      {/* Result */}
      {result && result.inserted !== undefined && (
        <div style={successStyle}>
          ✓ Successfully imported {result.inserted} transactions
          {result.failed > 0 && ` (${result.failed} failed)`}
        </div>
      )}
      {result && result.errors && result.errors.length > 0 && (
        <div style={{ fontSize: 12, color: 'var(--text-muted)', maxHeight: 100, overflowY: 'auto', background: 'var(--bg3)', padding: 8, borderRadius: 6, marginTop: 8 }}>
          {result.errors.map((e, i) => <div key={i}>{e}</div>)}
        </div>
      )}

      {/* Upload Button */}
      <button onClick={handleUpload} disabled={loading || !file} style={{
        ...uploadBtn,
        opacity: (loading || !file) ? 0.5 : 1,
        cursor: (loading || !file) ? 'not-allowed' : 'pointer',
      }}>
        {loading ? 'Importing...' : 'Upload & Import'}
      </button>
    </div>
  )
}

const card = { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 28, display: 'flex', flexDirection: 'column', gap: 12 }
const title = { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--text)' }
const dropZone = { position: 'relative', border: '2px dashed var(--border)', borderRadius: 'var(--radius)', padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', transition: 'all 0.2s' }
const errorStyle = { fontSize: 13, color: 'var(--red)', background: 'rgba(248,113,113,0.08)', padding: '8px 12px', borderRadius: 8 }
const successStyle = { fontSize: 13, color: 'var(--green)', background: 'rgba(52,211,153,0.08)', padding: '8px 12px', borderRadius: 8 }
const uploadBtn = { background: 'rgba(96,165,250,0.15)', color: 'var(--blue, #60a5fa)', border: '1px solid rgba(96,165,250,0.3)', borderRadius: 'var(--radius-sm)', padding: '12px 20px', fontSize: 14, fontWeight: 600, marginTop: 8 }
const samplePre = { background: 'var(--bg3)', padding: 12, borderRadius: 6, fontSize: 11, overflowX: 'auto', marginTop: 8, color: 'var(--text-dim)', lineHeight: 1.6 }
