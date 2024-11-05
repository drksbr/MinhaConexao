import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      '/bgp': {
        target: 'https://bgp.tools', // O domínio alvo
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bgp/, ''), // Remove o /api do caminho da URL
      },
    },
  },
})
