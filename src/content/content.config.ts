import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const hotels = defineCollection({
  loader: glob({ base: 'src/content/hotels', pattern: '**/*.{md,mdx}' }),
  schema: z.object({}).passthrough(),
});

export const collections = {
  hotels,
};
