// Archive view: every project, filterable by category (?category=) — case studies
// link to their page, everything else opens the art pop-up (?project=).

import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import './landing/Landing.css'
import { ARCHIVE_FILTERS, CATEGORY_PARAM, getActiveCategory, useOpenProjectModal } from '../content/filters'
import { pad2, projects } from '../content/projects'
import { FilterBar } from '../components/FilterBar'
import { ArchiveCard } from '../components/ProjectCard/ProjectCard'
import { ProjectModal } from '../components/ProjectModal/ProjectModal'

export function Component() {
  const [searchParams, setSearchParams] = useSearchParams()
  const active = getActiveCategory(searchParams)
  const openModal = useOpenProjectModal()

  // An unknown ?category= (e.g. an old #hashtag link) falls back to All
  const filter = ARCHIVE_FILTERS.some((f) => f.key === active) ? active : null

  const visible = useMemo(
    () => (filter ? projects.filter((p) => p.filters?.includes(filter)) : projects),
    [filter],
  )

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
        <span className="t-nav g">{visible.length} of {projects.length}</span>
      </div>

      <FilterBar options={ARCHIVE_FILTERS} active={filter} onSelect={handleSelect} />

      <div className="grid-arch">
        {visible.map((p) => (
          <ArchiveCard key={p.slug} project={p} num={pad2(projects.indexOf(p) + 1)} onOpen={openModal} />
        ))}
      </div>

      <ProjectModal section="Archive" />
    </>
  )
}
