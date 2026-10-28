import React, { useState, useContext } from 'react'
import NotificationContext from '../store/NotificationContext'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useContext(NotificationContext)

  const typeColors = {
    danger: '#f87171',
    warning: '#fbbf24',
    success: '#34d399',
    info: '#60a5fa',
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Bell Icon */}
      <button onClick={() => setOpen(!open)} style={bellBtn}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span style={badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div style={panel}>
          <div style={panelHeader}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Notifications</span>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} style={markAllBtn}>Mark all read</button>
            )}
          </div>

          <div style={panelBody}>
            {notifications.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                No notifications yet
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    ...notifItem,
                    background: n.is_read ? 'transparent' : 'rgba(96,165,250,0.05)',
                    borderLeft: `3px solid ${typeColors[n.type] || typeColors.info}`,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.4 }}>{n.message}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                      {new Date(n.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {!n.is_read && (
                      <button onClick={() => markAsRead(n.id)} style={smallBtn} title="Mark as read">✓</button>
                    )}
                    <button onClick={() => deleteNotification(n.id)} style={smallBtn} title="Delete">×</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Overlay to close */}
      {open && <div style={overlay} onClick={() => setOpen(false)} />}
    </div>
  )
}

const bellBtn = {
  background: 'var(--bg3)',
  border: '1px solid var(--border)',
  borderRadius: '50%',
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: 'var(--text)',
  position: 'relative',
}
const badge = {
  position: 'absolute',
  top: -4,
  right: -4,
  background: '#f87171',
  color: '#fff',
  fontSize: 10,
  fontWeight: 700,
  borderRadius: '50%',
  width: 18,
  height: 18,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}
const panel = {
  position: 'absolute',
  top: 48,
  right: 0,
  width: 360,
  background: 'var(--bg2)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
  zIndex: 1000,
  overflow: 'hidden',
}
const panelHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 16px',
  borderBottom: '1px solid var(--border)',
}
const panelBody = {
  maxHeight: 400,
  overflowY: 'auto',
}
const notifItem = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 8,
  padding: '12px 16px',
  borderBottom: '1px solid var(--border)',
}
const markAllBtn = {
  background: 'none',
  border: 'none',
  color: 'var(--blue, #60a5fa)',
  fontSize: 12,
  cursor: 'pointer',
  fontWeight: 600,
}
const smallBtn = {
  background: 'var(--bg3)',
  border: '1px solid var(--border)',
  borderRadius: 4,
  width: 22,
  height: 22,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: 'var(--text-muted)',
  fontSize: 13,
}
const overlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 999,
}
 
