


import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import type { ProjectFrontmatter } from '../content/types'
import { caseLabel } from '../content/projects'
import { UNLOCK_PARAM } from '../content/filters'
import { isLocked } from '../content/unlock'
import { Lightbox, type LightboxImage } from '../components/Lightbox/Lightbox'
import './ProjectDetail.css'

// Non-eager glob: each matched file becomes its own lazily-loaded chunk.
// Nothing here is downloaded until a specific loader() below is called.
const projectModules = import.meta.glob<{
  default: ComponentType
  frontmatter: ProjectFrontmatter
}>('/content/projects/*.mdx')

// Images that open in the lightbox: anything inside a .cs-media block in the MDX body.
const LIGHTBOX_SELECTOR = '.cs-media img'

export function Component() {
  const { slug } = useParams<{ slug: string }>()
  const [project, setProject] = useState<{
    Body: ComponentType
    frontmatter: ProjectFrontmatter
  } | null>(null)
  const [notFound, setNotFound] = useState(false)
  const articleRef = useRef<HTMLElement>(null)
  const [lightboxImages, setLightboxImages] = useState<LightboxImage[]>([])
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  // Password-protected pages (hash read from the cheap-tier index): a direct visit
  // is sent to Home with the password pop-up open, and the MDX body chunk isn't
  // fetched until the password has been entered.
  const locked = isLocked(slug!)

  useEffect(() => {
    setProject(null)
    setNotFound(false)
    if (locked) return

    const loadModule = projectModules[`/content/projects/${slug}.mdx`]
    if (!loadModule) {
      setNotFound(true)
      return
    }

    let cancelled = false
    loadModule().then((mod) => {
      if (!cancelled) setProject({ Body: mod.default, frontmatter: mod.frontmatter })
    })
    return () => {
      cancelled = true
    }
  }, [slug, locked])

  // Once the MDX body has rendered, make its images clickable/focusable and
  // open the lightbox via one delegated listener on the article.
  useEffect(() => {
    const article = articleRef.current
    if (!project || !article) return
    const imgs = Array.from(article.querySelectorAll<HTMLImageElement>(LIGHTBOX_SELECTOR))
    setLightboxImages(imgs.map((img) => ({ src: img.currentSrc || img.src, alt: img.alt })))
    imgs.forEach((img) => {
      img.tabIndex = 0
      img.setAttribute('role', 'button')
      img.setAttribute('aria-label', `Enlarge image${img.alt ? `: ${img.alt}` : ''}`)
    })

    const openFrom = (target: EventTarget | null) => {
      const img = (target as HTMLElement | null)?.closest?.(LIGHTBOX_SELECTOR)
      const i = img ? imgs.indexOf(img as HTMLImageElement) : -1
      if (i >= 0) setLightboxIndex(i)
      return i >= 0
    }
    const onClick = (e: MouseEvent) => { openFrom(e.target) }
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && openFrom(e.target)) e.preventDefault()
    }
    article.addEventListener('click', onClick)
    article.addEventListener('keydown', onKeyDown)
    return () => {
      article.removeEventListener('click', onClick)
      article.removeEventListener('keydown', onKeyDown)
    }
  }, [project])

  if (locked) return <Navigate to={`/?${UNLOCK_PARAM}=${encodeURIComponent(slug!)}`} replace />
  if (notFound) return <p>Project not found.</p>
  if (!project) return <p>Loading…</p>

  const { Body } = project

  return (
    <>
      <CaseStudyBar slug={slug!} />
      <article ref={articleRef} className="page-container case-study">
        <Body />
      </article>
      <Lightbox
        images={lightboxImages}
        index={lightboxIndex}
        onChange={setLightboxIndex}
        onClose={closeLightbox}
      />
    </>
  )
}

// Sticky bar above every case study: "Case study 01 — Fast Launch · UX · Payments · 2025" + ✕ back home.
function CaseStudyBar({ slug }: { slug: string }) {
  const c = caseLabel(slug)
  return (
    <div className="t-nav case-bar">
      <span>{c?.label}{c?.meta && <span className="g case-bar__meta">&nbsp;· {c.meta}</span>}</span>
      <Link to="/" className="btn btn--icon btn--filled" aria-label="Close case study">✕</Link>
    </div>
  )
}
