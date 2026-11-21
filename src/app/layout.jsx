import { Providers } from '@/app/providers'
import '@/styles/tailwind.css'
import '@/styles/portfolio.css'
import { Toaster } from '@/components/ui/toaster'

export const metadata = {
  title: {
    template: '%s · Ben Lyddane',
    default: 'Ben Lyddane · Engineering, software & life outside work',
  },
  description:
    'Mechanical and software engineer, COO at BuildVision, and based in Potomac, Maryland. Work, writing, and a few things I’m learning along the way.',
  alternates: {
    types: {
      'application/rss+xml': `${process.env.PRODUCTION_URL || 'https://benlyddane.vercel.app'}/feed.xml`,
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex min-h-full bg-zinc-50 font-sans dark:bg-black">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}
