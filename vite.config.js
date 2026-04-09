import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base:'/TUF_frontend/',  // MUST match repo name EXACTLY
  plugins:[react()]
})