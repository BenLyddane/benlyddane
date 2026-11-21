import { AdminLayout } from '@/components/AdminLayout'

import '@/styles/tailwind.css'

export const metadata = {
  title: 'Personal tools · Ben Lyddane',
  description: 'Ben Lyddane’s personal tools.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="flex w-full">
          <AdminLayout>{children}</AdminLayout>
        </div>
      </body>
    </html>
  )
}
