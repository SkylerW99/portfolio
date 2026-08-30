export type ProjectSize = 'large' | 'small'

export interface ProjectFrontmatter {
  title: string
  id: string
  slug: string
  description: string
  categories: string[]
  thumbnail: string
  date: string
  featured: boolean
  size: ProjectSize
}
