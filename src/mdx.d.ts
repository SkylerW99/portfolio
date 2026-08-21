declare module '*.mdx' {
  import type { ComponentType } from 'react'
  export const frontmatter: import('./content/types').ProjectFrontmatter
  const MDXComponent: ComponentType
  export default MDXComponent
}
