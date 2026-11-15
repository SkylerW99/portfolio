// Art & tech / Archive pop-up for projects without a case-study page.
// Open state lives in the URL (?project=slug); prev / next and ←/→ cycle
// through `list` (the strip on Home, the filtered non-case items on Archive).

import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import './ProjectModal.css'
import { Popup } from '../Popup/Popup'
import { PROJECT_PARAM, getOpenProjectSlug } from '../../content/filters'
import { cardText, pad2, projects, yearOf } from '../../content/projects'
import type { ProjectFrontmatter, ProjectImage } from '../../content/types'

type Props = {
  list: ProjectFrontmatter[]
  section: string
}

export function ProjectModal({ list, section }: Props) {
  const [searchParams, setSearchParams] = useSearchParams()
  const slug = getOpenProjectSlug(searchParams)
  const project = slug ? projects.find((p) => p.slug === slug) : undefined
  const [slide, setSlide] = useState(0)

  useEffect(() => { setSlide(0) }, [slug])

  const setOpen = (next: string | null) => setSearchParams((prev) => {
    const p = new URLSearchParams(prev)
    if (next) p.set(PROJECT_PARAM, next)
    else p.delete(PROJECT_PARAM)
    return p
  }, { replace: !!next && !!slug })   // stepping prev/next doesn't stack history entries

  const n = list.length
  const pos = Math.max(0, list.findIndex((p) => p.slug === slug))
  const prev = n ? list[(pos + n - 1) % n] : undefined
  const next = n ? list[(pos + 1) % n] : undefined

  // ←/→ step through the list while open
  useEffect(() => {
    if (!project || n < 2) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && next) setOpen(next.slug)
      else if (e.key === 'ArrowLeft' && prev) setOpen(prev.slug)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })

  if (!project) return null

  const images: ProjectImage[] = project.images ?? (project.thumbnail ? [{ src: project.thumbnail, alt: project.title, fit: 'cover' }] : [])
  const img = images[Math.min(slide, images.length - 1)]
  const meta = [
    { k: 'Year', v: String(yearOf(project)) },
    { k: 'Discipline', v: project.categories.join(' · ') },
    ...(project.format ? [{ k: 'Format', v: project.format }] : []),
  ]

  return (
    <Popup
      open
      onClose={() => setOpen(null)}
      label={project.title}
      heading={<>{section} — {pad2(pos + 1)} / {pad2(Math.max(n, 1))}</>}
      className="artpop"
      media={
        <div className="artpop__media">
          <div className="artpop__img">
            {img
              ? <img src={img.src} alt={img.alt} style={{ objectFit: img.fit ?? 'cover' }} />
              : <div className="artpop__ph"><span className="t-meta">Cover / {project.title}</span></div>}
          </div>
          {images.length > 1 && (
            <div className="artpop__thumbs">
              {images.map((x, j) => (
                <button key={x.src} type="button" aria-label={`Show image ${j + 1}`} aria-pressed={j === slide} onClick={() => setSlide(j)}>
                  <img src={x.src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
      }
      footer={n > 1 && prev && next ? (
        <>
          <button type="button" onClick={() => setOpen(prev.slug)}>← {prev.title}</button>
          <button type="button" className="is-filled artpop__next" onClick={() => setOpen(next.slug)}>{next.title} →</button>
        </>
      ) : undefined}
    >
      <div className="artpop__intro">
        <h2 className="artpop__title">{project.title}</h2>
        <p className="artpop__sub">{cardText(project)}</p>
      </div>
      <dl className="t-nav artpop__meta">
        {meta.map((m) => <div key={m.k}><dt className="g">{m.k}</dt><dd>{m.v}</dd></div>)}
      </dl>
      {project.paras?.map((pa) => (
        <div key={pa.k} className="artpop__para">
          <div className="t-meta">{pa.k}</div>
          <p>{pa.t}</p>
        </div>
      ))}
      {project.links?.length ? (
        <div className="btn-group">
          {project.links.map((l) => <a key={l.href} className="btn btn--sm" href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>)}
        </div>
      ) : null}
    </Popup>
  )
}
