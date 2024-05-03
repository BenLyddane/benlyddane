import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Container } from '@/components/Container'

import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from '@/components/SocialIcons'
import logoKlima from '@/images/logos/klima.jpg'
import NIST from '@/images/logos/NIST.png'
import logoCritical from '@/images/logos/cs.jpg'
import logoDaikin from '@/images/logos/Daikin.png'
import logoFullstack from '@/images/logos/fullstackLogo.jpg'
import logoSpecFrog from '@/images/logos/FrogLogoPic.png'
import vtlogo from '@/images/logos/vtlogo.png'
import image1 from '@/images/photos/image-1.png'
import image2 from '@/images/photos/image-2.png'
import image3 from '@/images/photos/image-3.png'
import image4 from '@/images/photos/image-4.png'
import image5 from '@/images/photos/image-5.png'
import { getAllArticles } from '@/lib/articles'
import { formatDate } from '@/lib/formatDate'
import Newsletter from '@/components/newsletter'
function BriefcaseIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M2.75 9.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
        className="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
      />
      <path
        d="M3 14.25h6.249c.484 0 .952-.002 1.316.319l.777.682a.996.996 0 0 0 1.316 0l.777-.682c.364-.32.832-.319 1.316-.319H21M8.75 6.5V4.75a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2V6.5"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
    </svg>
  )
}

function ArrowDownIcon(props) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4.75 8.75 8 12.25m0 0 3.25-3.5M8 12.25v-8.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Article({ article }) {
  return (
    <Card as="article" className="max-w-2xl">
      <Card.Title href={`/articles/${article.slug}`}>
        {article.title}
      </Card.Title>
      <Card.Eyebrow as="time" dateTime={article.date} decorate>
        {formatDate(article.date)}
      </Card.Eyebrow>
      <Card.Description>{article.description}</Card.Description>
      <div className="flex flex-wrap mt-4">
        {article.tags.map((tag) => (
          <Link
            key={tag}
            href={`/interests/${tag.toLowerCase()}`}
            className="mr-2 text-sm text-cyan-500 hover:text-cyan-600"
          >
            #{tag}
          </Link>
        ))}
      </div>
      <Card.Cta>Read article</Card.Cta>
    </Card>
  )
}

function SocialLink({ icon: Icon, ...props }) {
  return (
    <Link className="p-1 -m-1 group" {...props}>
      <Icon className="w-6 h-6 transition fill-zinc-500 group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300" />
    </Link>
  )
}

function Role({ role }) {
  let startLabel =
    typeof role.start === 'string' ? role.start : role.start.label
  let startDate =
    typeof role.start === 'string' ? role.start : role.start.dateTime

  let endLabel = typeof role.end === 'string' ? role.end : role.end.label
  let endDate = typeof role.end === 'string' ? role.end : role.end.dateTime

  return (
    <li className="flex gap-4">
      <div className="relative flex items-center justify-center flex-none w-10 h-10 mt-1 rounded-full shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
        <Image src={role.logo} alt="" className="h-7 w-7" unoptimized />
      </div>
      <dl className="flex flex-wrap flex-auto gap-x-2">
        <dt className="sr-only">Company</dt>
        <dd className="flex-none w-full text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {role.company}
        </dd>
        <dt className="sr-only">Role</dt>
        <dd className="text-xs text-zinc-500 dark:text-zinc-400">
          {role.title}
        </dd>
        <dt className="sr-only">Date</dt>
        <dd
          className="ml-auto text-xs text-zinc-400 dark:text-zinc-500"
          aria-label={`${startLabel} until ${endLabel}`}
        >
          <time dateTime={startDate}>{startLabel}</time>{' '}
          <span aria-hidden="true">—</span>{' '}
          <time dateTime={endDate}>{endLabel}</time>
        </dd>
      </dl>
    </li>
  )
}

