import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/Container'
import portrait from '@/images/avatar.jpg'

export const metadata = {
  title: 'About',
  description:
    'A little about Ben Lyddane: mechanical engineering, software, BuildVision, and life in Potomac, Maryland.',
}

export default function About() {
  return (
    <Container className="portfolio-page">
      <div className="about-grid">
        <div>
          <p className="page-kicker">About</p>
          <h1 className="page-title">Hi, I’m Ben.</h1>
          <p className="page-intro">
            I’m a mechanical engineer who found his way into sales, software,
            and building a business. I live in Potomac, Maryland.
          </p>
          <div className="prose-copy">
            <p>
              I grew up in Bethesda and studied mechanical engineering at
              Virginia Tech. After college, I worked in HVAC equipment sales and
              engineering at Critical Systems, Daikin, and Klima NJ. Working
              with equipment buyers gave me a close look at how construction
              projects come together.
            </p>
            <p>
              In 2023, I studied software development at Fullstack Academy and
              founded SpecFrog. I joined BuildVision as COO in 2024. We connect
              buyers and suppliers of mechanical, electrical, and plumbing
              equipment.
            </p>
            <p>
              Outside work, I like golf, cooking, and traveling with my wife,
              Natalie. I also spent a lot of my teenage years playing Halo 2 and
              3 and traveling to MLG tournaments. I wrote about{' '}
              <Link
                className="text-link"
                href="/articles/competitive-halo-journey"
              >
                what that was like
              </Link>
              .
            </p>
            <p>
              This site is where I keep notes on what I’m building and learning,
              whether that’s software,{' '}
              <Link className="text-link" href="/articles/hand-pulled-noodles">
                hand-pulled noodles
              </Link>
              , or{' '}
              <Link className="text-link" href="/articles/copenhagen-slow-time">
                a week in Denmark
              </Link>
              .
            </p>
          </div>
        </div>
        <aside>
          <Image
            src={portrait}
            alt="Ben Lyddane"
            sizes="(min-width: 1024px) 22rem, (min-width: 640px) 50vw, 100vw"
            className="about-photo"
            priority
          />
          <div className="prose-copy">
            <h2 className="section-heading">Get in touch</h2>
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
