// src/content.config.ts (Astro v5 Content Layer with Hotels & Guest Reviews Loaders)
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 1. Hotels Collection Loader
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

// 2. Guest Reviews Collection Loader (For Customer Reviews Approval)
const reviews = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/reviews' }),
  schema: z.object({
    hotel: z.string(),
    name: z.string(),
    rating: z.union([z.number(), z.string()]).optional().nullable().default(5),
    date: z.string().optional().nullable(),
    comment: z.string().optional(),
    approved: z.boolean().optional().default(false),
  }).passthrough(),
});

// Export Both Collections to Astro
export const collections = { hotels, reviews };
