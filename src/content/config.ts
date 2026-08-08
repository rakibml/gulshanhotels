import { defineCollection, z } from 'astro:content';

const hotelsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    // slug কে অপশনাল রাখা হয়েছে যেন ফাইল নেম থেকে অটোমেটিক নিতে পারে
    slug: z.string().nullable().optional(),
    image: z.string().nullable().optional(),
    
    // Nullable + Optional + Transform (Cloudflare deployment safe)
    showCategory: z.boolean().nullable().optional().transform((val) => val ?? true),
    category: z.string().nullable().optional(),
    
    showLocation: z.boolean().nullable().optional().transform((val) => val ?? true),
    location: z.string().nullable().optional(),
    locationDetail: z.string().nullable().optional(),
    
    showRating: z.boolean().nullable().optional().transform((val) => val ?? true),
    rating: z.string().nullable().optional(),
    
    showDescription: z.boolean().nullable().optional().transform((val) => val ?? true),
    description: z.string().nullable().optional(),
    
    showCheckPrice: z.boolean().nullable().optional().transform((val) => val ?? true),
    showDetailsBtn: z.boolean().nullable().optional().transform((val) => val ?? true),
  }),
});

export const collections = {
  hotels: hotelsCollection,
};
