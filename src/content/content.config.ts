import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const hotelsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/hotels' }),
  schema: z.object({
    title: z.any().optional(),
    slug: z.any().optional(),
    category: z.any().optional(),
    location: z.any().optional(),
    fullAddress: z.any().optional(),
    priceBDT: z.any().optional(),
    priceUSD: z.any().optional(),
    rating: z.any().optional(),
    reviewsCount: z.any().optional(),
    image: z.any().optional(),
    editorNote: z.any().optional(),
    showCategory: z.any().optional(),
    showLocation: z.any().optional(),
    showRating: z.any().optional(),
    showDescription: z.any().optional(),
    showCheckPrice: z.any().optional(),
    showDetailsBtn: z.any().optional(),
  }).passthrough(),
});

export const collections = {
  hotels: hotelsCollection,
};
