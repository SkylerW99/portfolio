import { Link } from 'react-router-dom'
import './ProjectCard.css';
import type { ProjectFrontmatter } from '../../content/types'
import { ArrowUp } from '../icons/ArrowUp'

//project title and description
export function ProjectCardText({ project }: { project: ProjectFrontmatter }) {
  const textContent = (
    <>
      <div className="flex-vertical gap-20">
        <div className="gap-4">
          <div className="flex-horizontal space-between">
            <p className="t-meta">{project.id}</p>
            <p className="t-meta">{new Date(project.date).getFullYear()}</p>
          </div>
          <hr />
        </div>
        <h2 className="text-primary-col height-150">{project.title}</h2>
        <p className="body-md no-padding">{project.description}</p>
        <div className="flex-horizontal space-between">
          <div className="flex-horizontal gap-8">
            {project.categories.map((category) => (
              <button key={category} className="btn">{category}</button>
            ))}
          </div>
          <Link to = {`/work/${project.slug}`}>
          <button className="btn btn-secondary gap-8">
            Read Case
            <ArrowUp stroke="var(--accent)" width="16" height="16" />
          </button>
          </Link>
        </div>
      </div>
    </>
  )

  //if it's a large project, return all the text content
  if (project.size === 'large') {
    return (
      <>
        {textContent}
      </>
    )
  }
}

export function ProjectCardImage({ project }: { project: ProjectFrontmatter }) {
  const imageContent = (
    <>
      <div>
        <Link to={`/work/${project.slug}`}>
          <img className="thumbnail-image" src={project.thumbnail} alt="" loading="lazy" />
        </Link>
      </div>
    </>
  );

  if (project.size === 'large') {
    return (
      <>
        {imageContent}
      </>
    )
  }

}
