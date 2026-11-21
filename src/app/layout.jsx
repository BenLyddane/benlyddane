import { Providers } from '@/app/providers'
import '@/styles/tailwind.css'
import '@/styles/portfolio.css'
import { Toaster } from '@/components/ui/toaster'

export const metadata = {
  title: {
    template: '%s · Ben Lyddane',
    default: 'Ben Lyddane · Mechanical engineering & software',
  },
  description:
    'Mechanical and software engineer applying AI to HVAC equipment workflows. COO at BuildVision, based in Potomac, Maryland.',
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
