import { defineCollection, z } from 'astro:content';

const hotelsCollection = defineCollection({
  type: 'content', // 👈 Astro v7-এর জন্য এটি আবশ্যিক
  schema: z.object({}).passthrough(),
});

export const collections = {
  hotels: hotelsCollection,
};
