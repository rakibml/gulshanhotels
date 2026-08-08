import { defineCollection, z } from 'astro:content';

const hotelsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    image: z.string().optional(),
    
    // Safety Defaults
    showCategory: z.boolean().default(true),
    category: z.string().optional(),
    
    showLocation: z.boolean().default(true),
    location: z.string().optional(),
    locationDetail: z.string().optional(),
    
    showRating: z.boolean().default(true),
    rating: z.string().optional(),
    
    showDescription: z.boolean().default(true),
    description: z.string().optional(),
    
    showCheckPrice: z.boolean().default(true),
    showDetailsBtn: z.boolean().default(true),
  }),
});

export const collections = {
  hotels: hotelsCollection,
};
