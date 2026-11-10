// src/pages/sitemap-index.xml.ts
// Google Search Central Standard: Git Log + Frontmatter (No Fake Lastmod)
import { execSync } from 'node:child_process';
import path from 'node:path';
import { getCollection } from 'astro:content';

export async function GET() {
  const siteOrigin = 'https://gulshanhotels.com';
  const isProd = import.meta.env.PROD;

  const urlMap = new Map<string, { loc: string; lastmod: string | null }>();

  // XML নিরাপদ টেক্সট এস্কেপার
  function escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  // ১. তারিখ পার্সার (YYYY-MM-DD ফরম্যাট)
  function parseToIso(d: any): string | null {
    if (!d) return null;
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? null : parsed.toISOString().split('T')[0];
  }

  // ২. গিট রিপোজিটরি থেকে ফাইলের আসল কমিট তারিখ বের করা
  function getGitCommitDate(relPath: string): string | null {
    try {
      const output = execSync(`git log -1 --format=%cs -- "${relPath}"`, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'ignore'],
      }).trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(output)) {
        return output;
      }
    } catch (e) {}
    return null;
  }

  // ৩. সত্য ও যাচাইকৃত তারিখ নির্ধারণ (গুগল স্প্যাম পলিসি সুরক্ষিত)
  function resolveAccurateDate(relPath: string, frontmatterDate?: any): string | null {
    // ক. ফ্রন্টম্যাটারের তারিখ (সবচেয়ে নির্ভরযোগ্য)
    const fmDate = parseToIso(frontmatterDate);
    if (fmDate) return fmDate;

    // খ. গিট কমিটের তারিখ (আসল এডিট হিস্ট্রি)
    const gitDate = getGitCommitDate(relPath);
    if (gitDate) return gitDate;

    // গ. কোনো আসল তারিখ না থাকলে null ফেরত দেবে (গুগল নির্দেশিকা: কোনো ফেক তারিখ বসানো যাবে না)
    return null;
  }

  function addUrl(pathStr: string, lastmodDate: string | null) {
    const cleanPath = pathStr.replace(/^\/+|\/+$/g, '');
    const fullUrl = cleanPath ? `${siteOrigin}/${cleanPath}/` : `${siteOrigin}/`;

    if (!urlMap.has(fullUrl)) {
      urlMap.set(fullUrl, { loc: escapeXml(fullUrl), lastmod: lastmodDate });
    }
  }

  // ================= স্ট্যাটিক পেজসমূহ (গিট কমিট ডেট থেকে নেবে) =================
  addUrl('', getGitCommitDate('src/pages/index.astro'));
  addUrl('blog', getGitCommitDate('src/pages/blog/index.astro'));
  addUrl('about', getGitCommitDate('src/pages/about.astro'));
  addUrl('contact', getGitCommitDate('src/pages/contact.astro'));
  addUrl('privacy', getGitCommitDate('src/pages/privacy.astro'));
  addUrl('disclaimer', getGitCommitDate('src/pages/disclaimer.astro'));

  // ================= হোটেল কালেকশন (ড্রাফট ফিল্টারসহ) =================
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
      const accurateDate = resolveAccurateDate(`src/content/hotels/${fileId}.md`, h.data?.last_updated || h.data?.updated || h.data?.date);
      addUrl(slug, accurateDate);
    }
  });

  // ================= ডেস্টিনেশন গাইড =================
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
      const accurateDate = resolveAccurateDate(`src/content/destinations/${fileId}.md`, d.data?.last_updated || d.data?.updated);
      addUrl(slug, accurateDate);
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
      const accurateDate = resolveAccurateDate(`src/content/posts/${fileId}.md`, p.data?.date || p.data?.last_updated);
      addUrl(`blog/${slug}`, accurateDate);
    }
  });

  // ================= XML জেনারেটর (গুগল ফরম্যাট: তারিখ থাকলে lastmod থাকবে, না থাকলে বাদ যাবে) =================
  const urlsArray = Array.from(urlMap.values());
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsArray
  .map((item) => {
    if (item.lastmod) {
      return `  <url>\n    <loc>${item.loc}</loc>\n    <lastmod>${item.lastmod}</lastmod>\n  </url>`;
    }
    return `  <url>\n    <loc>${item.loc}</loc>\n  </url>`;
  })
  .join('\n')}
</urlset>`.trim();

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
