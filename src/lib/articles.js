import glob from 'fast-glob'

async function importArticle(articleFilename) {
  let { article } = await import(`../app/(home)/articles/${articleFilename}`)

  return {
    slug: articleFilename.replace(/(\/page)?\.mdx$/, ''),
    ...article,
  }
}

export async function getAllArticles() {
  let articleFilenames = await glob('*/page.mdx', {
    cwd: './src/app/(home)/articles',
  })

  let articles = await Promise.all(articleFilenames.map(importArticle))
  console.log('Articles in function: ', articles)
  return articles.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}
