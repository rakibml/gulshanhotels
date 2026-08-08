import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const hotelsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/hotels' }),
  schema: z.object({
    title: z.string().optional(),
    slug: z.any().optional(),
    image: z.any().optional(),
    
    showCategory: z.any().optional(),
    category: z.any().optional(),
    
    showLocation: z.any().optional(),
    location: z.any().optional(),
    locationDetail: z.any().optional(),
    
    showRating: z.any().optional(),
    rating: z.any().optional(),
    
    showDescription: z.any().optional(),
    description: z.any().optional(),
    
    showCheckPrice: z.any().optional(),
    showDetailsBtn: z.any().optional(),
  }).passthrough(), // passthrough দিলে অজানা কোনো ফিল্ড থাকলেও কখনো বিল্ড ফেইল করবে না
});

export const collections = {
  hotels: hotelsCollection,
};
