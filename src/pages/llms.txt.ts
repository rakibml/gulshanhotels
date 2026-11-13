// src/pages/llms.txt.ts
import type { APIRoute } from "astro";

export const prerender = true;

export const GET: APIRoute = async () => {
  const SITE = "https://gulshanhotels.com";

  // আপনার src/content/hotels (বা hotel) ফোল্ডার থেকে সব হোটেল অটোমেটিক পড়বে
  const hotelFiles = import.meta.glob(
    ["/src/content/hotels/**/*.{md,mdx}", "/src/content/hotel/**/*.{md,mdx}"],
    { eager: true }
  );

  const hotels = Object.entries(hotelFiles)
    .map(([filePath, mod]: [string, any]) => {
      const data = mod?.frontmatter || mod?.data || {};
      const isDraft = data.draft === true || String(data.draft).toLowerCase() === "true";
      if (isDraft) return null;

      const title = String(data.title || data.name || "").trim();
      if (!title) return null;

      const fileSlug = filePath.split("/").pop()?.replace(/\.(md|mdx)$/i, "") || "";
      const slug = String(data.slug || fileSlug).trim().replace(/^\/+|\/+$/g, "").toLowerCase();
      if (!slug) return null;

      const category = String(data.category || "").trim();
      const location = String(data.location || "").trim();
      const meta = [category, location].filter(Boolean).join(" in ");

      return `- [${title}](${SITE}/${slug}/)${meta ? `: ${meta}.` : ""}`;
    })
    .filter((item): item is string => Boolean(item))
    .sort((a, b) => a.localeCompare(b));

  // ব্লগ/গাইড থাকলে সেগুলোও অটোমেটিক পড়বে
  const blogFiles = import.meta.glob(
    ["/src/content/blog/**/*.{md,mdx}", "/src/content/posts/**/*.{md,mdx}"],
    { eager: true }
  );

  const guides = Object.entries(blogFiles)
    .map(([filePath, mod]: [string, any]) => {
      const data = mod?.frontmatter || mod?.data || {};
      const isDraft = data.draft === true || String(data.draft).toLowerCase() === "true";
      if (isDraft) return null;

      const title = String(data.title || "").trim();
      if (!title) return null;

      const fileSlug = filePath.split("/").pop()?.replace(/\.(md|mdx)$/i, "") || "";
      const slug = String(data.slug || fileSlug).trim().replace(/^\/+|\/+$/g, "").toLowerCase();
      if (!slug) return null;

      return `- [${title}](${SITE}/blog/${slug}/)`;
    })
    .filter((item): item is string => Boolean(item))
    .sort((a, b) => a.localeCompare(b));

  const lines = [
    "# GulshanHotels.com",
    "",
    "> An independent directory and travel guide to hotels in Gulshan 1 and Gulshan 2, Dhaka, Bangladesh. Provides hotel overviews, approximate room rates, amenities, and area tips for travelers.",
    "",
    "## Area Guides",
    `- [Hotels in Gulshan 1](${SITE}/hotels-in-gulshan-1/): Browse hotels, approximate rates, and area guide for Gulshan 1.`,
    `- [Hotels in Gulshan 2](${SITE}/hotels-in-gulshan-2/): Browse hotels, diplomatic zone stays, and rates in Gulshan 2.`,
    "",
    "## Listed Hotels",
    ...(hotels.length > 0 ? hotels : ["- Browse all hotels on the homepage."]),
    "",
    ...(guides.length > 0 ? ["## Travel Guides & Tips", ...guides, ""] : []),
    "## Info & Support",
    `- [About Us](${SITE}/about/): Learn about GulshanHotels.com.`,
    `- [Contact Us](${SITE}/contact/): Get in touch or request a hotel listing.`,
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
