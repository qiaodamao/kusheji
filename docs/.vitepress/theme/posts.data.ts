// vitepress官方建议的获取文章方法。本身具有缓存机制
import { createContentLoader } from 'vitepress'
import type { Post } from './types'

declare const data: Post[]
export { data }

// 从文章内容中提取所有图片URL
function extractImages(content: string): string[] {
  const images: string[] = []
  // 匹配 Markdown 图片语法 ![alt](url)
  const mdImageRegex = /!\[.*?\]\((.*?)\)/g
  let match
  while ((match = mdImageRegex.exec(content)) !== null) {
    images.push(match[1])
  }
  // 匹配 HTML img 标签 <img src="url">
  const htmlImageRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g
  while ((match = htmlImageRegex.exec(content)) !== null) {
    images.push(match[1])
  }
  return images
}

export default createContentLoader('posts/*/*/*.md', {
  excerpt: true, 
  includeSrc: true, // 包含原始 Markdown 内容
  transform(rawData): Post[] {
    return rawData.map(({ url, frontmatter, excerpt, src }) => {
      frontmatter.readTime = 0
      // 提取文章中的所有图片（使用原始 Markdown 内容）
      const articleContent = src || excerpt || ''
      const images = extractImages(articleContent)
      // 如果有封面图且不在图片列表中，添加到开头
      if (frontmatter.cover && !images.includes(frontmatter.cover)) {
        images.unshift(frontmatter.cover)
      }
      return {
        frontmatter: frontmatter,
        relativePath: url,
        images: images,
      }
    })
      .sort((a, b) => {
        return +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)
      })
  }
})


