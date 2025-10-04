import Link from 'next/link'
import { ContainerInner, ContainerOuter } from '@/components/Container'
import { createClient } from '@/utils/supabase/server'
import { signout } from '@/app/(home)/auth/actions/actions'
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

export async function Footer() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()

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
                  <p>Potomac, MD</p>
                </div>
                <div className="text-sm text-zinc-400 dark:text-zinc-500">
                  <p>&copy; {new Date().getFullYear()} Ben Lyddane.</p>
                  <p>All rights reserved.</p>
                </div>
              </div>
              {error || !data?.user ? (
                <NavLink href="/auth/login">
                  <button className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2">
                    Login
                  </button>
                </NavLink>
              ) : (
                <form>
                  <button
                    formAction={signout}
                    type="submit"
                    className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                  >
                    Sign Out
                  </button>
                </form>
              )}
            </div>
          </ContainerInner>
        </div>
      </ContainerOuter>
    </footer>
  )
}
