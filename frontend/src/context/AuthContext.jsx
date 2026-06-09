import { createContext, useContext, useState, useCallback } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('leonora_user')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('leonora_token') || null)

  const saveAuth = useCallback((token, user) => {
    localStorage.setItem('leonora_token', token)
    localStorage.setItem('leonora_user', JSON.stringify(user))
    setToken(token)
    setUser(user)
  }, [])

  const register = useCallback(async (name, email, password) => {
    const { data } = await api.post('/api/auth/register', { name, email, password })
    saveAuth(data.token, data.user)
    return data
  }, [saveAuth])

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password })
    saveAuth(data.token, data.user)
    return data
  }, [saveAuth])

  const logout = useCallback(() => {
    localStorage.removeItem('leonora_token')
    localStorage.removeItem('leonora_user')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
