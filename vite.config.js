import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const podcastNavigation = {
  name: 'faithhub-in-flow-podcasts',
  transformIndexHtml(html, ctx) {
    if (ctx.path?.includes('podcasts.html')) return html;
    if (/href=["'](?:\.\/)?podcasts\.html["']/.test(html)) return html;
    const navigation = '<nav id="faithhub-podcast-shortcut" aria-label="Faith podcasts" ' +
      'style="display:block;margin:0 0 16px">' +
      '<a href="./podcasts.html" style="display:inline-flex;align-items:center;justify-content:center;' +
      'min-height:48px;min-width:135px;border:2px solid #fff;border-radius:12px;' +
      'padding:10px 16px;background:#111827;color:#fff;font:700 15px/1.4 system-ui,sans-serif;' +
      'text-decoration:none">Faith podcasts</a></nav>';
    return html.replace(/(<main(?:\s[^>]*)?>)/i, '$1\n' + navigation);
  },
}

export default defineConfig({
  plugins: [react(), podcastNavigation],
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
        atlas: fileURLToPath(new URL('./scripture-atlas.html', import.meta.url)),
        psalms: fileURLToPath(new URL('./psalms.html', import.meta.url)),
      },
    },
  },
})