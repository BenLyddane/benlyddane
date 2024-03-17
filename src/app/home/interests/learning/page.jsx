import InterestLayout from '@/components/InterestLayout'
import { getAllArticles } from '@/lib/articles'
import learningFeatureImage from '@/images/interests/learning.png'

export default async function Learning() {
  const allArticles = await getAllArticles()
  const learningArticles = allArticles.filter((article) =>
    article.tags.includes('learning'),
  )

  const learningResources = [
    {
      href: 'https://www.coursera.org/',
      title: 'Coursera',
    },
    {
      href: 'https://www.edx.org/',
      title: 'edX',
    },
    {
      href: 'https://www.khanacademy.org/',
      title: 'Khan Academy',
    },
  ]

  return (
    <InterestLayout
      title="Learning"
      featureImage={learningFeatureImage}
      articles={learningArticles}
      resources={learningResources}
    />
  )
}
