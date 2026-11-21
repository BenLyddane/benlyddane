import Link from 'next/link'
import { Container } from '@/components/Container'

export const metadata = {
  title: 'Work',
  description:
    'Ben Lyddane’s work at BuildVision and background in HVAC equipment, sales engineering, and software development.',
}

const experience = [
  { company: 'SpecFrog', role: 'Founder', dates: '2023–2024' },
  { company: 'Klima NJ', role: 'Sales Engineer', dates: '2021–2023' },
  {
    company: 'Critical Systems',
    role: 'Engineer Design Executive',
    dates: '2018–2021',
  },
  { company: 'Daikin', role: 'Field Sales Engineer', dates: '2016–2018' },
  {
    company: 'Critical Systems',
    role: 'Applications Engineer',
    dates: '2014–2016',
  },
  { company: 'NIST', role: 'Intern', dates: '2008–2011' },
]

export default function Work() {
  return (
    <Container className="portfolio-page">
      <p className="page-kicker">Work</p>
      <h1 className="page-title">From equipment to software.</h1>
      <p className="page-intro">
        My background is in mechanical engineering and HVAC equipment sales.
        Today, I bring that experience to BuildVision as COO.
      </p>

      <section aria-labelledby="buildvision-heading" className="work-list">
        <article className="work-item">
          <p className="work-meta">2024–present · COO</p>
          <div>
            <h2 id="buildvision-heading" className="work-title">
              BuildVision
            </h2>
            <p className="work-description">
              We connect buyers and suppliers of mechanical, electrical, and
              plumbing equipment. The goal is to make equipment procurement
              easier for the people getting construction projects built.
            </p>
            <p className="work-description">
              This work draws on my experience in equipment sales and
              engineering, and in building software.
            </p>
            <a className="text-link" href="https://www.buildvision.io">
              Visit BuildVision
            </a>
          </div>
        </article>
      </section>

      <section aria-labelledby="experience-heading">
        <h2 id="experience-heading" className="section-heading">
          Before BuildVision
        </h2>
        <ol className="work-list">
          {experience.map((item) => (
            <li className="work-item" key={`${item.company}-${item.dates}`}>
              <p className="work-meta">{item.dates}</p>
              <div>
                <h3 className="work-title">{item.company}</h3>
                <p className="work-description">{item.role}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="education-heading">
        <h2 id="education-heading" className="section-heading">
          Education
        </h2>
        <ul className="work-list">
          <li className="work-item">
            <p className="work-meta">2023</p>
            <div>
              <h3 className="work-title">Fullstack Academy</h3>
              <p className="work-description">Software development</p>
            </div>
          </li>
          <li className="work-item">
            <p className="work-meta">2010–2014</p>
            <div>
              <h3 className="work-title">Virginia Tech</h3>
              <p className="work-description">Mechanical engineering</p>
            </div>
          </li>
        </ul>
      </section>

      <p className="prose-copy">
        For more of what I’ve built, see my{' '}
        <Link className="text-link" href="/projects">
          projects
        </Link>
        .
      </p>
    </Container>
  )
}
