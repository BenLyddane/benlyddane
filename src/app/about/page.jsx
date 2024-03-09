import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from '@/components/SocialIcons'
import BethesdaRow from '@/images/BethesdaRow.png'
import portfolioCartoon from '@/images/portfoliocartoon.png'

function SocialLink({ className, href, children, icon: Icon }) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-cyan-500 dark:text-zinc-200 dark:hover:text-cyan-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-cyan-500" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  )
}

function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  )
}

export const metadata = {
  title: 'About',
  description: 'I’m Ben Lyddane. I live in Chevy Chase, MD where I create.',
}

export default function About() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs px-2.5 lg:max-w-none">
            <Image
              src={portfolioCartoon}
              alt=""
              sizes="(min-width: 1024px) 32rem, 20rem"
              className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
            />
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            I’m Ben Lyddane. I live in Chevy Chase, MD where I{' '}
            <span className="text-cyan-500">create.</span>
          </h1>
          <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
            {' '}
            <p>
              {' '}
              From a young age, I&apos;ve been driven by a passion for exploring
              diverse disciplines. I grew up with CPA parents, Mary Kay and
              Anthony, who instilled in me a love for learning. I was
              continuously encouraged to pursue my interests. As a kid, I
              immersed myself in the world of competitive gaming, traveling
              across the country to compete in Halo 2 and 3 tournaments.
              Alongside my gaming pursuits, I honed my skills on the high school
              golf team, discovering the unique beauty of individual competition
              and the thrill of personal achievement.{' '}
            </p>{' '}
            <p>
              {' '}
              I studied mechanical engineering at Virginia Tech, where I also
              joined the Phi Gamma Delta fraternity. This experience not only
              provided me with a strong foundation in engineering but also
              taught me the transformative power of social connections and the
              value of true friendship. I learned that the richness of life lies
              in the relationships we forge with others, and that the support
              and camaraderie of our peers can propel us to new heights.{' '}
            </p>{' '}
            <p>
              {' '}
              After graduating, I embarked on a journey to align my passions
              with my career aspirations. Driven by a desire to maximize my
              potential, I searched for the most lucrative opportunities for
              mechanical engineers and found myself on a sales track. Through
              dedication and hard work, I excelled in the Daikin graduate
              engineer training program, emerging as the valedictorian. This
              early success set the stage for a remarkable career trajectory, as
              I consistently achieved top sales performance in each organization
              I&apos;ve worked with.{' '}
            </p>{' '}
            <p>
              {' '}
              Throughout my personal and professional journey, I&apos;ve been
              blessed with the unwavering support and love of my brilliant and
              beautiful wife, Natalie. Her background in art provides a unique
              perspective that complements my own, enriching our lives together.
              Natalie&apos;s presence serves as a constant reminder of what
              truly matters, keeping me focused on the things that bring genuine
              fulfillment and happiness.{' '}
            </p>{' '}
            <p>
              {' '}
              As an avid traveler and lifelong learner, I find joy in exploring
              new places and expanding my knowledge across various domains. My
              love for food, particularly Japanese and Chinese cuisines, adds
              another dimension to my adventures. However, I&apos;ve come to
              recognize the importance of focus and prioritization. Inspired by
              Warren Buffet&apos;s wisdom, I&apos;m committed to streamlining my
              goals, concentrating my efforts on the pursuits that hold the
              greatest potential for personal growth and impact.{' '}
            </p>{' '}
            <p>
              {' '}
              With an insatiable appetite for improvement and an unwavering
              determination to extract the most out of life, I&apos;m always
              eager to learn from others. If you have any insights, advice, or
              experiences that you believe could help me along my journey, I
              would be immensely grateful if you shared them with me.{' '}
            </p>{' '}
            <p>
              {' '}
              Today, as the founder of SpecFrog, I harness my diverse
              experiences and interdisciplinary expertise to create solutions
              that bridge the gap between cutting-edge technology and the
              profound needs of legacy businesses. By leveraging my background
              in mechanical and software engineering, sales, and personal
              development, I am dedicated to shaping a future where the
              intersection of diverse disciplines yields valuable outcomes for
              companies and people.{' '}
            </p>{' '}
          </div>
        </div>
        <div className="lg:pl-20">
          <ul role="list">
            <SocialLink
              href="https://github.com/BenLyddane"
              icon={GitHubIcon}
              className="mt-4"
            >
              GitHub
            </SocialLink>
            <SocialLink
              href="https://www.linkedin.com/in/benlyddane/"
              icon={LinkedInIcon}
              className="mt-4"
            >
              LinkedIn
            </SocialLink>
            <SocialLink
              href="mailto:Ben@specfrog.com"
              icon={MailIcon}
              className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
            >
              Ben@SpecFrog.com (work)
            </SocialLink>
            <SocialLink
              href="mailto:Ben@planetaria.tech"
              icon={MailIcon}
              className="mt-8 border-zinc-100 dark:border-zinc-700/40"
            >
              BenL1291@gmail.com (personal)
            </SocialLink>
          </ul>
        </div>
      </div>
    </Container>
  )
}
