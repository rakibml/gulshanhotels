// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const hotels = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/hotels' }),
  schema: z.object({
    title: z.string().optional(),
    name: z.string().optional(),
  }).passthrough(),
});

const homepage = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/homepage' }),
  schema: z.object({
    enable_popular_hotels: z.boolean().optional(),
    popular_hotels_title: z.string().optional(),
    popular_hotels_subtitle: z.string().optional(),
    max_hotels: z.number().optional(),
  }).passthrough(),
});

const reviews = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/reviews' }),
  schema: z.object({
    hotel: z.any().optional(),
  }).passthrough(),
});

const subscribers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/subscribers' }),
  schema: z.object({
    email: z.string().optional(),
  }).passthrough(),
});

export const collections = { hotels, homepage, reviews, subscribers };
