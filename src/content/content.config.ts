import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const hotelsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/hotels' }),
  schema: z.object({}).passthrough(),
});

export const collections = {
  hotels: hotelsCollection,
};
