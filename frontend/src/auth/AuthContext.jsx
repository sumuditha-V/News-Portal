import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [username, setUsername] = useState(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    let active = true
    api.get('/api/auth/me')
      .then(({ data }) => {
        if (active) setUsername(data.username)
      })
      .catch(() => {
        if (active) setUsername(null)
      })
      .finally(() => {
        if (active) setInitializing(false)
      })
    return () => {
      active = false
    }
  }, [])

  const login = useCallback(async (u, p) => {
    const { data } = await api.post('/api/auth/login', { username: u, password: p })
    setUsername(data.username)
    return data
  }, [])

  const register = useCallback(async (payload) => {
    const { data } = await api.post('/api/auth/register', payload)
    setUsername(data.username)
    return data
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post('/api/auth/logout')
    } finally {
      setUsername(null)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ username, isAuthenticated: !!username, initializing, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
