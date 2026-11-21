import Image from 'next/image'
import { Container } from '@/components/Container'
import portrait from '@/images/avatar.jpg'

export const metadata = {
  title: 'About',
  description:
    'Ben Lyddane: mechanical and software engineer, applying AI to HVAC equipment workflows.',
}

export default function About() {
  return (
    <Container className="portfolio-page">
      <div className="about-grid">
        <div>
          <p className="page-kicker">About</p>
          <h1 className="page-title">
            Mechanical engineering.
            <br />
            Software development.
          </h1>
          <p className="page-intro">
            I’m Ben Lyddane, COO at BuildVision. My focus is applying AI to HVAC
            equipment workflows.
          </p>
          <div className="prose-copy">
            <p>
              I studied mechanical engineering at Virginia Tech and worked in
              HVAC applications engineering and sales at Critical Systems,
              Daikin, and Klima NJ.
            </p>
            <p>
              In 2023, I completed Fullstack Academy and founded SpecFrog. I
              joined BuildVision in 2024.
            </p>
            <p>Based in Potomac, Maryland.</p>
          </div>
        </div>
        <aside>
          <Image
            src={portrait}
            alt="Ben Lyddane"
            sizes="(min-width: 1024px) 280px, (min-width: 640px) 200px, 240px"
            className="about-photo"
            priority
          />
          <div className="prose-copy">
            <h2 className="section-heading">Contact</h2>
            <p>
              <a className="text-link" href="mailto:BenL1291@gmail.com">
                BenL1291@gmail.com
              </a>
              <br />
              <a className="text-link" href="mailto:ben@buildvision.io">
                ben@buildvision.io
              </a>
            </p>
            <p>
              <a
                className="text-link"
                href="https://www.linkedin.com/in/benlyddane/"
              >
                LinkedIn
              </a>
              {' · '}
              <a className="text-link" href="https://github.com/BenLyddane">
                GitHub
              </a>
            </p>
          </div>
        </aside>
      </div>
    </Container>
  )
}
