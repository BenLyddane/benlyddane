'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { Container } from '@/components/Container'

const navigation = [
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
]

export function Header() {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const dark = mounted && resolvedTheme === 'dark'

  return (
    <header className="site-header">
      <Container>
        <div className="header-inner">
          <Link href="/" className="site-name" aria-label="Ben Lyddane, home">
            Ben Lyddane<span aria-hidden="true">.</span>
          </Link>
          <nav aria-label="Main navigation" className="site-nav">
            {navigation.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={
                  pathname === href || pathname.startsWith(href + '/')
                    ? 'page'
                    : undefined
                }
              >
                {label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            className="theme-toggle"
            aria-label={
              mounted
                ? `Switch to ${dark ? 'light' : 'dark'} theme`
                : 'Toggle color theme'
            }
            onClick={() => setTheme(dark ? 'light' : 'dark')}
          >
            {dark ? (
              <Sun size={19} aria-hidden="true" />
            ) : (
              <Moon size={19} aria-hidden="true" />
            )}
          </button>
        </div>
      </Container>
    </header>
  )
}
