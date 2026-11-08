// src/pages/sitemap-index.xml.ts
// Google & Bing Compliant Dynamic XML Sitemap with Consistent Trailing Slashes
import { getCollection } from 'astro:content';

export async function GET() {
  const siteOrigin = 'https://gulshanhotels.com';
  const today = new Date().toISOString().split('T')[0];

  const urlMap = new Map<string, { loc: string; lastmod: string; changefreq: string; priority: string }>();

  // Ensure all generated URLs strictly end with a trailing slash
  function addUrl(path: string, priority = '0.7', changefreq = 'weekly', lastmod = today) {
    const cleanPath = path.replace(/^\/+|\/+$/g, '');
    const fullUrl = cleanPath ? `${siteOrigin}/${cleanPath}/` : `${siteOrigin}/`;
    if (!urlMap.has(fullUrl)) {
      urlMap.set(fullUrl, { loc: fullUrl, lastmod, changefreq, priority });
    }
  }

  // Core static hub routes
  addUrl('', '1.0', 'daily');
  addUrl('blog', '0.8', 'daily');
  addUrl('about', '0.6', 'monthly');
  addUrl('contact', '0.7', 'monthly');
  addUrl('privacy', '0.5', 'monthly');
  addUrl('disclaimer', '0.5', 'monthly');

  // Hotel listings collection
  let hotels: any[] = [];
  try {
    const hotelCol = await (getCollection as any)('hotels');
    if (Array.isArray(hotelCol)) hotels = hotelCol;
  } catch (e) {}

  if (hotels.length === 0) {
    try {
      const rawGlob = import.meta.glob(['/src/content/hotels/*.{md,mdx}', '../../content/hotels/*.{md,mdx}'], { eager: true });
      hotels = Object.entries(rawGlob).map(([filePath, item]: [string, any]) => ({
        slug: filePath.split('/').pop()?.replace(/\.(md|mdx)$/, '')?.toLowerCase(),
        data: item?.frontmatter || item?.data || {}
      }));
    } catch (e) {}
  }

  hotels.forEach((h: any) => {
    const slug = String(h.slug || h.data?.slug || h.id || '').replace(/\.(md|mdx)$/, '').split('/').pop()?.toLowerCase();
    if (slug) {
      addUrl(slug, '0.9', 'daily', today);
    }
  });

  // Destinations & area guides
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
    if (slug) {
      addUrl(slug, '0.9', 'weekly', today);
    }
  });

  // Blog posts collection
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
    if (slug) {
      const postDate = p.data?.date ? new Date(p.data.date).toISOString().split('T')[0] : today;
      addUrl(`blog/${slug}`, '0.8', 'weekly', postDate);
    }
  });

  // CMS dynamic pages
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
    if (slug && !urlMap.has(`${siteOrigin}/${slug}/`)) {
      addUrl(slug, '0.6', 'monthly', today);
    }
  });

  const urlsArray = Array.from(urlMap.values());
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsArray
  .map(
    (item) => `  <url>
    <loc>${item.loc}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
