// src/pages/sitemap-index.xml.ts
// Clean, Minimal & 100% Google Compliant XML Sitemap (No Lastmod)
import { getCollection } from 'astro:content';

export async function GET() {
  const siteOrigin = 'https://gulshanhotels.com';
  const isProd = import.meta.env.PROD;

  const urlSet = new Set<string>();

  // XML নিরাপদ টেক্সট এস্কেপার
  function escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  // ক্যানোনিকাল স্ল্যাশ নিশ্চিত করে URL যুক্ত করা
  function addUrl(pathStr: string) {
    const cleanPath = pathStr.replace(/^\/+|\/+$/g, '');
    const fullUrl = cleanPath ? `${siteOrigin}/${cleanPath}/` : `${siteOrigin}/`;
    urlSet.add(escapeXml(fullUrl));
  }

  // ================= ১. মূল স্ট্যাটিক পেজসমূহ =================
  addUrl('');
  addUrl('blog');
  addUrl('about');
  addUrl('contact');
  addUrl('privacy');
  addUrl('disclaimer');

  // ================= ২. হোটেল কালেকশন (ড্রাফট ফিল্টারসহ) =================
  let hotels: any[] = [];
  try {
    const hotelCol = await (getCollection as any)('hotels', ({ data }: any) => {
      return isProd ? data?.draft !== true : true;
    });
    if (Array.isArray(hotelCol)) hotels = hotelCol;
  } catch (e) {}

  if (hotels.length === 0) {
    try {
      const rawGlob = import.meta.glob(['/src/content/hotels/*.{md,mdx}', '../../content/hotels/*.{md,mdx}'], { eager: true });
      hotels = Object.entries(rawGlob)
        .filter(([_, item]: [string, any]) => (isProd ? item?.frontmatter?.draft !== true : true))
        .map(([filePath, item]: [string, any]) => ({
          slug: filePath.split('/').pop()?.replace(/\.(md|mdx)$/, '')?.toLowerCase(),
          data: item?.frontmatter || item?.data || {}
        }));
    } catch (e) {}
  }

  hotels.forEach((h: any) => {
    const slug = String(h.slug || h.data?.slug || h.id || '').replace(/\.(md|mdx)$/, '').split('/').pop()?.toLowerCase();
    if (slug) addUrl(slug);
  });

  // ================= ৩. ডেস্টিনেশন ও এরিয়া গাইড =================
  let destinations: any[] = [];
  try {
    const destCol = await (getCollection as any)('destinations');
    if (Array.isArray(destCol)) destinations = destCol;
  } catch (e) {}

  if (destinations.length === 0) {
    try {
      const rawGlobDest = import.meta.glob(['/src/content/destinations/*.{md,mdx}', '../../content/destinations/*.{md,mdx}'], { eager: true });
      destinations = Object.entries(rawGlobDest).map(([filePath, item]: [string, any]) => ({
        slug: filePath.split('/').pop()?.replace(/\.(md|mdx)$/, '')?.toLowerCase(),
        data: item?.frontmatter || item?.data || {}
      }));
    } catch (e) {}
  }

  destinations.forEach((d: any) => {
    const slug = String(d.slug || d.data?.slug || d.id || '').replace(/\.(md|mdx)$/, '').split('/').pop()?.toLowerCase();
    if (slug) addUrl(slug);
  });

  // ================= ৪. ট্রাভেল গাইড ও ব্লগ পোস্ট =================
  let posts: any[] = [];
  try {
    const postCol = await (getCollection as any)('posts');
    if (Array.isArray(postCol)) posts = postCol;
  } catch (e) {}

  if (posts.length === 0) {
    try {
      const rawGlobPosts = import.meta.glob(['/src/content/posts/*.{md,mdx}', '../../content/posts/*.{md,mdx}'], { eager: true });
      posts = Object.entries(rawGlobPosts).map(([filePath, item]: [string, any]) => ({
        slug: filePath.split('/').pop()?.replace(/\.(md|mdx)$/, '')?.toLowerCase(),
        data: item?.frontmatter || item?.data || {}
      }));
    } catch (e) {}
  }

  posts.forEach((p: any) => {
    const slug = String(p.slug || p.data?.slug || p.id || '').replace(/\.(md|mdx)$/, '').split('/').pop()?.toLowerCase();
    if (slug) addUrl(`blog/${slug}`);
  });

  // ================= ৫. সাধারণ কন্টেন্ট পেজ =================
  let pages: any[] = [];
  try {
    const pageCol = await (getCollection as any)('pages');
    if (Array.isArray(pageCol)) pages = pageCol;
  } catch (e) {}

  if (pages.length === 0) {
    try {
      const rawGlobPages = import.meta.glob(['/src/content/pages/*.{md,mdx}', '../../content/pages/*.{md,mdx}'], { eager: true });
      pages = Object.entries(rawGlobPages).map(([filePath, item]: [string, any]) => ({
        slug: filePath.split('/').pop()?.replace(/\.(md|mdx)$/, '')?.toLowerCase(),
        data: item?.frontmatter || item?.data || {}
      }));
    } catch (e) {}
  }

  pages.forEach((pg: any) => {
    const slug = String(pg.slug || pg.data?.slug || pg.id || '').replace(/\.(md|mdx)$/, '').split('/').pop()?.toLowerCase();
    if (slug) addUrl(slug);
  });

  // ================= XML জেনারেটর (শুধুমাত্র পরিষ্কার <loc> ট্যাগ) =================
  const urlsArray = Array.from(urlSet);
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsArray
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
  </url>`
  )
  .join('\n')}
</urlset>`.trim();

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
