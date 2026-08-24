


import { useEffect, useState, type ComponentType } from 'react'
import { useParams } from 'react-router-dom'
import type { ProjectFrontmatter } from '../content/types'

// Non-eager glob: each matched file becomes its own lazily-loaded chunk.
// Nothing here is downloaded until a specific loader() below is called.
const projectModules = import.meta.glob<{
  default: ComponentType
  frontmatter: ProjectFrontmatter
}>('/content/projects/*.mdx')

export function Component() {
  const { slug } = useParams<{ slug: string }>()
  const [project, setProject] = useState<{
    Body: ComponentType
    frontmatter: ProjectFrontmatter
  } | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setProject(null)
    setNotFound(false)

    const loadModule = projectModules[`/content/projects/${slug}.mdx`]
    if (!loadModule) {
      setNotFound(true)
      return
    }

    let cancelled = false
    loadModule().then((mod) => {
      if (!cancelled) setProject({ Body: mod.default, frontmatter: mod.frontmatter })
    })
    return () => {
      cancelled = true
    }
  }, [slug])

  if (notFound) return <p>Project not found.</p>
  if (!project) return <p>Loading…</p>

  const { Body } = project

  return (
    <article className="page-container">
      <Body />
    </article>
  )
}
