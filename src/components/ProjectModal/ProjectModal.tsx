import "./ProjectModal.css"
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { projects } from '../../content/generated-index'
import { PROJECT_PARAM, getOpenProjectSlug } from '../../content/filters'

export function ProjectModal() {
  const [searchParams, setSearchParams] = useSearchParams()
  const openSlug = getOpenProjectSlug(searchParams) //get the project name from the browser
  const project = openSlug ? projects.find((p) => p.slug === openSlug) : undefined  //find the project in the index that matches the name in the browser

  function close() {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete(PROJECT_PARAM)
      return next
    })
  }

  useEffect(() => {
    if (!project) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev)
          next.delete(PROJECT_PARAM)
          return next
        })
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [project, setSearchParams])

  if (!project) return null

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="modal-close" onClick={close} aria-label="Close">
          ×
        </button>
        <img className="thumbnail-image" src={project.thumbnail} alt="" />
        <h3>{project.title}</h3>
        <p>{project.description}</p>
      </div>
    </div>
  )
}
