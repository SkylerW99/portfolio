// Home feed (right side of the shell): Work grid, then the Art & tech strip.
// Small projects open the art pop-up via ?project=slug.

import './Landing.css'
import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useOpenProjectModal } from '../../content/filters'
import { pad2, stripProjects, workProjects } from '../../content/projects'
import { ArtCard, WorkCard } from '../../components/ProjectCard/ProjectCard'
import { ProjectModal } from '../../components/ProjectModal/ProjectModal'

export function Component() {
  const openModal = useOpenProjectModal()
  const { hash } = useLocation()
  const stripRef = useRef<HTMLDivElement>(null)

  // Arriving from another view via the nav (/#art): scroll to that section.
  useEffect(() => {
    if (!hash) return
    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [hash])

  const scrollStrip = (dx: number) => stripRef.current?.scrollBy({ left: dx, behavior: 'smooth' })

  return (
    <>
      <div id="work" className="feed-head feed-head--inline">
        <h2 className="feed-label">Work</h2>
        <span className="feed-label">Featured UX case studies</span>
      </div>
      <div className="grid-works">
        {workProjects.map((p, i) => <WorkCard key={p.slug} project={p} num={pad2(i + 1)} />)}
      </div>

      <div id="art" className="art-head">
        <div className="feed-head">
          <h2 className="feed-title feed-title--sm">Art &amp; Tech</h2>
          <span className="t-nav g">Code, interactivity &amp; form</span>
        </div>
        <div className="art-head__actions">
          <Link to="/archive" className="t-nav text-primary-col">Open the archive ↗</Link>
          <button type="button" className="btn btn--icon" onClick={() => scrollStrip(-348)} aria-label="Scroll art projects left">←</button>
          <button type="button" className="btn btn--icon btn--filled" onClick={() => scrollStrip(348)} aria-label="Scroll art projects right">→</button>
        </div>
      </div>
      <div ref={stripRef} className="art-strip">
        {stripProjects.map((p) => <ArtCard key={p.slug} project={p} onOpen={openModal} />)}
      </div>

      <ProjectModal list={stripProjects} section="Art & tech" />
    </>
  )
}
