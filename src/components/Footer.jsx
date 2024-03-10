import Link from 'next/link'

import { ContainerInner, ContainerOuter } from '@/components/Container'

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="transition hover:text-cyan-500 dark:hover:text-cyan-400"
    >
      {children}
    </Link>
  )
}

export function Footer() {
  return (
    <footer className="mt-32 flex-none">
      <ContainerOuter>
        <div className="border-t border-zinc-100 pb-16 pt-10 dark:border-zinc-700/40">
          <ContainerInner>
            <div className="flex flex-col items-center gap-16 sm:flex-row sm:justify-between">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between sm:gap-8">
                <div className="text-center text-sm text-zinc-400 sm:text-right dark:text-zinc-500">
                  <p>BenL1291@gmail.com</p>
                  <p>301-706-1181</p>
                  <p>Chevy Chase, MD</p>
                </div>
                <div className="text-sm text-zinc-400 dark:text-zinc-500">
                  <p>&copy; {new Date().getFullYear()} Ben Lyddane.</p>
                  <p>All rights reserved.</p>
                </div>
              </div>
            </div>
          </ContainerInner>
        </div>
      </ContainerOuter>
    </footer>
  )
}
