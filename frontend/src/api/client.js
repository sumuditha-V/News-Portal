import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5100'

export const api = axios.create({
  baseURL,
  timeout: 20000,
  withCredentials: true,
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const path = window.location.pathname
      if (typeof window !== 'undefined' && path !== '/login' && path !== '/register' && path !== '/') {
        window.location.assign('/login')
      }
    }
    return Promise.reject(err)
  },
)
