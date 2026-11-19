// Site shell (layout route for /, /archive, /about): a sticky left panel that never
// changes between views — slime-mold warp, SW logo, scrambling role, intro + Now,
// nav and contact — and the active view rendered on the right via <Outlet />.
// About is a pop-up over the home feed, opened by the /about route.

import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import './SiteShell.css'
import heroSlime from '../../assets/hero-slime.png'
import { Logo } from './Logo'
import { Scramble } from './Scramble'
import { useHeroWarp } from './useHeroWarp'
import { AboutModal } from '../AboutModal/AboutModal'
import { ContactModal } from '../ContactModal/ContactModal'
import { PasswordGate } from '../PasswordGate/PasswordGate'
import { UNLOCK_PARAM } from '../../content/filters'
import { passwordHashFor } from '../../content/unlock'
import { projects } from '../../content/projects'
import { EMAIL, GITHUB_URL, LINKEDIN_URL, RESUME_URL } from '../../content/contact'

const COLLAPSE_KEY = 'skyw:panel-collapsed'

type NavKey = 'work' | 'art' | 'archive' | 'about'

// Smooth-scroll to a home-feed section (or the top for "work").
function scrollToSection(id: string) {
  const el = id === 'work' ? null : document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function Component() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isHome = pathname === '/' || pathname === '/about'
  const aboutOpen = pathname === '/about'

  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(COLLAPSE_KEY) === '1' } catch { return false }
  })
  const [section, setSection] = useState<'work' | 'art'>('work')
  const [contactOpen, setContactOpen] = useState(false)
  const [scramblePaused, setScramblePaused] = useState(false)
  // Scramble doesn't animate under reduced motion, so there's nothing to pause.
  const [reducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  const panelRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const turbRef = useRef<SVGFETurbulenceElement>(null)
  const dispRef = useRef<SVGFEDisplacementMapElement>(null)
  useHeroWarp(panelRef, imgRef, turbRef, dispRef)

  function toggleCollapsed() {
    setCollapsed((c) => {
      try { localStorage.setItem(COLLAPSE_KEY, c ? '0' : '1') } catch { /* storage unavailable */ }
      return !c
    })
  }

  // Scroll-spy on the home feed: "Art & tech" is active once its heading passes mid-screen.
  useEffect(() => {
    if (!isHome) return
    const onScroll = () => {
      const art = document.getElementById('art')
      setSection(art && art.getBoundingClientRect().top < window.innerHeight * 0.5 ? 'art' : 'work')
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  // Lock page scroll behind the contact pop-up (Popup handles About / art itself).
  useEffect(() => {
    if (!contactOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [contactOpen])

  function go(key: NavKey) {
    if (key === 'archive') { navigate('/archive'); window.scrollTo({ top: 0 }); return }
    if (key === 'about') { navigate('/about'); return }
    if (pathname === '/') scrollToSection(key)
    else navigate(key === 'work' ? '/' : `/#${key}`)
  }

  const active: NavKey = aboutOpen ? 'about' : pathname === '/archive' ? 'archive' : section
  const nav: { key: NavKey; label: string; short: string }[] = [
    { key: 'work', label: 'Work', short: 'Work' },
    { key: 'art', label: 'Art & tech', short: 'Art' },
    { key: 'archive', label: 'Archive', short: 'Archive' },
    { key: 'about', label: 'About', short: 'About' },
  ]

  const links = [
    { label: 'Email', href: `mailto:${EMAIL}` },
    { label: 'LinkedIn', href: LINKEDIN_URL },
    ...(GITHUB_URL ? [{ label: 'GitHub', href: GITHUB_URL }] : []),
    { label: 'Résumé', href: RESUME_URL },
  ]

  return (
    <div className={`site${collapsed ? ' is-collapsed' : ''}${pathname === '/archive' ? ' v-archive' : ''}`}>

      {/* ---- Compact bar (tablet / mobile only) ---- */}
      <div className="mbar">
        <Logo size={28} onClick={() => scrollToSection('work')} />
        <nav className="t-nav mnav" aria-label="Site">
          {nav.map((n) => (
            <button key={n.key} type="button" className="navb" aria-current={active === n.key ? 'page' : undefined} onClick={() => go(n.key)}>
              <span className="nl-long">{n.label}</span><span className="nl-short">{n.short}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* ---- Left panel ---- */}
      <aside className="side">
        <div ref={panelRef} className="panel">
          <svg width="0" height="0" className="panel__defs" aria-hidden="true">
            <filter id="panel-slime-warp" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence ref={turbRef} type="fractalNoise" baseFrequency="0.006" numOctaves={2} seed={3} result="n" />
              <feDisplacementMap ref={dispRef} in="SourceGraphic" in2="n" scale={8} xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </svg>
          <img ref={imgRef} src={heroSlime} alt="" aria-hidden="true" className="panel__warp" />

          {collapsed && (
            <div className="rail">
              <button type="button" className="btn btn--icon rail__expand" onClick={toggleCollapsed} aria-label="Expand side panel">→</button>
              <Logo size={28} vertical />
            </div>
          )}

          <div className="pbody" hidden={collapsed}>
            <div className="ptop">
              <Logo size={44} onClick={() => scrollToSection('work')} />
              <button type="button" className="btn collapse-btn" onClick={toggleCollapsed} aria-label="Collapse side panel">
                <span aria-hidden="true">Collapse</span>
                <span aria-hidden="true">←</span>
              </button>
            </div>

            <div className="phero-wrap">
              <h1 className="phero">
                <span className="sr-only">Skylar Wang (王子怡) — product designer, creative technologist</span>
                {/* Mouse-only shortcut to About (keyboard/screen-reader users have the About nav item) */}
                <span aria-hidden="true" className="hero-name" data-hot onClick={() => go('about')}>
                  <span className="hero-name__en">Skylar Wang</span>
                  <span className="hero-name__zh" lang="zh-Hans">
                    <ruby>王<rt>wáng</rt>子<rt>zǐ</rt>怡<rt>yí</rt></ruby>
                  </span>
                </span>
              </h1>
              <div className="hero-role">
                <span aria-hidden="true" className="hero-code"><span className="g">[ </span><Scramble paused={scramblePaused} /><span className="g"> ]</span></span>
                {!reducedMotion && (
                <button
                  type="button"
                  className="btn btn--icon scramble-toggle"
                  onClick={() => setScramblePaused((p) => !p)}
                  aria-label={scramblePaused ? 'Resume role animation' : 'Pause role animation'}
                  aria-pressed={scramblePaused}
                >
                  {scramblePaused ? '▶' : '❚❚'}
                </button>
                )}
              </div>
            </div>

            {/* Intro + Now read as one ruled block */}
            <div className="pabout">
              <p className="t-body phero-blurb">
                I design systems people touch: financial tools, connected appliances, and interactive art.
              </p>
              <dl className="t-nav pmeta">
                <div><dt className="g"><span className="pmeta__dot" aria-hidden="true" />Now</dt><dd>Product Design @Worldpay</dd></div>
              </dl>
            </div>

            <nav className="t-nav pnav" aria-label="Site">
              {nav.map((n) => {
                const on = active === n.key
                return (
                  <button key={n.key} type="button" className="navb" aria-current={on ? 'page' : undefined} onClick={() => go(n.key)}>
                    <span>{on ? '→ ' : '  '}{n.label}</span>
                  </button>
                )
              })}
            </nav>

            <div className="pcontact">
              <button type="button" className="pcontact__btn" onClick={() => setContactOpen(true)} aria-haspopup="dialog">
                <span>Contact me</span><span aria-hidden="true">↗</span>
              </button>
              <p className="t-meta pcontact__links">
                {links.map((l, i) => (
                  <span key={l.label}>
                    {i > 0 && ' · '}
                    <a href={l.href} target={l.href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer">{l.label}</a>
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ---- Right feed ---- */}
      <main className="main">
        <Outlet />
        <footer className="t-nav foot">
          <span>© SW {new Date().getFullYear()}</span>
          <span className="g">Made across Shanghai, New York, and Dallas</span>
        </footer>
      </main>

      <AboutModal open={aboutOpen} onClose={() => navigate('/')} onContact={() => { navigate('/'); setContactOpen(true) }} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
      <UnlockPopup />
    </div>
  )
}

// Password pop-up for a protected case study (?unlock=slug), shown over whichever
// shell page is open. The right password continues to /work/:slug, replacing the
// ?unlock entry so Back returns to the page underneath.
function UnlockPopup() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const slug = searchParams.get(UNLOCK_PARAM)
  const hash = passwordHashFor(slug)
  if (!slug || !hash) return null
  const title = projects.find((p) => p.slug === slug)?.title ?? ''
  const close = () => setSearchParams((prev) => {
    const next = new URLSearchParams(prev)
    next.delete(UNLOCK_PARAM)
    return next
  })
  return (
    <PasswordGate
      key={slug}
      slug={slug}
      title={title}
      hash={hash}
      onClose={close}
      onUnlock={() => navigate(`/work/${slug}`, { replace: true })}
    />
  )
}
