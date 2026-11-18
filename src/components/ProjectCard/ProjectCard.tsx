// Project cards for the redesigned shell:
//   WorkCard    — Home → Work grid (case studies; "Coming soon" when unpublished)
//   ArtCard     — Home → Art & tech strip (opens the art pop-up)
//   ArchiveCard — Archive grid (case study link, or the art pop-up)

import { Link } from 'react-router-dom'
import './ProjectCard.css'
import type { ProjectFrontmatter } from '../../content/types'
import { cardText, isCaseStudy, statusLabel, tagLine } from '../../content/projects'

function Cover({ project, ratio }: { project: ProjectFrontmatter; ratio: '16/10' | '4/3' }) {
  return (
    <span className="pcard__cover" style={{ aspectRatio: ratio }}>
      {project.thumbnail
        ? <img className="thumbnail-image" src={project.thumbnail} alt="" loading="lazy" />
        : <span className="pcard__ph"><span className="t-meta">Cover / {project.status ? 'In progress' : project.title}</span></span>}
    </span>
  )
}

export function WorkCard({ project, num }: { project: ProjectFrontmatter; num: string }) {
  const body = (
    <>
      <span className="pcard__head">
        <span className="t-meta pcard__num">{num}</span>
        <span className="pcard__title">{project.title}</span>
      </span>
      <Cover project={project} ratio="16/10" />
      <span className="pcard__foot">
        <span className="pcard__desc">{cardText(project)}</span>
        <span className="t-nav pcard__meta">
          <span className="g">{tagLine(project)}</span>
          {project.status && <span className="g">{statusLabel(project)}</span>}
        </span>
      </span>
    </>
  )
  return isCaseStudy(project)
    ? <Link to={`/work/${project.slug}`} className="pcard">{body}</Link>
    : <div className="pcard pcard--static">{body}</div>
}

export function ArtCard({ project, onOpen }: { project: ProjectFrontmatter; onOpen: (slug: string) => void }) {
  return (
    <button type="button" className="artcard" onClick={() => onOpen(project.slug)} aria-haspopup="dialog">
      <span className="artcard__img"><Cover project={project} ratio="4/3" /></span>
      <span className="artcard__cap">
        <span className="artcard__title">{project.title}</span>
        <span className="t-meta">{project.strip}</span>
      </span>
    </button>
  )
}

export function ArchiveCard({ project, num, onOpen }: { project: ProjectFrontmatter; num: string; onOpen: (slug: string) => void }) {
  const isCase = isCaseStudy(project)
  const body = (
    <>
      <span className="pcard__head pcard__head--sm">
        <span className="t-meta pcard__num">{num}</span>
        <span className="pcard__title pcard__title--sm">{project.title}</span>
      </span>
      <Cover project={project} ratio="16/10" />
      <span className="pcard__foot pcard__foot--sm">
        <span className="pcard__desc pcard__desc--sm">{cardText(project)}</span>
        <span className="t-tag pcard__meta">
          <span>{tagLine(project)}</span>
          <span className={isCase ? 'pcard__kind--case' : 'text-primary-col'}>{isCase ? 'Case study ↗' : 'View ↗'}</span>
        </span>
      </span>
    </>
  )
  return isCase
    ? <Link to={`/work/${project.slug}`} className="pcard">{body}</Link>
    : <button type="button" className="pcard" onClick={() => onOpen(project.slug)} aria-haspopup="dialog">{body}</button>
}
