// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 1. Hotels Collection
const hotels = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/hotels' }),
  schema: z.object({}).passthrough(),
});

// 2. Sponsored Collection
const sponsored = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/sponsored' }),
  schema: z.object({}).passthrough(),
});

// 3. Homepage Sections Collection
const homepage_sections = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/homepage' }),
  schema: z.object({}).passthrough(),
});

// EXPORT ALL COLLECTIONS USED IN PROJECT
export const collections = { 
  hotels, 
  sponsored, 
  homepage_sections 
};
