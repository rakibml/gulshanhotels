// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const hotels = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/hotels' }),
  schema: z.object({
    title: z.string().optional(),
    category: z.string().optional(),
    location: z.string().optional(),
    price: z.string().optional(),
    rating: z.number().optional(),
    image: z.string().optional(),
    featured: z.boolean().optional(),
  }),
});

export const collections = { hotels };