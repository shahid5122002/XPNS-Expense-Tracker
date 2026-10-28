import React from 'react'
import './index.css'
import { AuthContextProvider } from './store/AuthContext'
import { AvailableCategoriesContextProvider } from './store/AvailableCategoriesContext'
import { HistoryContextProvider } from './store/HistoryContext'
import { CategoriesContextProvider } from './store/CategoriesContext'
import { NotificationContextProvider } from './store/NotificationContext'
import MainAppShell from './components/MainAppShell'
import AuthGate from './components/AuthGate'

export default function App() {
  return (
    <AuthContextProvider>
      <AuthGate>
        <AvailableCategoriesContextProvider>
          <HistoryContextProvider>
            <CategoriesContextProvider>
              <NotificationContextProvider>
                <MainAppShell />
              </NotificationContextProvider>
            </CategoriesContextProvider>
          </HistoryContextProvider>
        </AvailableCategoriesContextProvider>
      </AuthGate>
    </AuthContextProvider>
  )
}
