// src/pages/sitemap-index.xml.ts
// 100% Real File Modification & Frontmatter Date Finder (Google Search Central Compliant)
import fs from 'node:fs';
import path from 'node:path';
import { getCollection } from 'astro:content';

export async function GET() {
  const siteOrigin = 'https://gulshanhotels.com';
  const isProd = import.meta.env.PROD;
  const today = new Date().toISOString().split('T')[0];

  const urlMap = new Map<string, { loc: string; lastmod: string }>();

  // XML নিরাপদ টেক্সট এস্কেপার
  function escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  // ১. ফাইল সিস্টেম ও ফ্রন্টম্যাটার থেকে ১০০% আসল তারিখ বের করার ফাংশন
  function getRealFileDate(relPath: string, frontmatterDate?: any): string {
    // ক. ফ্রন্টম্যাটারে তারিখ থাকলে সেটা নেবে
    if (frontmatterDate) {
      const parsed = new Date(frontmatterDate);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString().split('T')[0];
      }
    }

    // খ. ফ্রন্টম্যাটারে না থাকলে ফাইলটি কম্পিউটারে শেষ কবে সেভ হয়েছে সেই আসল তারিখ নেবে
    try {
      const fullPath = path.resolve(process.cwd(), relPath);
      if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        return stats.mtime.toISOString().split('T')[0];
      }
    } catch (e) {}

    // গ. ফাইল না পেলে আজকের আসল তারিখ
    return today;
  }

  // ২. কন্টেন্ট ফোল্ডারের ফাইল থেকে আসল তারিখ খোঁজার হেল্পার
  function getContentFileDate(folder: string, filename: string, frontmatterDate?: any): string {
    if (frontmatterDate) {
      const parsed = new Date(frontmatterDate);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString().split('T')[0];
      }
    }

    const extensions = ['.md', '.mdx', ''];
    for (const ext of extensions) {
      const relPath = path.join('src/content', folder, filename.endsWith(ext) ? filename : `${filename}${ext}`);
      try {
        const fullPath = path.resolve(process.cwd(), relPath);
        if (fs.existsSync(fullPath)) {
          return fs.statSync(fullPath).mtime.toISOString().split('T')[0];
        }
      } catch (e) {}
    }

    return today;
  }

  // ৩. সাইটম্যাপে URL যুক্ত করা
  function addUrl(pathStr: string, lastmodDate: string) {
    const cleanPath = pathStr.replace(/^\/+|\/+$/g, '');
    const fullUrl = cleanPath ? `${siteOrigin}/${cleanPath}/` : `${siteOrigin}/`;

    if (!urlMap.has(fullUrl)) {
      urlMap.set(fullUrl, { loc: escapeXml(fullUrl), lastmod: lastmodDate });
    }
  }

  // ================= মূল স্ট্যাটিক পেজসমূহ (ফাইলের আসল এডিট ডেট) =================
  addUrl('', getRealFileDate('src/pages/index.astro'));
  addUrl('blog', getRealFileDate('src/pages/blog/index.astro'));
  addUrl('about', getRealFileDate('src/pages/about.astro'));
  addUrl('contact', getRealFileDate('src/pages/contact.astro'));
  addUrl('privacy', getRealFileDate('src/pages/privacy.astro'));
  addUrl('disclaimer', getRealFileDate('src/pages/disclaimer.astro'));

  // ================= হোটেল কালেকশন =================
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
          id: filePath.split('/').pop()?.replace(/\.(md|mdx)$/, '')?.toLowerCase(),
          slug: filePath.split('/').pop()?.replace(/\.(md|mdx)$/, '')?.toLowerCase(),
          data: item?.frontmatter || item?.data || {}
        }));
    } catch (e) {}
  }

  hotels.forEach((h: any) => {
    const fileId = String(h.id || h.slug || '').replace(/\.(md|mdx)$/, '');
    const slug = String(h.slug || h.data?.slug || h.id || '').replace(/\.(md|mdx)$/, '').split('/').pop()?.toLowerCase();
    if (slug) {
      const realDate = getContentFileDate('hotels', fileId, h.data?.last_updated || h.data?.updated || h.data?.date);
      addUrl(slug, realDate);
    }
  });

  // ================= ডেস্টিনেশন ও এরিয়া গাইড =================
  let destinations: any[] = [];
  try {
    const destCol = await (getCollection as any)('destinations');
    if (Array.isArray(destCol)) destinations = destCol;
  } catch (e) {}

  if (destinations.length === 0) {
    try {
      const rawGlobDest = import.meta.glob(['/src/content/destinations/*.{md,mdx}', '../../content/destinations/*.{md,mdx}'], { eager: true });
      destinations = Object.entries(rawGlobDest).map(([filePath, item]: [string, any]) => ({
        id: filePath.split('/').pop()?.replace(/\.(md|mdx)$/, '')?.toLowerCase(),
        slug: filePath.split('/').pop()?.replace(/\.(md|mdx)$/, '')?.toLowerCase(),
        data: item?.frontmatter || item?.data || {}
      }));
    } catch (e) {}
  }

  destinations.forEach((d: any) => {
    const fileId = String(d.id || d.slug || '').replace(/\.(md|mdx)$/, '');
    const slug = String(d.slug || d.data?.slug || d.id || '').replace(/\.(md|mdx)$/, '').split('/').pop()?.toLowerCase();
    if (slug) {
      const realDate = getContentFileDate('destinations', fileId, d.data?.last_updated || d.data?.updated);
      addUrl(slug, realDate);
    }
  });

  // ================= ব্লগ পোস্ট =================
  let posts: any[] = [];
  try {
    const postCol = await (getCollection as any)('posts');
    if (Array.isArray(postCol)) posts = postCol;
  } catch (e) {}

  if (posts.length === 0) {
    try {
      const rawGlobPosts = import.meta.glob(['/src/content/posts/*.{md,mdx}', '../../content/posts/*.{md,mdx}'], { eager: true });
      posts = Object.entries(rawGlobPosts).map(([filePath, item]: [string, any]) => ({
        id: filePath.split('/').pop()?.replace(/\.(md|mdx)$/, '')?.toLowerCase(),
        slug: filePath.split('/').pop()?.replace(/\.(md|mdx)$/, '')?.toLowerCase(),
        data: item?.frontmatter || item?.data || {}
      }));
    } catch (e) {}
  }

  posts.forEach((p: any) => {
    const fileId = String(p.id || p.slug || '').replace(/\.(md|mdx)$/, '');
    const slug = String(p.slug || p.data?.slug || p.id || '').replace(/\.(md|mdx)$/, '').split('/').pop()?.toLowerCase();
    if (slug) {
      const realDate = getContentFileDate('posts', fileId, p.data?.date || p.data?.last_updated);
      addUrl(`blog/${slug}`, realDate);
    }
  });

  // ================= সাধারণ কন্টেন্ট পেজ =================
  let pages: any[] = [];
  try {
    const pageCol = await (getCollection as any)('pages');
    if (Array.isArray(pageCol)) pages = pageCol;
  } catch (e) {}

  if (pages.length === 0) {
    try {
      const rawGlobPages = import.meta.glob(['/src/content/pages/*.{md,mdx}', '../../content/pages/*.{md,mdx}'], { eager: true });
      pages = Object.entries(rawGlobPages).map(([filePath, item]: [string, any]) => ({
        id: filePath.split('/').pop()?.replace(/\.(md|mdx)$/, '')?.toLowerCase(),
        slug: filePath.split('/').pop()?.replace(/\.(md|mdx)$/, '')?.toLowerCase(),
        data: item?.frontmatter || item?.data || {}
      }));
    } catch (e) {}
  }

  pages.forEach((pg: any) => {
    const fileId = String(pg.id || pg.slug || '').replace(/\.(md|mdx)$/, '');
    const slug = String(pg.slug || pg.data?.slug || pg.id || '').replace(/\.(md|mdx)$/, '').split('/').pop()?.toLowerCase();
    if (slug && !urlMap.has(`${siteOrigin}/${slug}/`)) {
      const realDate = getContentFileDate('pages', fileId, pg.data?.last_updated || pg.data?.updated);
      addUrl(slug, realDate);
    }
  });

  // XML তৈরি
  const urlsArray = Array.from(urlMap.values());
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsArray
  .map(
    (item) => `  <url>
    <loc>${item.loc}</loc>
    <lastmod>${item.lastmod}</lastmod>
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
