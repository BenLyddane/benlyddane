import Image from 'next/image'
import { Briefcase, GraduationCap } from 'lucide-react'
import logoBuildVision from '@/images/logos/BuildVision-Logo.jpeg'
import logoSpecFrog from '@/images/logos/FrogLogoPic.png'
import logoKlima from '@/images/logos/klima.jpg'
import logoCritical from '@/images/logos/cs.jpg'
import logoDaikin from '@/images/logos/Daikin.png'
import logoNist from '@/images/logos/NIST.png'
import logoFullstack from '@/images/logos/fullstackLogo.jpg'
import logoVirginiaTech from '@/images/logos/vtlogo.png'

const experience = [
  {
    company: 'BuildVision',
    role: 'COO',
    logo: logoBuildVision,
    start: '2024',
    end: null,
  },
  {
    company: 'SpecFrog',
    role: 'Founder',
    logo: logoSpecFrog,
    start: '2023',
    end: '2024',
  },
  {
    company: 'Klima NJ',
    role: 'Sales Engineer',
    logo: logoKlima,
    start: '2021',
    end: '2023',
  },
  {
    company: 'Critical Systems',
    role: 'Engineer Design Executive',
    logo: logoCritical,
    start: '2018',
    end: '2021',
  },
  {
    company: 'Daikin',
    role: 'Field Sales Engineer',
    logo: logoDaikin,
    start: '2016',
    end: '2018',
  },
  {
    company: 'Critical Systems',
    role: 'Applications Engineer',
    logo: logoCritical,
    start: '2014',
    end: '2016',
  },
  {
    company: 'NIST',
    role: 'Intern',
    logo: logoNist,
    start: '2008',
    end: '2011',
  },
]

const education = [
  {
    company: 'Fullstack Academy',
    role: 'Software development',
    logo: logoFullstack,
    start: '2023',
    end: '2023',
  },
  {
    company: 'Virginia Tech',
    role: 'Mechanical engineering',
    logo: logoVirginiaTech,
    start: '2010',
    end: '2014',
  },
]

function HistoryItem({ item }) {
  return (
    <li className="flex items-start gap-4">
      <div className="mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-full border border-zinc-200 bg-white p-1.5 dark:border-zinc-700">
        <Image
          src={item.logo}
          alt=""
          className="h-7 w-7 object-contain"
          sizes="28px"
        />
      </div>
      <dl className="flex min-w-0 flex-auto flex-wrap gap-x-3 gap-y-0.5 text-sm leading-6">
        <dt className="sr-only">Organization</dt>
        <dd className="w-full font-medium text-zinc-900 dark:text-zinc-100">
          {item.company}
        </dd>
        <dt className="sr-only">Role or study</dt>
        <dd className="text-zinc-600 dark:text-zinc-400">{item.role}</dd>
        <dt className="sr-only">Dates</dt>
        <dd className="ml-auto whitespace-nowrap text-zinc-500 dark:text-zinc-400">
          <time dateTime={item.start}>{item.start}</time>
          {item.end !== item.start && (
            <>
              <span aria-hidden="true">–</span>
              <span className="sr-only"> to </span>
              {item.end ? (
                <time dateTime={item.end}>{item.end}</time>
              ) : (
                <span>present</span>
              )}
            </>
          )}
        </dd>
      </dl>
    </li>
  )
}

export function WorkHistory({ compact = false }) {
  return (
    <section
      aria-label="Work history and education"
      className={`rounded-2xl border border-zinc-200 bg-white font-sans dark:border-zinc-700/60 dark:bg-zinc-900 ${compact ? 'p-5 sm:p-6' : 'p-6 sm:p-8'}`}
    >
      <h2 className="flex items-center gap-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">
        <Briefcase
          className="h-5 w-5 text-cyan-600 dark:text-cyan-400"
          aria-hidden="true"
        />
        Work history
      </h2>
      <ol
        className={`mt-6 ${compact ? 'grid gap-x-10 gap-y-6 md:grid-cols-2' : 'space-y-6'}`}
      >
        {experience.map((item) => (
          <HistoryItem key={`${item.company}-${item.start}`} item={item} />
        ))}
      </ol>
      <div className="mt-7 border-t border-zinc-100 pt-6 dark:border-zinc-700/60">
        <h3 className="flex items-center gap-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">
          <GraduationCap
            className="h-5 w-5 text-cyan-600 dark:text-cyan-400"
            aria-hidden="true"
          />
          Education
        </h3>
        <ol
          className={`mt-6 ${compact ? 'grid gap-x-10 gap-y-6 md:grid-cols-2' : 'space-y-6'}`}
        >
          {education.map((item) => (
            <HistoryItem key={item.company} item={item} />
          ))}
        </ol>
      </div>
    </section>
  )
}
