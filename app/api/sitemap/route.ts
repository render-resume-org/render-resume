import { NextResponse } from 'next/server';

const defaultUrl = "https://render-resume.com"

// Static pages that should be included in the sitemap
const staticPages = [
  {
    url: '',
    lastModified: new Date('2025-06-26'),
    changeFrequency: 'daily' as const,
    priority: 1.0,
  },
  {
    url: '/auth/sign-up',
    lastModified: new Date('2025-06-26'),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  },
  {
    url: '/auth/login',
    lastModified: new Date('2025-06-26'),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  },
  {
    url: '/faq',
    lastModified: new Date('2025-06-26'),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  },
  {
    url: '/about',
    lastModified: new Date('2025-06-26'),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  },
  {
    url: '/privacy',
    lastModified: new Date('2025-06-26'),
    changeFrequency: 'monthly' as const,
    priority: 0.4,
  },
  {
    url: '/terms',
    lastModified: new Date('2025-06-26'),
    changeFrequency: 'monthly' as const,
    priority: 0.4,
  },
];

function generateSitemapXML(pages: typeof staticPages): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetClose = '</urlset>';

  const urls = pages.map(page => {
    return `
    <url>
      <loc>${defaultUrl}${page.url}</loc>
      <lastmod>${page.lastModified.toISOString()}</lastmod>
      <changefreq>${page.changeFrequency}</changefreq>
      <priority>${page.priority}</priority>
    </url>`;
  }).join('');

  return `${xmlHeader}
${urlsetOpen}${urls}
${urlsetClose}`;
}

export async function GET() {
  try {
    // In a real application, you might want to fetch dynamic content here
    // For example, blog posts, user-generated content, etc.
    const allPages = [...staticPages];

    const sitemapXML = generateSitemapXML(allPages);

    return new NextResponse(sitemapXML, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 
 