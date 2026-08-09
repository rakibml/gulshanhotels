import { defineCollection, z } from 'astro:content';

const hotelsCollection = defineCollection({
  type: 'content',
  schema: z.object({}).passthrough(),
});

export const collections = {
  hotels: hotelsCollection,
};
