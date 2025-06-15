<<<<<<< HEAD
<<<<<<< HEAD
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
=======
=======
>>>>>>> d50b4b1 (committs)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
<<<<<<< HEAD
>>>>>>> cfc1b5c (commit)
=======
>>>>>>> d50b4b1 (committs)
