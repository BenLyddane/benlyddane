import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/Container'
import avatar from '@/images/avatar.jpg'
import copenhagen from '@/images/photos/copenhagen photos/restaurantbarr.JPEG'
import noodles from '@/images/photos/hand_pulled_noodles.jpeg'
import halo from '@/images/photos/IMG_1407.jpg'
import { getAllArticles } from '@/lib/articles'
import { formatDate } from '@/lib/formatDate'

const selectedWriting = [
  {
    slug: 'copenhagen-slow-time',
    title: 'A week in Copenhagen',
    description:
      'A wedding, dinners with my parents, and a few places I’d go back to.',
    image: copenhagen,
    alt: 'Restaurant Barr and the Copenhagen waterfront at dusk',
    topic: 'Travel',
  },
  {
    slug: 'hand-pulled-noodles',
    title: 'Hand-pulled noodles',
    description:
      'Flour, water, salt. A little practice pulling dough. A very good dinner.',
    image: noodles,
    alt: 'Homemade hand-pulled noodles with chili oil',
    topic: 'Cooking',
  },
  {
    slug: 'competitive-halo-journey',
    title: 'Growing up on Halo',
    description:
      'From four TVs in a basement to MLG tournaments, and eventually moving on.',
    image: halo,
    alt: 'A competitive Halo event',
    topic: 'Gaming',
  },
]

export default async function Home() {
  const articles = await getAllArticles()
  const articleDates = new Map(
    articles.map((article) => [article.slug, article.date]),
  )

  return (
    <Container>
      <section className="home-intro" aria-labelledby="intro-title">
        <div className="intro-copy">
          <p className="page-kicker">Mechanical engineer. Software builder.</p>
          <h1 id="intro-title">Hi, I’m Ben.</h1>
          <p className="intro-lead">
            I’m a mechanical and software engineer working on how construction
            teams buy equipment.
          </p>
          <p className="intro-description">
            These days, I’m COO at{' '}
            <a className="text-link" href="https://www.buildvision.io">
              BuildVision
            </a>
            . This is my home for what I’m working on, things I’ve learned, and
            life outside of work.
          </p>
          <div className="intro-links">
            <Link className="solid-link" href="/work">
              More about my work
            </Link>
            <Link className="text-link" href="/about">
              A little about me
            </Link>
          </div>
        </div>
        <figure className="intro-portrait">
          <Image
            src={avatar}
            alt="Ben Lyddane wearing a cap and glasses"
            priority
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 280px, 180px"
          />
          <figcaption>Ben Lyddane · Potomac, MD</figcaption>
        </figure>
      </section>

      <section className="current-work" aria-labelledby="current-work-title">
        <div className="current-work-label">
          <p className="page-kicker">What I’m working on</p>
          <p className="current-company">BuildVision</p>
          <p className="current-role">Chief Operating Officer</p>
        </div>
        <div className="current-work-copy">
          <h2 id="current-work-title">From equipment schedules to software.</h2>
          <p>
            I spent years in HVAC engineering and sales. Now I work on software
            for buying the mechanical, electrical, and plumbing equipment that
            goes into buildings.
          </p>
          <Link href="/work" className="text-link">
            My background and work
          </Link>
        </div>
      </section>

      <section className="home-writing" aria-labelledby="writing-title">
        <div className="section-heading-row">
          <div>
            <p className="page-kicker">Away from the day job</p>
            <h2 id="writing-title" className="section-heading">
              A few things I’ve written.
            </h2>
          </div>
          <Link href="/articles" className="text-link">
            All writing
          </Link>
        </div>
        <div className="story-grid">
          {selectedWriting.map((story) => (
            <article key={story.slug} className="story">
              <Link
                href={`/articles/${story.slug}`}
                className="story-image-link"
                tabIndex={-1}
                aria-hidden="true"
              >
                <Image
                  src={story.image}
                  alt=""
                  sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
                />
              </Link>
              <div className="story-meta">
                <span>{story.topic}</span>
                {articleDates.get(story.slug) && (
                  <time dateTime={articleDates.get(story.slug)}>
                    {formatDate(articleDates.get(story.slug))}
                  </time>
                )}
              </div>
              <h3>
                <Link href={`/articles/${story.slug}`}>{story.title}</Link>
              </h3>
              <p>{story.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-note" aria-labelledby="more-title">
        <h2 id="more-title" className="section-heading">
          There’s more to life than work.
        </h2>
        <div>
          <p>
            I like cooking, lifting weights, playing golf, and finding a good
            game. Some of that ends up here. If we have something in common, I’d
            be glad to hear from you.
          </p>
          <a className="text-link" href="mailto:BenL1291@gmail.com">
            Get in touch
          </a>
        </div>
      </section>
    </Container>
  )
}
