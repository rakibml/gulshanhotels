// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const hotels = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/hotels' }),
  schema: z.object({}).passthrough(), // .passthrough() দিলে কোনো ফিল্ডের কারণে আর কখনোই বিল্ড ফেল করবে না!
});

export const collections = { hotels };
