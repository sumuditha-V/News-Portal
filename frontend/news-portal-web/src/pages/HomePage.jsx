import { useNavigate } from 'react-router-dom'
import heroBg from '../assets/hero-bg.jpg'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="home-page" style={{ backgroundImage: `url(${heroBg})` }}>
      {/* Dark overlay */}
      <div className="home-overlay" />

      {/* Navbar */}
      <nav className="home-nav">
        <div className="home-nav-inner">
          <div className="home-brand">
            <div className="home-brand-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <div>
              <span className="home-brand-name">NewsHub</span>
              <span className="home-brand-tagline">Your World. Your News.</span>
            </div>
          </div>

          <div className="home-nav-links">
            <a href="/" className="home-nav-link active">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Home
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="home-hero">
        <div className="home-hero-content">
          <div className="home-badge">
            <span className="home-badge-dot" />
            Breaking News &amp; World Updates
          </div>

          <h1 className="home-title">
            Stay Informed,<br />
            <span className="home-title-highlight">Stay Ahead</span>
          </h1>

          <p className="home-subtitle">
            Your trusted source for the latest news from around the world.<br />
            Curated stories, delivered in real time.
          </p>

          <div className="home-cta-group">
            <button
              id="btn-explore-news"
              className="home-btn-primary"
              onClick={() => navigate('/news')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Explore News
            </button>

            <button
              id="btn-signin"
              className="home-btn-outline"
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>

            <button
              id="btn-signup"
              className="home-btn-ghost"
              onClick={() => navigate('/login')}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="home-bottom-fade" />
    </div>
  )
}
