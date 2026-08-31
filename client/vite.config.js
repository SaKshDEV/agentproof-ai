import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwind from "@tailwindcss/vite"


export default defineConfig({
  plugins: [
    react(),
    tailwind()
  ],
})
