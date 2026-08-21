import { defineConfig, type Plugin, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { execFileSync } from 'node:child_process'

function rebuildIndexOnMdxChange(): Plugin {
  const projectMdxPattern = /[/\\]content[/\\]projects[/\\].+\.mdx$/
  let reloadTimer: ReturnType<typeof setTimeout> | undefined

  return {
    name: 'rebuild-index-on-mdx-change',
    apply: 'serve' as const,
    configureServer(server: ViteDevServer) {
      const rebuildAndReload = (filePath: string) => {
        if (!projectMdxPattern.test(filePath)) {
          return
        }

        try {
          execFileSync('node', ['scripts/build-index.mjs'], { stdio: 'inherit' })
        } catch {
          // Keep the dev server alive; the script already prints the real error.
          return
        }

        if (reloadTimer) {
          clearTimeout(reloadTimer)
        }

        // Coalesce rapid file events into a single browser refresh.
        reloadTimer = setTimeout(() => {
          server.ws.send({ type: 'full-reload' })
        }, 60)
      }

      server.watcher.on('add', rebuildAndReload)
      server.watcher.on('change', rebuildAndReload)
      server.watcher.on('unlink', rebuildAndReload)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter] }) },
    react({ include: /\.(jsx|tsx|mdx)$/ }),
    rebuildIndexOnMdxChange(),
  ],
})
