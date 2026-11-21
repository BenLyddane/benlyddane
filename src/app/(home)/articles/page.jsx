import { getAllArticles } from '@/lib/articles'
import ArticlesClient from './ArticlesClient'

export const metadata = {
  title: 'Writing',
  description:
    'Notes by Ben Lyddane on software, construction, cooking, gaming, and travel.',
}

export default async function ArticlesIndex() {
  const articles = await getAllArticles()

  return <ArticlesClient articles={articles} />
}
