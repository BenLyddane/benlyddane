import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/Container'
import { WorkHistory } from '@/components/WorkHistory'
import avatar from '@/images/avatar.jpg'

export default function Home() {
  return (
    <Container>
      <section className="home-intro" aria-labelledby="intro-title">
        <div className="intro-copy">
          <p className="page-kicker">Mechanical engineering & software</p>
          <h1 id="intro-title">Ben Lyddane</h1>
          <p className="intro-lead">
            I’m a mechanical and software engineer applying AI to HVAC equipment
            workflows.
          </p>
          <p className="intro-description">
            COO at{' '}
            <a className="text-link" href="https://www.buildvision.io">
              BuildVision
            </a>
            . Based in Potomac, Maryland.
          </p>
          <div className="intro-links">
            <Link className="solid-link" href="/work">
              Work & experience
            </Link>
            <Link className="text-link" href="/about">
              About me
            </Link>
          </div>
          <div className="intro-socials">
            <a href="https://github.com/BenLyddane" className="text-link">
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/benlyddane"
              className="text-link"
            >
              LinkedIn
            </a>
          </div>
        </div>
        <figure className="intro-portrait">
          <Image
            src={avatar}
            alt="Ben Lyddane"
            priority
            sizes="(min-width: 1024px) 280px, (min-width: 640px) 240px, 160px"
          />
        </figure>
      </section>

      <WorkHistory compact />
    </Container>
  )
}
