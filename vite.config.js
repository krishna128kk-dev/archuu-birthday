import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// base: './' makes the build use relative asset paths, so it works when
// deployed to Netlify, Vercel, GitHub Pages (project or user site), or
// even opened from a random subfolder.
export default defineConfig({
  plugins: [react()],
  base: './',
})
