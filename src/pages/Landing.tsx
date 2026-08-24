import { useMemo } from 'react'
import { projects } from '../content/generated-index'
import { useOpenProjectModal } from '../content/filters'
import { ProjectCard } from '../components/ProjectCard'
import { ProjectModal } from '../components/ProjectModal'
import { TopNav } from '../components/topNav/topNav'
import { Intro } from "../components/IntroSection/intro"

export function Component() {
  const handleOpenModal = useOpenProjectModal()
  const featuredProjects = useMemo(() => projects.filter((project) => project.featured), [])

  return (
    <div className="page-container">
      <TopNav />
      <Intro />
      <section className="featured-work">
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