function Resume() {
  let resume = [
    {
      company: 'SpecFrog',
      title: 'CEO',
      logo: logoSpecFrog,
      start: '2023',
      end: {
        label: 'Present',
        dateTime: new Date().getFullYear().toString(),
      },
    },
    {
      company: 'Fullstack Academy',
      title: 'Student - 104.5%',
      logo: logoFullstack,
      start: '2023',
      end: '2023',
    },
    {
      company: 'Klima NJ',
      title: 'Sales Engineer',
      logo: logoKlima,
      start: '2021',
      end: '2023',
    },
    {
      company: 'Critical Systems',
      title: 'Engineer Design Executive',
      logo: logoCritical,
      start: '2018',
      end: '2021',
    },
    {
      company: 'Daikin',
      title: 'Field Sales Engineer - GET Valedictorian',
      logo: logoDaikin,
      start: '2016',
      end: '2018',
    },
    {
      company: 'Critical Systems',
      title: 'Applications Engineer',
      logo: logoCritical,
      start: '2014',
      end: '2016',
    },
    {
      company: 'Virginia Tech',
      title: 'Mechanical Engineering',
      logo: vtlogo,
      start: '2010',
      end: '2014',
    },
    {
      company: 'NIST',
      title: 'Intern',
      logo: NIST,
      start: '2008',
      end: '2011',
    },
  ]

  return (
    <div className="p-6 border rounded-2xl border-zinc-100 dark:border-zinc-700/40">
      <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <BriefcaseIcon className="flex-none w-6 h-6" />
        <span className="ml-3">Work and Education</span>
      </h2>
      <ol className="mt-6 space-y-4">
        {resume.map((role, roleIndex) => (
          <Role key={roleIndex} role={role} />
        ))}
      </ol>
    </div>
  )
}

function Photos() {
  let rotations = ['rotate-2', '-rotate-2', 'rotate-2', 'rotate-2', '-rotate-2']

  return (
    <div className="mt-16 sm:mt-20">
      <div className="flex justify-center gap-5 py-4 -my-4 overflow-hidden sm:gap-8">
        {[image1, image2, image3, image4, image5].map((image, imageIndex) => (
          <div
            key={image.src}
            className={clsx(
              'relative aspect-[9/10] w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 sm:w-72 sm:rounded-2xl dark:bg-zinc-800',
              rotations[imageIndex % rotations.length],
            )}
          >
            <Image
              src={image}
              alt=""
              sizes="(min-width: 640px) 18rem, 11rem"
              className="absolute inset-0 object-cover w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function Home() {
  let articles = (await getAllArticles()).slice(0, 4)

  return (
    <>
      <Container className="mt-9">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            Founder, Engineer, Creator, and Lifelong{' '}
            <span className="text-cyan-500">Learner</span>
          </h1>
          <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
            I&apos;m Ben Lyddane, a mechanical and software engineer, and the
            founder of SpecFrog. My enthusiasm lies in integrating diverse
            disciplines, from music production and golf to weightlifting and
            extensive reading. My literary interests span non-fiction, business,
            psychology, with a selective engagement in fiction. Additionally, I
            explore the realms of podcasting and comedy, enriching my
            professional journey with varied experiences.
          </p>
          <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
            Originating from Bethesda, my recent return marks the culmination of
            exploration along the east coast. These experiences have not only
            broadened my perspective but also reinforced my belief in
            interdisciplinary approaches. This philosophy shapes my aspirations,
            driving both personal growth and professional excellence.
          </p>

          <div className="flex gap-6 mt-6">
            <SocialLink
              href="https://github.com/BenLyddane/"
              aria-label="Follow on GitHub"
              icon={GitHubIcon}
            />
            <SocialLink
              href="https://linkedin.com/in/benlyddane"
              aria-label="Follow on LinkedIn"
              icon={LinkedInIcon}
            />
          </div>
        </div>
      </Container>
      <Photos />
      <Container className="mt-24 md:mt-28">
        <div className="grid max-w-xl grid-cols-1 mx-auto gap-y-20 lg:max-w-none lg:grid-cols-2">
          <div className="flex flex-col gap-16">
            {articles.map((article) => (
              <Article key={article.slug} article={article} />
            ))}
          </div>
          <div className="space-y-10 lg:pl-16 xl:pl-24">
            <Newsletter />
            <Resume />
          </div>
        </div>
      </Container>
    </>
  )
}
