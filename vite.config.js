import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'VITE_');
  const proxy = { '/api': { target: env.VITE_BACKEND_URL || 'http://127.0.0.1:4444' } };
  return { plugins: [react()], server: { proxy }, preview: { proxy } };
})
