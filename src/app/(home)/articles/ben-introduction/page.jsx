import { redirect } from 'next/navigation'

export default function UnpublishedArticle() {
  redirect('/articles')
}
