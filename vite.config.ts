import { defineConfig } from 'vite';

// base './' makes the build work from any URL path (GitHub Pages serves us under /rewind/).
export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: { main: 'index.html', visualizer: 'visualizer.html' },
    },
  },
});
