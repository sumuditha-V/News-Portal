import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="home-page" style={{ backgroundImage: `url('/bsckground.png')` }}>
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

          {/* Nav buttons — Sign In & Sign Up only */}
          <div className="home-nav-auth">
            <button id="home-nav-signin" className="home-nav-signin-btn" onClick={() => navigate('/login')}>
              Sign In
            </button>
            <button id="home-nav-signup" className="home-nav-signup-btn" onClick={() => navigate('/register')}>
              Sign Up
            </button>
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
              onClick={() => navigate('/login')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Explore News
            </button>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="home-bottom-fade" />
    </div>
  )
}
