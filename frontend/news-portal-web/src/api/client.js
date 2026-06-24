import axios from 'axios'
import { getToken, clearAuth } from '../auth/storage'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5100'

export const api = axios.create({
  baseURL,
  timeout: 20000,
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      clearAuth()
      const path = window.location.pathname
      if (typeof window !== 'undefined' && path !== '/login' && path !== '/register' && path !== '/') {
        window.location.assign('/login')
      }
    }
    return Promise.reject(err)
  },
)
