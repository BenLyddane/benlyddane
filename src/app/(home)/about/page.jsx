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
import phiGamLogo from '@/images/logos/Phi_Gamma_Delta_Crest.png'
import vtLogo from '@/images/logos/vtlogo.png'

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
  description: "I'm Ben Lyddane. I live in Potomac, MD where I create.",
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
            I'm Ben Lyddane. I live in Potomac, MD where I{' '}
            <span className="text-cyan-500">create.</span>
          </h1>
          <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
            <p>
              I grew up in Bethesda with my parents Mary Kay and Anthony, who encouraged
              me to pursue my interests. As a kid, I competed in Halo 2 and 3 tournaments
              across the country and played on my high school golf team.
            </p>
            <p>
              I studied mechanical engineering at Virginia Tech, where I joined Phi Gamma Delta.
              College taught me that strong relationships and friendships are essential—the people
              around you can push you to achieve more than you thought possible.
            </p>
            <p>
              After graduation, I looked for the best opportunities in mechanical engineering and
              ended up in sales. I graduated as valedictorian from Daikin&apos;s graduate engineer
              training program and consistently achieved top sales performance at each company I
              worked for.
            </p>
            <p>
              My wife Natalie, who has a background in art, brings a different perspective that
              complements my engineering mindset. She keeps me grounded and focused on what matters.
            </p>
            <p>
              I love traveling, learning new things, and great food (especially Japanese and Chinese).
              I&apos;ve learned to focus my energy on pursuits with the most potential for growth and
              impact, inspired by Warren Buffett&apos;s approach to prioritization.
            </p>
            <p>
              I&apos;m always looking to learn from others. If you have insights or experiences that
              could help me improve, I&apos;d appreciate hearing them.
            </p>
            <p>
              As of June 2024, I serve as the COO at BuildVision.IO, where I apply my experience in
              mechanical and software engineering, sales, and product development to connect MEP
              equipment purchasers with suppliers, making equipment procurement as easy as buying
              anything else online.
            </p>
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
              href="mailto:ben@buildvision.io"
              icon={MailIcon}
              className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
            >
              ben@buildvision.io (work)
            </SocialLink>
            <SocialLink
              href="mailto:Ben@planetaria.tech"
              icon={MailIcon}
              className="mt-8 border-zinc-100 dark:border-zinc-700/40"
            >
              BenL1291@gmail.com (personal)
            </SocialLink>
          </ul>
          <div className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Education
            </h3>
            <div className="flex gap-6">
              <div className="relative flex items-center justify-center w-12 h-12 rounded-full shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
                <Image src={vtLogo} alt="Virginia Tech" className="w-8 h-8" />
              </div>
              <div className="relative flex items-center justify-center w-12 h-12 rounded-full shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
                <Image src={phiGamLogo} alt="Phi Gamma Delta" className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
