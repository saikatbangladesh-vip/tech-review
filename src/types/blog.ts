export interface BlogPost {
  id?: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  date: string
  author: {
    name: string
    avatar?: string
  }
  tags: string[]
  category: string
  readingTime: number
  productName: string
  productPrice?: number
  affiliateUrl: string
  pros?: string[]
  cons?: string[]
  specs?: Record<string, string>
  featured?: boolean
}

export interface PostMeta {
  slug: string
  title: string
  excerpt: string
  coverImage: string
  date: string
  tags: string[]
  category: string
  readingTime: number
  featured?: boolean
}
