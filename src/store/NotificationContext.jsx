 
import { createContext, useState, useEffect, useContext, useCallback } from 'react'
import AuthContext from './AuthContext'

const API = 'http://localhost:5000/api'

const NotificationContext = createContext({
  notifications: [],
  unreadCount: 0,
  fetchNotifications: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  deleteNotification: () => {},
})

export function NotificationContextProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { token } = useContext(AuthContext)

  const headers = {
    'Content-Type': 'application/json',
    'authorization': token,
  }

  const fetchNotifications = useCallback(async () => {
    if (!token) return
    const res = await fetch(`${API}/notifications`, { headers })
    const data = await res.json()
    setNotifications(data)
  }, [token])

  const fetchUnreadCount = useCallback(async () => {
    if (!token) return
    const res = await fetch(`${API}/notifications/unread-count`, { headers })
    const data = await res.json()
    setUnreadCount(data.count)
  }, [token])

  useEffect(() => {
    if (!token) return
    fetchNotifications()
    fetchUnreadCount()

    // Poll every 30 seconds for new notifications
    const interval = setInterval(() => {
      fetchNotifications()
      fetchUnreadCount()
    }, 30000)

    return () => clearInterval(interval)
  }, [token])

  async function markAsRead(id) {
    await fetch(`${API}/notifications/${id}/read`, { method: 'PUT', headers })
    fetchNotifications()
    fetchUnreadCount()
  }

  async function markAllAsRead() {
    await fetch(`${API}/notifications/read-all`, { method: 'PUT', headers })
    fetchNotifications()
    fetchUnreadCount()
  }

  async function deleteNotification(id) {
    await fetch(`${API}/notifications/${id}`, { method: 'DELETE', headers })
    fetchNotifications()
    fetchUnreadCount()
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext
