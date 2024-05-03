import { AdminLayout } from '@/components/AdminLayout'

import '@/styles/tailwind.css'

export const metadata = {
  title: {
    template: '%s - Ben Lyddane',
    default:
      'Ben Lyddane - Founder, Mechanical Engineer, Software Engineer, Reader, Writer, Musician, Video Game Enthusiast, Chess Player, Weight Lifter, Optimizer, and more',
  },
  description:
    'I’m Ben, a software designer and entrepreneur based in New York City. I’m the founder and CEO of Planetaria, where we develop technologies that empower regular people to explore space on their own terms.',
  alternates: {
    types: {
      'application/rss+xml': `${process.env.PRODUCTION_URL}/feed.xml`,
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en"  suppressHydrationWarning>
      <body >
        <div className="flex w-full">
          <AdminLayout>{children}</AdminLayout>
        </div>
      </body>
    </html>
  )
}
