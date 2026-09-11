import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // El sitio se publica en https://jimenajr05.github.io/segunda-vida/
  // (no en la raíz del dominio), así que todos los assets deben salir
  // con ese prefijo.
  base: '/segunda-vida/',
  plugins: [react()],
  server: {
    port: 3000,
    open: false
  }
});
