import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Points to the Convex-generated API types in the backend folder
      '@convex': path.resolve(__dirname, '../backend/convex/_generated'),
    },
  },
  server: {
    port: 3000,
    open: true,
    // Allow Vite to serve files from outside the frontend root (needed for @convex alias)
    fs: {
      allow: ['..'],
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
