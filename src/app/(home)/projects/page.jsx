import { Container } from '@/components/Container'

export const metadata = {
  title: 'Projects',
  description:
    'BuildVision, SpecFrog, and the source for Ben Lyddane’s website.',
}

export default function Projects() {
  return (
    <Container className="portfolio-page">
      <p className="page-kicker">Projects</p>
      <h1 className="page-title">Work & projects</h1>
      <div className="work-list">
        <article className="work-item">
          <p className="work-meta">2024–present · COO</p>
          <div>
            <h2 className="work-title">BuildVision</h2>
            <p className="work-description">
              Applying AI to HVAC equipment workflows.
            </p>
            <a className="text-link" href="https://www.buildvision.io">
              Visit BuildVision
            </a>
          </div>
        </article>
        <article className="work-item">
          <p className="work-meta">2023–2024 · Founder</p>
          <div>
            <h2 className="work-title">SpecFrog</h2>
            <p className="work-description">
              Founded after moving from HVAC engineering and sales into software
              development.
            </p>
          </div>
        </article>
        <article className="work-item">
          <p className="work-meta">Personal website</p>
          <div>
            <h2 className="work-title">This site</h2>
            <p className="work-description">
              Built with Next.js. Source code is available on GitHub.
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
