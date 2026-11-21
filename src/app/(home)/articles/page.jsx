import { Container } from '@/components/Container'

export const metadata = {
  title: 'Writing',
  description: 'No articles published.',
}

export default function ArticlesIndex() {
  return (
    <Container className="portfolio-page">
      <header>
        <p className="page-kicker">Writing</p>
        <h1 className="page-title">No articles published.</h1>
      </header>
    </Container>
  )
}
