import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const podcastDock = {
  name: 'josh-podcast-dock',
  transformIndexHtml(html, ctx) {
    // Keep sensitive prayer reflections free of third-party launchers.
    if ((ctx.path?.includes('prayer-practice.html') || ctx.path?.includes('daily-prayer.html') || ctx.path?.includes('prayer-library.html'))) return []
    return [{
      tag: 'script',
      attrs: {
        src: 'https://cdn.jsdelivr.net/gh/joshualparris/JoshHub@ebb0d17495c92d3ce09df1fd1bdb5d4c2056914d/public/podcast-launcher-v3.js',
        'data-topics': 'faith',
        'data-label': '🎧 Listen to a different faith podcast',
        'data-launcher-label': '🎧 Podcasts',
        'data-quiet-selectors': "[data-prayer-mode='true'],.prayer-mode,.reflection-mode",
        defer: true,
      },
      injectTo: 'body',
    }]
  },
}

export default defineConfig({
  plugins: [react(), podcastDock],
  // Relative assets make this work on both username.github.io and username.github.io/repo-name.
  base: './',
  // Keep the standalone prayer guide reachable in Vite previews as well as GitHub Pages.
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        library: fileURLToPath(new URL('./prayer-library.html', import.meta.url)),
        daily: fileURLToPath(new URL('./daily-prayer.html', import.meta.url)),
        podcasts: fileURLToPath(new URL('./podcasts.html', import.meta.url)),
        prayer: fileURLToPath(new URL('./prayer-practice.html', import.meta.url)),
      },
    },
  },
})