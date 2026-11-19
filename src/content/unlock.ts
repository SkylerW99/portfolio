// Password-protected case studies (frontmatter `passwordHash`). Client-side only:
// keeps casual visitors out, not a real security boundary.
// To set/change a password:  printf 'NewPassword' | shasum -a 256

import { projects } from './generated-index'
import type { ProjectFrontmatter } from './types'

const storageKey = (slug: string) => `unlocked:${slug}`

/** Unlocked earlier in this browser tab session. */
export function isUnlocked(slug: string) {
  try {
    return sessionStorage.getItem(storageKey(slug)) === '1'
  } catch {
    return false
  }
}

export function markUnlocked(slug: string) {
  try {
    sessionStorage.setItem(storageKey(slug), '1')
  } catch {
    /* private mode: the caller still lets this view through */
  }
}

/** The project's password hash, if it has one. */
export function passwordHashFor(slug: string | null | undefined) {
  return slug ? projects.find((p) => p.slug === slug)?.passwordHash : undefined
}

/** Has a password and hasn't been unlocked in this session yet. */
export function isLocked(p: ProjectFrontmatter | string) {
  const slug = typeof p === 'string' ? p : p.slug
  return !!passwordHashFor(slug) && !isUnlocked(slug)
}

export async function sha256(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('')
}
