import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'date-fns/_lib/format/longFormatters': 'date-fns/esm/_lib/format/longFormatters',
    },
  },
  server: {
    https: {
      key: './localhost-key.pem', 
      cert: './localhost.pem',   
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8000', 
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
