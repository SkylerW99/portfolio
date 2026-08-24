import { Link } from 'react-router-dom'
import type { ProjectFrontmatter } from '../content/types'

interface ProjectCardProps {
  project: ProjectFrontmatter
  onOpenModal: (slug: string) => void
}

export function ProjectCard({ project, onOpenModal }: ProjectCardProps) {
  const cardBody = (
    <>
      <img src={project.thumbnail} alt="" loading="lazy" />
      <h3 className="text-primary-col">{project.title}</h3>
      <p className="body-md">{project.description}</p>
    </>
  )

  // Large projects link to their own full case-study route.
  // Small projects have no route of their own — they open in a modal instead.
  if (project.size === 'large') {
    return (
      <Link to={`/work/${project.slug}`} className="project-card">
        {cardBody}
      </Link>
    )
  }

  return (
    <button
      type="button"
      className="project-card"
      onClick={() => onOpenModal(project.slug)}
    >
      {cardBody}
    </button>
  )
}
