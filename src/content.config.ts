// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const hotels = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/hotels' }),
  schema: z.object({
    title: z.string().optional(),
    name: z.string().optional(),
    category: z.string().optional(),
    location: z.string().optional(),
    price: z.string().optional(),
    rating: z.union([z.number(), z.string()]).optional().nullable(),
    reviewsCount: z.union([z.number(), z.string()]).optional().nullable(),
    image: z.string().optional().nullable(),
    gallery: z.array(z.string()).optional(),
    officialSite: z.string().optional().nullable(),
    whatsapp: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    enable_rates: z.boolean().optional(),
    enable_amenities: z.boolean().optional(),
    enable_nearby: z.boolean().optional(),
    enable_details: z.boolean().optional(),
    enable_rules: z.boolean().optional(),
    enable_faqs: z.boolean().optional(),
    amenities: z.array(z.string()).optional(),
    nearby_places: z.array(z.object({
      name: z.string().optional(),
      distance: z.string().optional(),
      details: z.string().optional(),
    })).optional(),
    faqs: z.array(z.object({
      question: z.string().optional(),
      answer: z.string().optional(),
    })).optional(),
    custom_sections: z.array(z.object({
      title: z.string().optional(),
      content: z.string().optional(),
    })).optional(),
  }).passthrough(), // .passthrough() ensures CMS input never crashes Astro build!
});

export const collections = { hotels };
