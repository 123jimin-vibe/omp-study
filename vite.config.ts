import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  optimizeDeps: { entries: ['index.html'] },
  server: { watch: { ignored: ['**/local/**'] } },
  build: { target: 'es2022' },
});
