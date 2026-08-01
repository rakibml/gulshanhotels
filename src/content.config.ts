import { defineCollection, z } from 'astro:content';

const hotelsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.string().optional(),
    location: z.string().optional(),
    fullAddress: z.string().optional(),
    priceBDT: z.string().optional(),
    priceUSD: z.string().optional(),
    rating: z.union([z.number(), z.string()]).optional(),
    reviewsCount: z.string().optional(),
    image: z.string().optional(),
    gallery: z.array(z.string()).optional(),
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
    officialWebsite: z.string().optional(),
    mapEmbedUrl: z.string().optional(),
    editorNote: z.string().optional(),
    landmarks: z.array(z.object({
      name: z.string(),
      category: z.string().optional(),
      distance: z.string().optional(),
    })).optional(),
    amenities: z.array(z.string()).optional(),
    houseRules: z.object({
      checkIn: z.string().optional(),
      checkOut: z.string().optional(),
      cancellation: z.string().optional(),
      children: z.string().optional(),
      pets: z.string().optional(),
      payment: z.string().optional(),
    }).optional(),
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
    reviews: z.array(z.object({
      author: z.string(),
      date: z.string(),
      comment: z.string(),
    })).optional(),
  }),
});

export const collections = {
  hotels: hotelsCollection,
};
