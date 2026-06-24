import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { extractErrorMessage } from '../utils/format'

export default function SignUpPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const validate = () => {
    if (!form.fullName.trim()) return 'Full name is required.'
    if (!form.email.trim()) return 'Email address is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email address.'
    if (!form.username.trim()) return 'Username is required.'
    if (form.username.trim().length < 3) return 'Username must be at least 3 characters.'
    if (!form.password) return 'Password is required.'
    if (form.password.length < 6) return 'Password must be at least 6 characters.'
    if (form.password !== form.confirmPassword) return 'Passwords do not match.'
    return null
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }

    setError(null)
    setSubmitting(true)
    try {
      await register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        username: form.username.trim(),
        password: form.password,
      })
      setSuccess(true)
      setTimeout(() => navigate('/news', { replace: true }), 1200)
    } catch (err) {
      setError(extractErrorMessage(err, 'Registration failed. Please try again.'))
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

        <h1>Create account</h1>
        <p className="muted" style={{ marginBottom: 0 }}>Join NewsHub and stay informed every day.</p>

        {/* Success */}
        {success && (
          <div className="auth-success" role="status">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Account created! Redirecting…
          </div>
        )}

        {/* Error */}
        {error && <div className="form-error" role="alert">{error}</div>}

        <label htmlFor="su-fullname">Full Name</label>
        <input
          id="su-fullname"
          name="fullName"
          type="text"
          autoComplete="name"
          placeholder="John Doe"
          value={form.fullName}
          onChange={set('fullName')}
          required
          disabled={submitting}
        />

        <label htmlFor="su-email">Email Address</label>
        <input
          id="su-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="john@example.com"
          value={form.email}
          onChange={set('email')}
          required
          disabled={submitting}
        />

        <label htmlFor="su-username">Username</label>
        <input
          id="su-username"
          name="username"
          type="text"
          autoComplete="username"
          placeholder="johndoe"
          value={form.username}
          onChange={set('username')}
          required
          minLength={3}
          maxLength={64}
          disabled={submitting}
        />

        <label htmlFor="su-password">Password</label>
        <input
          id="su-password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Min. 6 characters"
          value={form.password}
          onChange={set('password')}
          required
          minLength={6}
          disabled={submitting}
        />

        <label htmlFor="su-confirm-password">Confirm Password</label>
        <input
          id="su-confirm-password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter password"
          value={form.confirmPassword}
          onChange={set('confirmPassword')}
          required
          disabled={submitting}
        />

        <button type="submit" id="btn-signup-submit" className="btn-primary auth-submit-btn" disabled={submitting || success}>
          {submitting ? 'Creating account…' : 'Create account →'}
        </button>

        <p className="auth-switch-link">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  )
}
