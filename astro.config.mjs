// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://gulshanhotels.com', // <--- এই লাইনটি যুক্ত করা সবচেয়ে জরুরি!
  vite: {
    plugins: [tailwindcss()]
  },
  build: {
    inlineStylesheets: 'always', // ১০.৮ KB CSS ইনলাইন করে রেন্ডার-ব্লকিং ১৪০ms বন্ধ রাখবে
  }
});
