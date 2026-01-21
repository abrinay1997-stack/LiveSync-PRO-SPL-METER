
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Inyecta las variables de entorno de Netlify en el objeto process.env para compatibilidad
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    'process.env': process.env
  }
});
