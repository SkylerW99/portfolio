// Art & tech / Archive pop-up for projects without a case-study page.
// Open state lives in the URL (?project=slug). One project at a time: the footer
// only closes it (no stepping to other projects).

import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import './ProjectModal.css'
import { Popup } from '../Popup/Popup'
import { PROJECT_PARAM, getOpenProjectSlug } from '../../content/filters'
import { projects, yearOf } from '../../content/projects'
import type { ProjectImage } from '../../content/types'

type Props = {
  section: string
}

export function ProjectModal({ section }: Props) {
  const [searchParams, setSearchParams] = useSearchParams()
  const slug = getOpenProjectSlug(searchParams)
  const project = slug ? projects.find((p) => p.slug === slug) : undefined
  const [slide, setSlide] = useState(0)

  useEffect(() => { setSlide(0) }, [slug])

  const close = () => setSearchParams((prev) => {
    const p = new URLSearchParams(prev)
    p.delete(PROJECT_PARAM)
    return p
  })

  if (!project) return null

  const images: ProjectImage[] = project.images ?? (project.thumbnail ? [{ src: project.thumbnail, alt: project.title, fit: 'cover' }] : [])
  const img = images[Math.min(slide, images.length - 1)]
  const ctas = project.cta ? [project.cta].flat() : []
  const meta = [
    ...(project.award ? [{ k: 'Award', v: project.award }] : []),
    ...(project.exhibition ? [{ k: 'Exhibition', v: project.exhibition }] : []),
    ...(project.projectType ? [{ k: 'Type', v: project.projectType }] : []),
    { k: 'Year', v: String(yearOf(project)) },
    ...(project.showDiscipline === false ? [] : [{ k: 'Discipline', v: project.categories.join(' · ') }]),
    ...(project.format ? [{ k: 'Format', v: project.format }] : []),
    ...(project.role ? [{ k: 'Role', v: project.role }] : []),
    ...(project.team ? [{ k: 'Team', v: project.team }] : []),
    ...(project.collaborators ? [{ k: /[,&]/.test(project.collaborators) ? 'Collaborators' : 'Collaborator', v: project.collaborators }] : []),
  ]

  return (
    <Popup
      open
      onClose={close}
      label={project.title}
      heading={section}
      className="artpop"
      media={
        <div className="artpop__media">
          <div className="artpop__img">
            {img?.video && /\.(mp4|webm)$/i.test(img.video)
              ? <video key={img.video} src={img.video} poster={img.src} controls autoPlay muted loop playsInline aria-label={img.alt} style={{ objectFit: 'contain' }} />
              : img?.video
              ? <iframe key={img.video} src={img.video} title={img.alt} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
              : img
                ? <img src={img.src} alt={img.alt} style={{ objectFit: img.fit ?? 'cover' }} />
                : <div className="artpop__ph"><span className="t-meta">Cover / {project.title}</span></div>}
          </div>
          {img?.caption && <p className="t-meta artpop__cap">{img.caption}</p>}
          {images.length > 1 && (
            <div className="artpop__thumbs">
              {images.map((x, j) => (
                <button
                  key={x.video ?? x.src}
                  type="button"
                  className={x.video ? 'is-video' : undefined}
                  aria-label={`Show ${x.video ? 'video' : 'image'} ${j + 1}${x.caption ? `: ${x.caption}` : ''}`}
                  aria-pressed={j === slide}
                  onClick={() => setSlide(j)}
                >
                  <img src={x.src} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>
      }
      footer={<button type="button" className="artpop__close" onClick={close}>Close</button>}
    >
      <div className="artpop__intro">
        <h2 className="artpop__title">{project.title}</h2>
        <p className="artpop__sub">{project.description}</p>
        {project.ctaNote && <p className="artpop__cta-note">{project.ctaNote}</p>}
        {ctas.length > 0 && (
          <div className="btn-group">
            {ctas.map((c) => <a key={c.href} className={`btn btn--sm ${project.ctaStyle === 'outline' ? '' : 'btn--filled'}`} href={c.href} target="_blank" rel="noopener noreferrer">{c.label}</a>)}
          </div>
        )}
      </div>
      <dl className="t-nav artpop__meta">
        {meta.map((m) => <div key={m.k}><dt className="g">{m.k}</dt><dd>{m.v}</dd></div>)}
      </dl>
      {project.paras?.map((pa) => (
        <div key={pa.k} className={`artpop__para${pa.k === 'Impact' ? ' artpop__para--impact' : ''}`}>
          <div className="t-meta">{pa.k}</div>
          {pa.t.split('\n\n').map((t, i) => <p key={i}>{withBold(t)}</p>)}
          {pa.link && (
            <div className="btn-group">
              <a className="btn btn--sm btn--filled" href={pa.link.href} target="_blank" rel="noopener noreferrer">{pa.link.label}</a>
            </div>
          )}
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

// Paragraph text may mark bold runs with **…** (e.g. a bullet's lead-in sentence).
function withBold(t: string) {
  return t.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part))
}
