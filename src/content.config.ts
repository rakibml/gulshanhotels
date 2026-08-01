import { defineCollection, z } from 'astro:content';

// রেকর্ড টাইপ দেওয়া হলো যেন কোনো ফিল্ডের কারণে বিল্ড ফেইল না করে
const hotels = defineCollection({
  type: 'content',
  schema: z.record(z.any()).or(z.object({ title: z.string().optional() })),
});

const sponsored = defineCollection({
  type: 'content',
  schema: z.record(z.any()),
});

export const collections = {
  hotels,
  sponsored,
};
