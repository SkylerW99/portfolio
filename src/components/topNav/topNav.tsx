// top nav component — static view
import './topNav.css'

export function TopNav() {
  return (
    <header className="top-nav">
      <div className="top-nav__inner">
        <a href="/" className="top-nav__brand" aria-label="Skylar Wang — home">
          <span className="top-nav__mark">SKYW</span>
        </a>

        <nav className="top-nav__links" aria-label="Primary">
          <a href="/" className="t-nav top-nav__link">Index</a>
          <a href="/archive" className="t-nav top-nav__link">Archive</a>
          <a href="/about" className="t-nav top-nav__link">About</a>
        </nav>
      </div>
    </header>
  )
}

