import { getAllArticles } from '@/lib/articles'
import ArticlesClient from './ArticlesClient'

export const metadata = {
  title: 'Articles',
  description:
    'All of my long-form thoughts on programming, leadership, product design, and more, collected in chronological order.',
}

export default async function ArticlesIndex() {
  const articles = await getAllArticles()
  
  return <ArticlesClient articles={articles} />
}
