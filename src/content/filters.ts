import { useSearchParams } from 'react-router-dom'

// Single source of truth for URL query-param names used across
// Archive / FilterBar / ProjectModal, so nothing typos "category" vs "categories".
export const CATEGORY_PARAM = 'category'
export const PROJECT_PARAM = 'project'

export function getActiveCategory(searchParams: URLSearchParams): string | null {
  return searchParams.get(CATEGORY_PARAM)
}

export function getOpenProjectSlug(searchParams: URLSearchParams): string | null {
  return searchParams.get(PROJECT_PARAM)
}

// Shared by any page (Landing, Archive) that renders ProjectCard + ProjectModal,
// so the "open modal by setting ?project=" logic lives in exactly one place.
export function useOpenProjectModal() {
  const [, setSearchParams] = useSearchParams()
  return function openModal(slug: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set(PROJECT_PARAM, slug)
      return next
    })
  }
}
