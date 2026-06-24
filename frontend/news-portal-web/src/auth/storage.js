const TOKEN_KEY = 'np_token'
const USER_KEY = 'np_user'
const EXPIRES_KEY = 'np_expires'

export function getToken() {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) return null
  const expiresAt = localStorage.getItem(EXPIRES_KEY)
  if (expiresAt && new Date(expiresAt) <= new Date()) {
    clearAuth()
    return null
  }
  return token
}

export function getUsername() {
  return localStorage.getItem(USER_KEY)
}

export function setAuth({ token, username, expiresAt }) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, username)
  if (expiresAt) localStorage.setItem(EXPIRES_KEY, expiresAt)
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(EXPIRES_KEY)
}
