import Link from 'next/link'
import { Container } from '@/components/Container'

export const metadata = {
  title: 'Projects',
  description:
    'BuildVision, Pascend, and this website: a few things Ben Lyddane has worked on.',
}

export default function Projects() {
  return (
    <Container className="portfolio-page">
      <p className="page-kicker">Projects</p>
      <h1 className="page-title">A few things I’ve worked on.</h1>
      <p className="page-intro">
        My day-to-day work is at BuildVision. I also build web apps and use this
        site to write down what I learn along the way.
      </p>

      <div className="work-list">
        <article className="work-item">
          <p className="work-meta">Construction · COO</p>
          <div>
            <h2 className="work-title">BuildVision</h2>
            <p className="work-description">
              Connecting buyers and suppliers of mechanical, electrical, and
              plumbing equipment. I joined as COO in 2024 after working in HVAC
              sales and engineering.
            </p>
            <a className="text-link" href="https://www.buildvision.io">
              Visit BuildVision
            </a>
          </div>
        </article>
        <article className="work-item">
          <p className="work-meta">Web development</p>
          <div>
            <h2 className="work-title">Pascend</h2>
            <p className="work-description">
              A web app I built with Next.js, Supabase, and AI coding tools. I
              wrote about the stack and how I used it to build the application.
            </p>
            <Link className="text-link" href="/articles/ai-coding-stack">
              Read the development notes
            </Link>
            {' · '}
            <a className="text-link" href="https://pascend.com">
              Visit Pascend
            </a>
          </div>
        </article>
        <article className="work-item">
          <p className="work-meta">Personal website</p>
          <div>
            <h2 className="work-title">This site</h2>
            <p className="work-description">
              A home for my writing on engineering, building products, and
              everything else that catches my attention. Built with Next.js and
              MDX, with the source on GitHub.
            </p>
            <a
              className="text-link"
              href="https://github.com/BenLyddane/benlyddane"
            >
              View the source
            </a>
          </div>
        </article>
      </div>
    </Container>
  )
}
