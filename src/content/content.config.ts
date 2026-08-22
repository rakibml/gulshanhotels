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

// Flexible Reviews Schema with Passthrough
const reviews = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/reviews' }),
  schema: z.object({
    hotel: z.any().optional(),
    name: z.any().optional(),
    rating: z.any().optional(),
    date: z.any().optional(),
    comment: z.any().optional(),
    approved: z.any().optional(),
  }).passthrough(),
});

export const collections = { hotels, reviews };
