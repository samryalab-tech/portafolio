import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <--- El plugin oficial de v4

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <--- Se añade aquí
  ],
})