import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
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
  const [success, setSuccess] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim()) { setError('Username is required.'); return }
    if (!password) { setError('Password is required.'); return }
    setError(null)
    setSubmitting(true)
    try {
      await login(username.trim(), password)
      setSuccess(true)
      setTimeout(() => navigate(from, { replace: true }), 900)
    } catch (err) {
      setError(extractErrorMessage(err, 'Login failed. Please check your credentials.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-wrap">
      {/* Back to home */}
      <Link to="/" className="auth-back-home">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to Home
      </Link>

      <form className="auth-card" onSubmit={onSubmit} noValidate>
        {/* Brand */}
        <div className="auth-card-brand">
          <div className="auth-card-brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
          <span className="auth-card-brand-name">NewsHub</span>
        </div>

        <h1>Welcome back</h1>
        <p className="muted" style={{ marginBottom: 0 }}>Sign in to access your personalized news feed.</p>

        {success && (
          <div className="auth-success" role="status">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Signed in! Redirecting…
          </div>
        )}

        {error && <div className="form-error" role="alert">{error}</div>}

        <label htmlFor="si-username">Username</label>
        <input
          id="si-username"
          name="username"
          type="text"
          autoComplete="username"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={submitting}
        />

        <label htmlFor="si-password">Password</label>
        <input
          id="si-password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={submitting}
        />

        <button type="submit" id="btn-login-submit" className="btn-primary auth-submit-btn" disabled={submitting || success}>
          {submitting ? 'Signing in…' : 'Sign in →'}
        </button>

        <p className="auth-switch-link">
          Don't have an account?{' '}
          <Link to="/register">Sign up</Link>
        </p>
      </form>
    </div>
  )
}
