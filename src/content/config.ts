// src/content/config.ts
import { z, defineCollection } from 'astro:content';

const hotelsCollection = defineCollection({
  type: 'content',
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

export const collections = {
  'hotels': hotelsCollection,
};