import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1300,
    rollupOptions: {
      output: {
        // Function form on purpose: the object form hoisted react INTO the
        // three chunk, making the intro screen wait for 975 KB of three.js.
        // Only 3D libs go in the lazy chunk; react stays in the entry.
        manualChunks(id) {
          if (/node_modules[\\/](three|@react-three)[\\/]/.test(id)) return 'three'
          // zustand rides along: fiber depends on it too, and without a home
          // Rollup parks shared deps inside the huge lazy 'three' chunk
          if (/node_modules[\\/](react|react-dom|scheduler|zustand|framer-motion|@vercel)[\\/]/.test(id)) return 'react'
          // Vite/Rollup virtual helpers (preload helper, commonjs helpers) are
          // shared by every chunk — without a home they get parked in 'three',
          // which drags 830 KB of three.js into the eager entry graph.
          if (id.startsWith('\0')) return 'react'
        },
      },
    },
  },
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup.js'],
    include: ['tests/**/*.test.js'], // tests/e2e/*.spec.js belongs to Playwright
  },
})
