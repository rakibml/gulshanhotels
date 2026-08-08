import { defineCollection, z } from 'astro:content';

// ১. টেক্সট বা সংখ্যা (যেমন 4.8) দুটোকেই নিরাপদে স্ট্রিং বানিয়ে ফেলার হেলপার
const stringOrNumber = z
  .union([z.string(), z.number()])
  .nullable()
  .optional()
  .transform((val) => (val !== null && val !== undefined ? String(val) : undefined));

// ২. ট্রু/ফলস বা নাল থাকলে নিরাপদে বুলিয়ান হ্যান্ডেল করার হেলপার
const booleanDefaultTrue = z
  .union([z.boolean(), z.string()])
  .nullable()
  .optional()
  .transform((val) => {
    if (val === false || val === 'false') return false;
    return true;
  });

const hotelsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: stringOrNumber,
    image: stringOrNumber,
    
    // Safety Controls with Union & Transform (No build failure guaranteed)
    showCategory: booleanDefaultTrue,
    category: stringOrNumber,
    
    showLocation: booleanDefaultTrue,
    location: stringOrNumber,
    locationDetail: stringOrNumber,
    
    showRating: booleanDefaultTrue,
    rating: stringOrNumber,
    
    showDescription: booleanDefaultTrue,
    description: stringOrNumber,
    
    showCheckPrice: booleanDefaultTrue,
    showDetailsBtn: booleanDefaultTrue,
  }),
});

export const collections = {
  hotels: hotelsCollection,
};
