import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Layout() {
  const { username, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          {/* Brand */}
          <Link to="/" className="brand">
            <div className="brand-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <span className="brand-name">NewsHub</span>
          </Link>

          {/* Right side: guest vs authenticated */}
          <div className="topbar-actions">
            {isAuthenticated ? (
              /* Authenticated: show username + logout */
              <>
                <div className="topbar-user">
                  <div className="topbar-user-avatar">
                    {username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="topbar-username">{username}</span>
                </div>
                <button id="btn-logout" className="btn-secondary" onClick={handleLogout}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Logout
                </button>
              </>
            ) : (
              /* Guest: show Sign In + Sign Up */
              <>
                <Link id="nav-signin" to="/login" className="btn-ghost-nav">
                  Sign In
                </Link>
                <Link id="nav-signup" to="/register" className="btn-primary-nav">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
