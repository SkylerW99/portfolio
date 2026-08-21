import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { projects } from '../content/generated-index'
import { CATEGORY_PARAM, getActiveCategory, useOpenProjectModal } from '../content/filters'
import { FilterBar } from '../components/FilterBar'
import { ProjectCard } from '../components/ProjectCard'
import { ProjectModal } from '../components/ProjectModal'

export function Component() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = getActiveCategory(searchParams)

  const categories = useMemo(() => {
    const set = new Set<string>()
    for (const project of projects) {
      for (const category of project.categories) set.add(category)
    }
    return Array.from(set).sort()
  }, [])

  const filteredProjects = useMemo(() => {
    if (!activeCategory) return projects
    return projects.filter((project) => project.categories.includes(activeCategory))
  }, [activeCategory])

  function handleSelectCategory(category: string | null) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (category) next.set(CATEGORY_PARAM, category)
      else next.delete(CATEGORY_PARAM)
      return next
    })
  }

  const handleOpenModal = useOpenProjectModal()

  return (
    <div>
      <h1>Archive</h1>
      <FilterBar categories={categories} active={activeCategory} onSelect={handleSelectCategory} />
      <div className="project-grid">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} onOpenModal={handleOpenModal} />
        ))}
      </div>
      <ProjectModal />
    </div>
  )
}
