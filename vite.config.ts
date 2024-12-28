import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(), svgr()],
  assetsInclude: ['**/*.jpg', '**/*.webp', '**/*.svg'],
});