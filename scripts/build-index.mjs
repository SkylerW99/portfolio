//this file is for generating the project index

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const PROJECTS_DIR = path.join(process.cwd(), 'content/projects')
const OUT_FILE = path.join(process.cwd(), 'src/content/generated-index.ts')

const REQUIRED_FIELDS = [
  'title',
  'slug',
  'description',
  'categories',
  'thumbnail',
  'date',
  'featured',
  'size',
]

const STATUSES = ['coming-soon', 'in-progress']

function readProjectFrontmatter(fileName) {
  const filePath = path.join(PROJECTS_DIR, fileName)
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data } = matter(raw)

  for (const field of REQUIRED_FIELDS) {
    if (!(field in data)) {
      throw new Error(`${fileName} is missing required frontmatter field "${field}"`)
    }
  }

  if (data.slug !== fileName.replace(/\.mdx$/, '')) {
    throw new Error(
      `${fileName}: frontmatter slug "${data.slug}" must match the filename ("${fileName.replace(/\.mdx$/, '')}")`,
    )
  }

  // status: case-insensitive, so "In-Progress" works; anything unknown fails the build
  // instead of silently turning the card into a live case-study link.
  if (data.status != null) {
    const status = String(data.status).trim().toLowerCase().replace(/[\s_]+/g, '-')
    if (!STATUSES.includes(status)) {
      throw new Error(`${fileName}: status "${data.status}" must be one of: ${STATUSES.join(', ')}`)
    }
    data.status = status
  }

  return data
}

function buildIndex() {
  const files = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith('.mdx'))
  // `order` (ascending) sets the curated Work / Archive order; anything without it
  // falls after, newest first. Drafts never reach the site.
  const projects = files
    .map(readProjectFrontmatter)
    .filter((p) => !p.draft)
    .sort((a, b) => {
      const ao = a.order ?? Infinity, bo = b.order ?? Infinity
      if (ao !== bo) return ao - bo
      return +new Date(b.date) - +new Date(a.date)
    })

  const header = `// GENERATED FILE — do not edit by hand.\n// Run \`npm run build-index\` (or \`npm run dev\`/\`npm run build\`, which run it automatically)\n// to regenerate this from content/projects/*.mdx\nimport type { ProjectFrontmatter } from './types'\n\n`
  const body = `export const projects: ProjectFrontmatter[] = ${JSON.stringify(projects, null, 2)}\n`

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })
  fs.writeFileSync(OUT_FILE, header + body)
  console.log(`Wrote ${projects.length} project(s) to ${path.relative(process.cwd(), OUT_FILE)}`)
}

buildIndex()
