import { NextResponse } from 'next/server';

export const runtime = "edge";

// Define the static routes that should be included in the sitemap
const staticRoutes = [
  '',  // Homepage
  '/auth/login',
  '/auth/sign-up',
  '/faq',
  '/help',
  '/about',
  '/privacy',
  '/terms',
];

// Define protected routes (these will have lower priority and different change frequency)
const protectedRoutes = [
  '/dashboard',
  '/upload',
  '/analyze',
  '/results',
  '/preview',
  '/suggestions',
  '/smart-chat',
  '/profile',
  '/settings',
];

export async function GET() {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';
  
  const currentDate = new Date().toISOString();

  const staticSitemapEntries = staticRoutes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  const protectedSitemapEntries = protectedRoutes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const allEntries = [...staticSitemapEntries, ...protectedSitemapEntries];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200', // 24h cache, 12h stale
    },
  });
} 
 