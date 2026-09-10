import { Link } from 'react-router-dom'
import './ProjectCard.css';
import type { ProjectFrontmatter } from '../../content/types'
import { ArrowUp } from '../icons/ArrowUp'

interface projectType {
  project: ProjectFrontmatter,
  onOpenModal?: (slug: string) => void
}

{/* Homepage - text portion of the project, large and small */}
export function ProjectCardText({ project }: projectType) {

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
              <Link to = {`/archive/?category=${category}`}>
              <button key={category} className="btn">{category}</button>
              </Link>
            ))}
          </div>
          <Link to={`/work/${project.slug}`}>
            <button className="btn btn-secondary gap-8">
              Read Case
              <ArrowUp stroke="var(--accent)" width="16" height="16" />
            </button>
          </Link>
        </div>
      </div>
    </>
  )

  //if it's a large project, return all the text content, no need to return stuff for small project
  if (project.size === 'large') {
    return (
      <>
        {textContent}
      </>
    )
  }
}

{/* Homepage - image portion of the project, large and small */}
export function ProjectCardImage({ project, onOpenModal }: projectType) {
  const imageContent = (
    <>
      <div>
        <img className="thumbnail-image" src={project.thumbnail} alt="" loading="lazy" />
      </div>
    </>
  );

  if (project.size === 'large') {
    return (
      <>
        <Link to={`/work/${project.slug}`}>
          {imageContent}
        </Link>
      </>
    )
  } else {
    return (
      <div className="position-relative container-with-overlay">
        <button className="no-border no-padding" onClick={() => onOpenModal?.(project.slug)}>
          <div className="gradient-background"></div>
          {imageContent}
        </button>
        <div className="category-overlay flex-horizontal gap-4">
          {project.categories.map((category) =>
            (<p className="t-meta white-color">{category} /</p>)
          )}
        </div>
        <h4 className="text-overlay">{project.title}</h4>
      </div>
    )
  }
}

{/* Archive page - project card layout */}
export function ArchivePageThumbnail({project, onOpenModal}: projectType){
  const thumbnailLayout = (
  <>
  <div className="cursor-pointer solid-border flex-vertical align-center">
    <img className = "thumbnail-image" src={project.thumbnail} alt="" loading="lazy" />
    <p className="body-sm">{project.title}</p>
    <div className="flex-horizontal justify-center">
    {project.categories.map((category)=>
    (<p className="t-meta">{category}/</p>)
    )}
    </div>
  </div>
  </>);

  if (project.size === 'large'){
    return (
    <Link to={`/work/${project.slug}`} className="no-fade">
      {thumbnailLayout}
    </Link>
    );
  } else if (project.size === 'small'){
    return (
      <button className="no-border no-padding" onClick={()=>onOpenModal?.(project.slug)}>
        {thumbnailLayout}
      </button>
    );
  }

}