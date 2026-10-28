import { createContext, useState, useEffect, useContext } from 'react'
import AuthContext from './AuthContext'

const API = 'http://localhost:5000/api'

const AvailableCategoriesContext = createContext({
  availableCategories: [],
  setAvailableCategories: () => {},
})

export function AvailableCategoriesContextProvider({ children }) {
  const [availableCategories, setAvailableCategoriesState] = useState([])
  const { token } = useContext(AuthContext)

  const headers = {
    'Content-Type': 'application/json',
    'authorization': token,
  }

  useEffect(() => {
    if (!token) return
    fetch(`${API}/available-categories`, { headers })
      .then((r) => r.json())
      .then((data) => setAvailableCategoriesState(data))
  }, [token])

  async function setAvailableCategories(callbackOrValue) {
    const next = typeof callbackOrValue === 'function'
      ? callbackOrValue(availableCategories)
      : callbackOrValue

    const added = next.filter(
      (n) => !availableCategories.find((a) => a.label === n.label)
    )
    const removed = availableCategories.filter(
      (a) => !next.find((n) => n.label === a.label)
    )
    const updated = next.filter((n) => {
      const old = availableCategories.find((a) => a.label === n.label)
      return old && old.isused !== n.isused
    })

    for (const item of added) {
      await fetch(`${API}/available-categories`, {
        method: 'POST', headers,
        body: JSON.stringify(item),
      })
    }
    for (const item of removed) {
      await fetch(`${API}/available-categories/${item.label}`, {
        method: 'DELETE', headers,
      })
    }
    for (const item of updated) {
      await fetch(`${API}/available-categories/${item.label}`, {
        method: 'PUT', headers,
        body: JSON.stringify({ isused: item.isused }),
      })
    }

    setAvailableCategoriesState(next)
  }

  return (
    <AvailableCategoriesContext.Provider
      value={{ availableCategories, setAvailableCategories }}
    >
      {children}
    </AvailableCategoriesContext.Provider>
  )
}

export default AvailableCategoriesContext