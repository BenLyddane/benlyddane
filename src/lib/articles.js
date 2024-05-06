import fs from 'fs-extra'
import path from 'path'
import matter from 'gray-matter'

const articlesDirectory = path.join(process.cwd(), 'src/app/(home)/articles')

export async function importArticle(articleDirectory) {
  const articlePath = path.join(articlesDirectory, articleDirectory, 'page.mdx')
  const source = await fs.readFile(articlePath, 'utf-8')
  console.log(source)

  // Extract the exported JavaScript object from the source
  const { article } = await import(`../app/(home)/articles/${articleDirectory}/page.mdx`)
  console.log('article', article)

  return {
    slug: articleDirectory,
    ...article,
  }
}

export async function getAllArticles() {
  const articleDirectories = await fs.readdir(articlesDirectory)
  console.log(articleDirectories)

  const articles = await Promise.all(
    articleDirectories
      .filter((directory) => !directory.endsWith('.jsx'))
      .map(importArticle)
  )

  console.log('Articles in function: ', articles)
  return articles.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}