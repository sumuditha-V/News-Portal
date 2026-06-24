import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from '../api/client'
import { clearAuth, getToken, getUsername, setAuth } from './storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [username, setUsername] = useState(() => (getToken() ? getUsername() : null))

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'np_token') {
        setUsername(getToken() ? getUsername() : null)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const login = useCallback(async (u, p) => {
    const { data } = await api.post('/api/auth/login', { username: u, password: p })
    setAuth({ token: data.token, username: data.username, expiresAt: data.expiresAt })
    setUsername(data.username)
    return data
  }, [])

  const logout = useCallback(() => {
    clearAuth()
    setUsername(null)
  }, [])

  return (
    <AuthContext.Provider value={{ username, isAuthenticated: !!username, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
