import Link from 'next/link'
import { Container } from '@/components/Container'
import { createClient } from '@/utils/supabase/server'
import { signout } from '@/app/(home)/auth/actions/actions'

export async function Footer() {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()

  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-top">
          <div>
            <p className="footer-heading">Contact</p>
            <a className="text-link" href="mailto:BenL1291@gmail.com">
              BenL1291@gmail.com
            </a>
          </div>
          <nav aria-label="Elsewhere" className="footer-links">
            <a href="https://github.com/BenLyddane">GitHub</a>
            <a href="https://www.linkedin.com/in/benlyddane">LinkedIn</a>
          </nav>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Ben Lyddane</p>
          <p>Potomac, Maryland</p>
          {data?.user ? (
            <form action={signout}>
              <button type="submit">Sign out</button>
            </form>
          ) : (
            <Link href="/auth/login">Personal tools</Link>
          )}
        </div>
      </Container>
    </footer>
  )
}
