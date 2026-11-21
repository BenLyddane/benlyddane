import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export function Layout({ children }) {
  return (
    <div className="personal-site relative flex min-h-screen w-full flex-col">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-auto">
        {children}
      </main>
      <Footer />
    </div>
  )
}
