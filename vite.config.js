import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // El sitio se publica en dos lugares con rutas distintas:
  // - Vercel (https://segunda-vida-catalogo.vercel.app/) vive en la raíz.
  // - GitHub Pages (https://jimenajr05.github.io/segunda-vida/) vive en
  //   una subcarpeta, porque el repo se llama "segunda-vida".
  // Vercel define automáticamente la variable de entorno VERCEL=1 durante
  // su build, así que la usamos para elegir el prefijo correcto en cada caso.
  base: process.env.VERCEL ? '/' : '/segunda-vida/',
  plugins: [react()],
  server: {
    port: 3000,
    open: false
  }
});
