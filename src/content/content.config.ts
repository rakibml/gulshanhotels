// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const hotels = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/hotels' }),
  schema: z.object({
    title: z.string().optional(),
    name: z.string().optional(),
    category: z.string().optional(),
    location: z.string().optional(),
    price: z.string().optional(),
    rating: z.union([z.number(), z.string()]).optional().nullable(),
    reviewsCount: z.union([z.number(), z.string()]).optional().nullable(),
    image: z.string().optional().nullable(),
    popular: z.boolean().optional(),
  }).passthrough(),
});

export const collections = { hotels };
