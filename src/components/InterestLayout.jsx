import { Card } from '@/components/Card'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/formatDate'

function Article({ article }) {
  return (
    <Card as="article" className="max-w-2xl">
      <Card.Title href={`/articles/${article.slug}`}>
        {article.title}
      </Card.Title>
      <Card.Eyebrow as="time" dateTime={article.date} decorate>
        {formatDate(article.date)}
      </Card.Eyebrow>
      <Card.Description>{article.description}</Card.Description>
      <div className="mt-4 flex flex-wrap">
        {article.tags.map((tag) => (
          <Link
            key={tag}
            href={`/interests/${tag.toLowerCase()}`}
            className="mr-2 text-sm text-cyan-500 hover:text-cyan-600"
          >
            #{tag}
          </Link>
        ))}
      </div>
      <Card.Cta>Read article</Card.Cta>
    </Card>
  )
}

function Resource({ resource }) {
  return (
    <Card as="div" className="max-w-sm">
      <Card.Title
        href={resource.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {resource.title}
      </Card.Title>
      <Card.Description>{resource.description}</Card.Description>
      <Card.Cta>Visit resource</Card.Cta>
    </Card>
  )
}

const InterestLayout = ({ title, featureImage, resources, articles }) => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="my-8">
        <h1 className="p-4 text-4xl font-bold text-neutral-800 dark:text-cyan-500">
          {title}
        </h1>
      </div>
      <div className="mb-8 flex justify-center">
        <Image
          src={featureImage}
          alt={`${title} Feature Image`}
          width={400}
          height={400}
          className="rounded-lg"
        />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <h2 className="p-4 text-2xl font-bold text-neutral-800 dark:text-cyan-500">
            Articles
          </h2>
          <div className="space-y-8 p-8">
            {articles &&
              articles.map((article) => (
                <Article key={article.slug} article={article} />
              ))}
          </div>
        </div>
        <div>
          <h2 className="p-4 text-2xl font-bold text-neutral-800 dark:text-cyan-500">
            Resources
          </h2>
          <div className="space-y-8">
            {resources.map((resource) => (
              <Resource key={resource.href} resource={resource} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InterestLayout
