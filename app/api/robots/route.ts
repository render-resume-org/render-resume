import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';

  const robots = `User-agent: *
Allow: /
Allow: /login
Allow: /sign-up
Allow: /faq
Allow: /privacy
Allow: /terms

# Disallow private/protected areas
Disallow: /api/
Disallow: /dashboard
Disallow: /upload
Disallow: /analyze
Disallow: /results
Disallow: /download
Disallow: /smart-chat
Disallow: /profile
Disallow: /settings
Disallow: /temp/
Disallow: /_next/
Disallow: /node_modules/

# Allow AI agents and crawlers to access public content
User-agent: GPTBot
Allow: /
Allow: /faq

User-agent: ChatGPT-User
Allow: /
Allow: /faq

User-agent: CCBot
Allow: /
Allow: /faq

User-agent: Claude-Web
Allow: /
Allow: /faq

User-agent: anthropic-ai
Allow: /
Allow: /faq

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay for politeness
Crawl-delay: 1`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400', // 24h cache
    },
  });
} 
 