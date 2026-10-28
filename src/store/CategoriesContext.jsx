import { createContext, useState, useEffect, useContext } from 'react'
import AvailableCategoriesContext from './AvailableCategoriesContext'
import AuthContext from './AuthContext'

const API = 'http://localhost:5000/api'

const CategoriesContext = createContext({
  categories: [],
  getTotalAmount: () => 0,
  resetAmount: () => {},
  setCategories: () => {},
  addCategory: () => {},
  deleteCategory: () => {},
  subtractCategoryAmount: () => {},
})

export function CategoriesContextProvider({ children }) {
  const [categories, setCategoriesState] = useState([])
  const { setAvailableCategories } = useContext(AvailableCategoriesContext)
  const { token } = useContext(AuthContext)

  const headers = {
    'Content-Type': 'application/json',
    'authorization': token,
  }

  useEffect(() => {
    if (!token) return
    fetch(`${API}/categories`, { headers })
      .then((r) => r.json())
      .then((data) => setCategoriesState(data))
  }, [token])

  async function refetch() {
    const data = await fetch(`${API}/categories`, { headers }).then((r) => r.json())
    setCategoriesState(data)
  }

  function getTotalAmount(type) {
    let total = 0
    if (type === 'Expenses') {
      categories.forEach((c) => { if (c.label !== 'Budget') total += parseFloat(c.amount) })
    } else {
      categories.forEach((c) => { if (c.label === 'Budget') total += parseFloat(c.amount) })
    }
    return total
  }

  async function resetAmount(type) {
    await fetch(`${API}/categories/reset/${type}`, { method: 'DELETE', headers })
    await refetch()
  }

  async function addCategory(newCategory) {
    await fetch(`${API}/categories`, {
      method: 'POST', headers,
      body: JSON.stringify(newCategory),
    })
    await refetch()
  }

  async function deleteCategory(label) {
    await fetch(`${API}/categories/${label}`, { method: 'DELETE', headers })
    await refetch()
  }

  async function subtractCategoryAmount(label, amount) {
    await fetch(`${API}/categories/subtract`, {
      method: 'PUT', headers,
      body: JSON.stringify({ label, amount }),
    })
    setAvailableCategories((prev) =>
      prev.map((c) => (c.label === label ? { ...c, isused: false } : c))
    )
    await refetch()
  }

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        getTotalAmount,
        resetAmount,
        setCategories: setCategoriesState,
        addCategory,
        deleteCategory,
        subtractCategoryAmount,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  )
}

export default CategoriesContext