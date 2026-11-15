//for routing to different pages

import { createBrowserRouter } from 'react-router-dom'
import { Component as SiteShell } from './components/SiteShell/SiteShell'
import { Component as Landing } from './pages/landing/Landing'
import { Component as Archive } from './pages/Archive'

export const router = createBrowserRouter([
  {
    // Shared left panel; the right side swaps between views.
    Component: SiteShell,
    children: [
      { path: '/', Component: Landing },
      { path: '/archive', Component: Archive },
      // About is a pop-up over the home feed (SiteShell opens it for this path).
      { path: '/about', Component: Landing },
    ],
  },
  // Case studies stay full pages outside the shell, with their own top bar.
  { path: '/work/:slug', lazy: () => import('./pages/ProjectDetail') },
])
