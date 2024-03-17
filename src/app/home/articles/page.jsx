import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import { getAllArticles } from '@/lib/articles'
import { formatDate } from '@/lib/formatDate'
import Link from 'next/link'

function Article({ article }) {
  return (
    <article className="md:grid md:grid-cols-4 md:items-baseline">
      <div className="md:col-span-3">
        <div className="mb-4">
          <Link href={`/articles/${article.slug}`}>
            <h3 className="text-lg font-bold text-zinc-800 hover:text-cyan-500 dark:text-zinc-100">
              {article.title}
            </h3>
          </Link>
          <time
            dateTime={article.date}
            className="text-sm text-zinc-600 md:hidden dark:text-zinc-400"
          >
            {formatDate(article.date)}
          </time>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {article.description}
          </p>
        </div>
        <div className="mt-4 flex flex-wrap">
          {article.tags.map((tag) => (
            <Link
              key={tag}
              href={`/interests/${tag.toLowerCase()}`}
              className="mb-2 mr-2 text-sm text-cyan-500 hover:text-cyan-600"
            >
              #{tag}
            </Link>
          ))}
        </div>
        <div className="mt-6">
          <Link href={`/articles/${article.slug}`}>
            <span className="text-sm font-medium text-cyan-500 hover:text-cyan-600">
              Read article
            </span>
          </Link>
        </div>
      </div>
      <time
        dateTime={article.date}
        className="mt-1 hidden text-sm text-zinc-600 md:block dark:text-zinc-400"
      >
        {formatDate(article.date)}
      </time>
    </article>
  )
}
export const metadata = {
  title: 'Articles',
  description:
    'All of my long-form thoughts on programming, leadership, product design, and more, collected in chronological order.',
}

export default async function ArticlesIndex() {
  let articles = await getAllArticles()

  return (
    <SimpleLayout
      title="Writing on my work and interests."
      intro="Long form thoughts and ideas. "
    >
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <div className="flex max-w-3xl flex-col space-y-16">
          {articles.map((article) => (
            <Article key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </SimpleLayout>
  )
}
