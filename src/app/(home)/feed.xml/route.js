import { Feed } from 'feed'

export const dynamic = 'force-dynamic'

export async function GET() {
  const siteUrl = process.env.PRODUCTION_URL || 'https://benlyddane.vercel.app'
  const feed = new Feed({
    title: 'Ben Lyddane',
    description: 'No articles published.',
    id: siteUrl,
    link: siteUrl,
    copyright: `All rights reserved ${new Date().getFullYear()} Ben Lyddane.`,
    feedLinks: {
      rss2: `${siteUrl}/feed.xml`,
    },
  })

  return new Response(feed.rss2(), {
    status: 200,
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}
