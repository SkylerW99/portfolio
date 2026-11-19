// Archive view: every project, filterable by category (?category=) — case studies
// link to their page, everything else opens the art pop-up (?project=).

import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import './landing/Landing.css'
import { CATEGORY_PARAM, getActiveCategory, useOpenProjectModal } from '../content/filters'
import { pad2, projects } from '../content/projects'
import { FEATURED_FILTER, FilterBar } from '../components/FilterBar'
import { ArchiveCard } from '../components/ProjectCard/ProjectCard'
import { ProjectModal } from '../components/ProjectModal/ProjectModal'

// Curated filter order from the design; any other category in the content is appended.
const CATEGORY_ORDER = ['UX', 'Design System', 'Accessibility', 'AR/VR', 'AI/ML', 'Visual Design', 'Motion', 'Creative Coding', 'Web Dev', 'Game Dev', 'pComp']

export function Component() {
  const [searchParams, setSearchParams] = useSearchParams()
  const active = getActiveCategory(searchParams)
  const openModal = useOpenProjectModal()

  const categories = useMemo(() => {
    const used = new Set(projects.flatMap((p) => p.categories))
    return [...CATEGORY_ORDER.filter((c) => used.has(c)), ...[...used].filter((c) => !CATEGORY_ORDER.includes(c)).sort()]
  }, [])

  const visible = useMemo(() => {
    if (!active) return projects
    if (active === FEATURED_FILTER) return projects.filter((p) => p.featured)
    return projects.filter((p) => p.categories.includes(active))
  }, [active])

  function handleSelect(category: string | null) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (category) next.set(CATEGORY_PARAM, category)
      else next.delete(CATEGORY_PARAM)
      return next
    })
  }

  return (
    <>
      <div className="arch-head">
        <div className="arch-head__intro">
          <h2 className="feed-title">Archive</h2>
          <p>A running archive of product work, creative coding, generative motion, AR, games and visual work.</p>
        </div>
        <span className="t-nav g">{visible.length} of {projects.length} projects</span>
      </div>

      <FilterBar categories={categories} active={active} onSelect={handleSelect} />

      <div className="grid-arch">
        {visible.map((p) => (
          <ArchiveCard key={p.slug} project={p} num={pad2(projects.indexOf(p) + 1)} onOpen={openModal} />
        ))}
      </div>

      <ProjectModal section="Archive" />
    </>
  )
}
