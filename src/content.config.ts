// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ১. হোটেল ডিরেক্টরি কালেকশন
const hotels = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/hotels' }),
  schema: z.object({
    title: z.string().optional(),
    name: z.string().optional(),
    slug: z.string().optional(),
  }).passthrough(),
});

// ২. ডেস্টিনেশন ও এরিয়া গাইড কালেকশন (যেমন: Hotels in Gulshan 2)
const destinations = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/destinations' }),
  schema: z.object({
    title: z.string().optional(),
    slug: z.string().optional(),
    description: z.string().optional(),
  }).passthrough(),
});

// ৩. ট্রাভেল গাইড ও ব্লগ পোস্ট কালেকশন
const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/posts' }),
  schema: z.object({
    title: z.string().optional(),
    slug: z.string().optional(),
    description: z.string().optional(),
    date: z.any().optional(),
    category: z.string().optional(),
  }).passthrough(),
});

// ৪. সাধারণ ও লিগ্যাল পেজ কালেকশন (About, Privacy, Terms ইত্যাদি)
const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/pages' }),
  schema: z.object({
    title: z.string().optional(),
    slug: z.string().optional(),
    description: z.string().optional(),
  }).passthrough(),
});

// ৫. হোমপেজ সেটিংস কালেকশন
const homepage = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/homepage' }),
  schema: z.object({
    enable_popular_hotels: z.boolean().optional(),
    popular_hotels_title: z.string().optional(),
    popular_hotels_subtitle: z.string().optional(),
    max_hotels: z.number().optional(),
  }).passthrough(),
});

// ৬. গেস্ট রিভিউ কালেকশন
const reviews = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/reviews' }),
  schema: z.object({
    hotel: z.any().optional(),
    approved: z.boolean().optional(),
  }).passthrough(),
});

// ৭. নিউজলেটার সাবস্ক্রাইবার্স কালেকশন
const subscribers = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/subscribers' }),
  schema: z.object({
    email: z.string().optional(),
  }).passthrough(),
});

// সবগুলো কালেকশন একত্রে এক্সপোর্ট
export const collections = { 
  hotels, 
  destinations, 
  posts, 
  pages, 
  homepage, 
  reviews, 
  subscribers 
};
