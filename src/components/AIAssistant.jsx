import React, { useContext, useState } from 'react'
import AuthContext from '../store/AuthContext'

const API = 'http://localhost:5000/api'

export default function AIAssistant() {
  const { token } = useContext(AuthContext)
  const [question, setQuestion] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const trimmedQuestion = question.trim()
    if (!trimmedQuestion || loading || !token) return

    setLoading(true)
    setResponse('')

    try {
      const res = await fetch(`${API}/ai-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
        body: JSON.stringify({ question: trimmedQuestion }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to get AI response.')
      }

      setResponse(data.answer || 'No response received.')
    } catch (err) {
      setResponse(err.message || 'Something went wrong while asking AI assistant.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      style={{
        border: '1px solid var(--line)',
        borderRadius: 14,
        background: 'var(--surface)',
        padding: 16,
      }}
    >
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>
        AI Assistant
      </div>
      <div style={{ marginTop: 6, fontSize: 13, color: 'var(--text-muted)' }}>
        Ask questions like: "Total expenses in May", "How much did I spend on food?"
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about your expenses..."
          style={{
            flex: 1,
            minWidth: 0,
            border: '1px solid var(--line)',
            borderRadius: 10,
            padding: '10px 12px',
            outline: 'none',
            background: 'var(--card-bg)',
            color: 'var(--text-primary)',
          }}
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          style={{
            border: 'none',
            borderRadius: 10,
            padding: '10px 14px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.8 : 1,
            background: 'var(--accent)',
            color: '#fff',
            fontWeight: 600,
          }}
        >
          {loading ? 'Asking...' : 'Ask AI'}
        </button>
      </form>

      <div
        style={{
          marginTop: 12,
          border: '1px solid var(--line)',
          borderRadius: 10,
          background: 'var(--card-bg)',
          padding: 12,
          minHeight: 72,
          whiteSpace: 'pre-wrap',
          color: 'var(--text-primary)',
          fontSize: 14,
          lineHeight: 1.4,
        }}
      >
        {response || 'AI response will appear here.'}
      </div>
    </section>
  )
}
