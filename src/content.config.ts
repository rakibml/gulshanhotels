// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders'; // Astro v5 Loader

const hotels = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/hotels" }),
  schema: z.record(z.any()),
});

const sponsored = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/sponsored" }),
  schema: z.record(z.any()),
});

export const collections = {
  hotels,
  sponsored,
};
