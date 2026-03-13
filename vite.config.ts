import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: { port: 5176, host: true },
  resolve: {
    alias: {
      'glow-ds/components': path.resolve(__dirname, '../glow-design-system/src/components/index.ts'),
      'glow-ds/tokens': path.resolve(__dirname, '../glow-design-system/tokens/index.ts'),
      '@glow-icons': path.resolve(__dirname, '../glow-design-system/src/components/Icon'),
    },
    dedupe: ['react', 'react-dom'],
  },
})
