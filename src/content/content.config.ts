import { defineCollection, z } from 'astro:content';

const hotelsCollection = defineCollection({
  schema: z.object({}).passthrough(),
});

export const collections = {
  hotels: hotelsCollection,
};
