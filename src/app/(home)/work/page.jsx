import { Container } from '@/components/Container'
import { WorkHistory } from '@/components/WorkHistory'

export const metadata = {
  title: 'Work',
  description:
    'Ben Lyddane’s work history in mechanical engineering, HVAC equipment, and software. COO at BuildVision, applying AI to HVAC equipment workflows.',
}

export default function Work() {
  return (
    <Container className="portfolio-page">
      <p className="page-kicker">Work</p>
      <h1 className="page-title">Engineering & software.</h1>
      <p className="page-intro">
        Mechanical engineering, HVAC equipment, and software. I’m COO at
        BuildVision, applying AI to HVAC equipment workflows.
      </p>
      <p className="mt-5">
        <a className="text-link" href="https://www.buildvision.io">
          BuildVision
        </a>
      </p>
      <div className="mt-10 max-w-3xl">
        <WorkHistory />
      </div>
    </Container>
  )
}
