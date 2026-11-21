'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Container } from '@/components/Container'
import { formatDate } from '@/lib/formatDate'

export default function ArticlesClient({ articles }) {
  const [selectedTopic, setSelectedTopic] = useState('All')
  const topics = [
    'All',
    ...new Set(articles.map((article) => article.tags?.[0]).filter(Boolean)),
  ]
  const visibleArticles =
    selectedTopic === 'All'
      ? articles
      : articles.filter((article) => article.tags?.includes(selectedTopic))

  return (
    <Container className="portfolio-page">
      <header>
        <p className="page-kicker">Writing</p>
        <h1 className="page-title">Things I’ve spent time on.</h1>
        <p className="page-intro">
          Building software, making noodles, playing Halo, and getting out of
          town. Notes from work and the rest of life.
        </p>
      </header>

      <div
        className="topic-filters"
        role="group"
        aria-label="Filter writing by topic"
      >
        {topics.map((topic) => (
          <button
            key={topic}
            type="button"
            className="topic-button"
            aria-pressed={selectedTopic === topic}
            aria-controls="writing-results"
            onClick={() => setSelectedTopic(topic)}
          >
            {topic}
          </button>
        ))}
      </div>
      <p className="sr-only" role="status">
        {visibleArticles.length}{' '}
        {visibleArticles.length === 1 ? 'article' : 'articles'}
        {selectedTopic === 'All' ? '' : ` about ${selectedTopic.toLowerCase()}`}
      </p>

      <div id="writing-results" className="writing-list">
        {visibleArticles.map((article) => (
          <article key={article.slug} className="writing-item">
            <time dateTime={article.date} className="writing-date">
              {formatDate(article.date)}
            </time>
            <div>
              <h2 className="writing-title">
                <Link href={`/articles/${article.slug}`}>{article.title}</Link>
              </h2>
              <p className="writing-description">{article.description}</p>
            </div>
          </article>
        ))}
        {visibleArticles.length === 0 && (
          <p className="writing-description">
            No articles in this topic yet. Choose All to see the archive.
          </p>
        )}
      </div>
    </Container>
  )
}
