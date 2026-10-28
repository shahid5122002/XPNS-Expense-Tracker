import { createContext, useState, useEffect, useContext } from 'react'
import AuthContext from './AuthContext'

const API = 'http://localhost:5000/api'

const HistoryContext = createContext({
  history: [],
  selectedMonth: '',
  selectedYear: '',
  setSelectedMonth: () => {},
  setSelectedYear: () => {},
  addHistoryElement: () => {},
  deleteHistoryElement: () => {},
})

export function HistoryContextProvider({ children }) {
  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(String(now.getMonth() + 1))
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()))
  const [history, setHistory] = useState([])
  const { token } = useContext(AuthContext)

  const headers = {
    'Content-Type': 'application/json',
    'authorization': token,
  }

  useEffect(() => {
    if (!token) return
    fetchHistory()
  }, [token, selectedMonth, selectedYear])

  async function fetchHistory() {
    const res = await fetch(
      `${API}/history?month=${selectedMonth}&year=${selectedYear}`,
      { headers }
    )
    const data = await res.json()
    setHistory(data)
  }

  async function addHistoryElement(element) {
    const today = new Date()
    const dateCreated = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    await fetch(`${API}/history`, {
      method: 'POST', headers,
      body: JSON.stringify({ ...element, dateCreated }),
    })
    fetchHistory()
  }

  async function deleteHistoryElement(id) {
    await fetch(`${API}/history/${id}`, { method: 'DELETE', headers })
    fetchHistory()
  }

  return (
    <HistoryContext.Provider
      value={{
        history,
        selectedMonth,
        selectedYear,
        setSelectedMonth,
        setSelectedYear,
        addHistoryElement,
        deleteHistoryElement,
      }}
    >
      {children}
    </HistoryContext.Provider>
  )
}

export default HistoryContext