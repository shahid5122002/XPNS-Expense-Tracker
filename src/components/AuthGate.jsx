 
import React, { useState, useContext } from 'react'
import AuthContext from '../store/AuthContext'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'

export default function AuthGate({ children }) {
  const { token } = useContext(AuthContext)
  const [showRegister, setShowRegister] = useState(false)

  if (!token) {
    return showRegister
      ? <RegisterPage onSwitch={() => setShowRegister(false)} />
      : <LoginPage onSwitch={() => setShowRegister(true)} />
  }

  return children
}