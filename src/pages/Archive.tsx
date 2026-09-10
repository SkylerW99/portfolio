import { TopNav } from "../components/topNav/topNav"
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { projects } from '../content/generated-index'
import { CATEGORY_PARAM, getActiveCategory, useOpenProjectModal } from '../content/filters'
import { FilterBar } from '../components/FilterBar'
import { ArchivePageThumbnail } from "../components/ProjectCard/ProjectCard"
import { ProjectModal } from '../components/ProjectModal/ProjectModal'

export function Component() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = getActiveCategory(searchParams)

  //get all the project categories from the index
  const categories = useMemo(() => {
    const set = new Set<string>()
    for (const project of projects) {
      for (const category of project.categories) set.add(category)
    }
    return Array.from(set).sort()
  }, [])

  //filter the projects inside the current category
  const filteredProjects = useMemo(() => {
    if (!activeCategory) return projects
    return projects.filter((project) => project.categories.includes(activeCategory))
  }, [activeCategory])

  //add or remove category depending on selection
  function handleSelectCategory(category: string | null) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (category) {
        next.set(CATEGORY_PARAM, category)
      }
      else {
        next.delete(CATEGORY_PARAM)
      }
      return next
    })
  }

  const handleOpenModal = useOpenProjectModal()

  return (
    <div className="page-container">
      <TopNav />

      {/* Filter Panel */}
      <section className="flex-vertical gap-64 padding-64">
        <div className="flex-vertical gap-24">
        <p className="t-eyebrow no-margin">The archive</p>
        <h1>Projects by Category</h1>
        <p className="body-md">All works from UX, code, to creative explorations. Filter by category to narrow it down.</p>
        </div>
        <FilterBar categories={categories} active={activeCategory} onSelect={handleSelectCategory} />
      </section>

      {/* Filtered projects */}
      <div className="grid-two-column">

        {filteredProjects.map((project) => (
          <ArchivePageThumbnail key={project.slug} project={project} onOpenModal={handleOpenModal} />

        ))}

      </div>
      <ProjectModal />
    </div>
  )
}
