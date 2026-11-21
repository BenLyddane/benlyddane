import fs from 'fs-extra'
import path from 'path'

const articlesDirectory = path.join(process.cwd(), 'src/app/(home)/articles')

export async function importArticle(articleDirectory) {
  const { article } = await import(
    `../app/(home)/articles/${articleDirectory}/page.mdx`
  )

  return {
    slug: articleDirectory,
    ...article,
  }
}

export async function getAllArticles() {
  const entries = await fs.readdir(articlesDirectory, { withFileTypes: true })
  const articles = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => importArticle(entry.name)),
  )

  return articles.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}
