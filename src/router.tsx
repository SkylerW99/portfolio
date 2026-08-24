//for routing to different pages

import { createBrowserRouter } from 'react-router-dom'
import { Component as Landing } from './pages/Landing'
import { Component as Archive } from './pages/Archive'
import { Component as About } from './pages/About'

export const router = createBrowserRouter([
  { path: '/', Component: Landing },
  { path: '/archive', Component: Archive },
  { path: '/about', Component: About },
  { path: '/work/:slug', lazy: () => import('./pages/ProjectDetail') },
])
