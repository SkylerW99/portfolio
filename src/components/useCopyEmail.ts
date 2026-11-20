// Copy the contact email to the clipboard (instead of opening a mail app) and
// flag `copied` for two seconds so the caller can show "Copied ✓".
// Used by the Contact pop-up and the side panel's email line.

import { useEffect, useRef, useState } from 'react'
import { EMAIL } from '../content/contact'

export function useCopyEmail() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(EMAIL)
    } catch {
      // Older/insecure contexts: fall back to a hidden textarea + execCommand.
      const ta = document.createElement('textarea')
      ta.value = EMAIL
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 2000)
  }

  return { copied, copy }
}
