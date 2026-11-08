// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://gulshanhotels.com',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()]
  },
  build: {
    inlineStylesheets: 'always'
  }
});
