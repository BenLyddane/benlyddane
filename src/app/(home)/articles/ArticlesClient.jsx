'use client'

import { useState } from 'react'
import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import { formatDate } from '@/lib/formatDate'

function Article({ article }) {
  return (
    <article className="md:grid md:grid-cols-4 md:items-baseline">
      <Card className="md:col-span-3">
        <Card.Title href={`/articles/${article.slug}`}>
          {article.title}
        </Card.Title>
        <Card.Eyebrow
          as="time"
          dateTime={article.date}
          className="md:hidden"
          decorate
        >
          {formatDate(article.date)}
        </Card.Eyebrow>
        <Card.Description>{article.description}</Card.Description>
        <Card.Cta>Read article</Card.Cta>
      </Card>
      <Card.Eyebrow
        as="time"
        dateTime={article.date}
        className="hidden mt-1 md:block"
      >
        {formatDate(article.date)}
      </Card.Eyebrow>
    </article>
  )
}

export default function ArticlesClient({ articles }) {
  const [selectedTag, setSelectedTag] = useState('All')
  
  // Get all unique tags
  const allTags = ['All', ...new Set(articles.flatMap(article => article.tags || []))]
  
  // Filter articles based on selected tag
  const filteredArticles = selectedTag === 'All' 
    ? articles 
    : articles.filter(article => article.tags?.includes(selectedTag))

  return (
    <SimpleLayout
      title="Writing on my work and interests."
      intro="Long form thoughts and ideas."
    >
      <div className="mb-8 flex items-center gap-3">
        <label htmlFor="tag-filter" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Filter by:
        </label>
        <select
          id="tag-filter"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:border-cyan-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        >
          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>
      
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <div className="flex flex-col max-w-3xl space-y-16">
          {filteredArticles.map((article) => (
            <Article key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </SimpleLayout>
  )
}
