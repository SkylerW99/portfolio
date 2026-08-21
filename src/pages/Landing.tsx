import { useMemo } from 'react'
import { projects } from '../content/generated-index'
import { useOpenProjectModal } from '../content/filters'
import { ProjectCard } from '../components/ProjectCard'
import { ProjectModal } from '../components/ProjectModal'

export function Component() {
  const handleOpenModal = useOpenProjectModal()
  const featuredProjects = useMemo(() => projects.filter((project) => project.featured), [])

  return (
    <div>
      <section className="intro">
        <h1>Your Name</h1>
        <p>A short self-introduction goes here.</p>
      </section>

      <section className="featured-work">
        <h2>Featured work</h2>
        <div className="project-grid">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} onOpenModal={handleOpenModal} />
          ))}
        </div>
      </section>

      <ProjectModal />
    </div>
  )
}
