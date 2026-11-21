import Link from 'next/link'
import { Container } from '@/components/Container'
import { Prose } from '@/components/Prose'
import { formatDate } from '@/lib/formatDate'

export function ArticleLayout({ article, children }) {
  return (
    <Container className="portfolio-page article-page">
      <div className="mx-auto max-w-[45rem]">
        <Link href="/articles" className="text-link">
          All writing
        </Link>
        <article>
          <header className="article-header">
            <p className="page-kicker">
              <time dateTime={article.date}>{formatDate(article.date)}</time>
            </p>
            <h1 className="page-title">{article.title}</h1>
            {article.tags?.length > 0 && (
              <p className="writing-date">{article.tags.join(' · ')}</p>
            )}
          </header>
          <Prose className="article-body mt-10 max-w-none" data-mdx-content>
            {children}
          </Prose>
        </article>
      </div>
    </Container>
  )
}
