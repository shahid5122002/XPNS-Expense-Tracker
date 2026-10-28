import React, { useState, useContext } from 'react'
import AuthContext from '../store/AuthContext'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import AddBudgetPage from '../pages/AddBudgetPage'
import AddExpensePage from '../pages/AddExpensePage'
import DisplayCategoriesPage from '../pages/DisplayCategoriesPage'
import NotificationBell from './NotificationBell'

const NAV = [
  { label: 'Dashboard', icon: '⊞', link: '/' },
  { label: 'Add Expense',  icon: '+', link: '/newExpense' },
  { label: 'Budget',  icon: '◈', link: '/newBudget' },
  { label: 'Categories', icon: '◎', link: '/categories' },
]

export default function MainAppShell() {
  const [sideOpen, setSideOpen] = useState(false)
  const { logout, username } = useContext(AuthContext)

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        
        {/* Sidebar */}
        <aside style={{
          width: 'var(--nav-width)',
          background: 'var(--bg2)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          padding: '28px 0',
          position: 'fixed',
          top: 0,
          left: 0 ,
          bottom: 0,
          zIndex: 100,
        }}>
          {/* Logo */}
          <div style={{ padding: '0 24px 32px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--accent2)', letterSpacing: '-0.5px' }}>
              💸 xpns
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, letterSpacing: 1, textTransform: 'uppercase' }}>Expense Tracker</div>
          </div>

          {/* Nav links */}
          <nav style={{ padding: '20px 12px', flex: 1 }}>
            {NAV.map((item) => (
              <NavLink
                key={item.link}
                to={item.link}
                end={item.link === '/'}
                onClick={() => setSideOpen(false)}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: 4,
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--accent2)' : 'var(--text-dim)',
                  background: isActive ? 'rgba(124,106,247,0.12)' : 'transparent',
                  transition: 'all 0.15s',
                })}
              >
                <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
              👤 {username}
            </div>
            <button
              onClick={logout}
              style={{
                width: '100%', padding: '9px 14px', borderRadius: 'var(--radius-sm)',
                background: 'rgba(248,113,113,0.1)', color: 'var(--red)',
                border: '1px solid rgba(248,113,113,0.2)', fontSize: 13,
                fontWeight: 600, cursor: 'pointer',
              }}
            >
              Logout
            </button>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10 }}>
              v1.0.0 — MCA Semester Project
            </div>
          </div>
        </aside>

        {/* Main area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: 'var(--nav-width)' }}>
          
          {/* Header */}
          <header style={{
            height: 'var(--header-height)',
            background: 'rgba(245,240,232,0.85)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 28px',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            justifyContent: 'space-between',
          }}>
            
            {/* Left */}
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>
              Expense Tracker
            </div>

            {/* RIGHT SIDE (UPDATED) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              
              {/* 🔥 Notification Bell added here */}
              <NotificationBell />

              {/* Date */}
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {new Date().toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>

            </div>

          </header>

          {/* Page content */}
          <main style={{ flex: 1, padding: '32px 28px', maxWidth: 1100, width: '100%' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/newExpense" element={<AddExpensePage />} />
              <Route path="/newBudget" element={<AddBudgetPage />} />
              <Route path="/categories" element={<DisplayCategoriesPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}