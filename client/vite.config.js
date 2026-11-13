import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Send /api requests to the Express server, so the browser sees one website (cookies work)
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
