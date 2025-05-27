import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all /api requests to your backend server
      '/api': {
        target: 'http://localhost:3001', // Your backend server address
        changeOrigin: true,
        secure: false,
        // Uncomment this if your API paths are rewritten on the server
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});