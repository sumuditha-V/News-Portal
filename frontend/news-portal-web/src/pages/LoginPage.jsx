import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { extractErrorMessage } from '../utils/format'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/news'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(username.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(extractErrorMessage(err, 'Login failed.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={onSubmit} noValidate>
        {/* NewsHub brand in login card */}
        <div className="login-card-brand">
          <div className="login-card-brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
          <span className="login-card-brand-name">NewsHub</span>
        </div>

        <h1>Welcome back</h1>
        <p className="muted" style={{ marginBottom: 0 }}>Sign in to access your personalized feed.</p>

        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={3}
          maxLength={64}
          disabled={submitting}
          placeholder="Enter your username"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          maxLength={128}
          disabled={submitting}
          placeholder="Enter your password"
        />

        {error && <div className="form-error" role="alert">{error}</div>}

        <button type="submit" id="btn-login-submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in →'}
        </button>

        <div className="hint muted">
          Demo — <code>admin</code> / <code>Admin@123</code> &nbsp;·&nbsp; <code>demo</code> / <code>Demo@123</code>
        </div>
      </form>
    </div>
  )
}
