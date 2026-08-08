import { defineCollection, z } from 'astro:content';

const hotelsCollection = defineCollection({
  type: 'content', // 👈 Astro-র নেটিভ কন্টেন্ট লোডার (এটি ফাইল খুঁজে পেতে কখনো ফেইল করে না)
  schema: z.object({}).passthrough(), // 👈 passthrough দেওয়ার ফলে Zod কোনো ফিল্ড নিয়েই এরর দেবে না
});

export const collections = {
  hotels: hotelsCollection,
};
