// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  build: {
    inlineStylesheets: 'always', // <--- এই সেটিংটি রেন্ডার-ব্লকিং সিএসএস বন্ধ করে ১৪০ms স্পিড বাড়িয়ে দেবে
  },
});
