import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Clock, Calendar, ExternalLink, Check, X } from 'lucide-react'
import type { BlogPost } from '../../types/blog'
import ReactMarkdown from 'react-markdown'
import { getPostBySlug } from '../../services/firestore'
import { trackPostView, trackAffiliateClick } from '../../utils/analytics'

export default function PostDetail() {
  const { slug } = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return
      
      try {
        const foundPost = await getPostBySlug(slug)
        setPost(foundPost)
        
        // Track post view
        if (foundPost?.id && foundPost?.title) {
          trackPostView(foundPost.id, foundPost.title)
        }
      } catch (error) {
        console.error('Failed to load post:', error)
        setPost(null)
      }
    }
    
    loadPost()
  }, [slug])

  if (!post) return <div className="py-20 text-center text-gray-600 dark:text-gray-400">Loading...</div>

  return (
    <article className="bg-white py-16 dark:bg-[#0d1117]">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <header className="mb-10">
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <span className="rounded-md border border-gray-300 bg-gray-50 px-2.5 py-0.5 font-medium text-gray-700 dark:border-[#30363d] dark:bg-[#161b22] dark:text-gray-300">
              {post.category}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readingTime} min read
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString()}
            </span>
          </div>
          <h1 className="mb-4 text-2xl font-extrabold leading-tight text-gray-900 dark:text-white md:text-3xl">{post.title}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">{post.excerpt}</p>
        </header>

        {/* Cover Image */}
        {post.coverImage ? (
          <div className="mb-10 relative h-[850px] overflow-hidden rounded-xl bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#a855f7] shadow-lg">
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const parent = target.parentElement
                if (parent) {
                  const placeholder = document.createElement('div')
                  placeholder.className = 'absolute inset-0 flex items-center justify-center'
                  placeholder.innerHTML = '<div class="text-6xl opacity-50">📱</div>'
                  parent.appendChild(placeholder)
                }
              }}
            />
          </div>
        ) : (
          <div className="mb-10 flex h-[850px] items-center justify-center rounded-xl bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#a855f7]">
            <div className="text-6xl opacity-50">📱</div>
          </div>
        )}

        {/* Affiliate CTA */}
        <div className="my-10 overflow-hidden rounded-lg border border-gray-300 bg-gray-50 p-6 dark:border-[#30363d] dark:bg-[#161b22]">
          <div className="mb-4 text-center">
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{post.productName}</h3>
            {post.productPrice && (
              <p className="text-2xl font-bold text-[#6366f1] dark:text-[#7c3aed]">
                ${post.productPrice}
              </p>
            )}
          </div>
          <a
            href={post.affiliateUrl}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            onClick={() => {
              if (post.id && post.title) {
                trackAffiliateClick(post.id, post.title, post.affiliateUrl)
              }
            }}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-900 transition-colors hover:bg-gray-50 dark:border-[#30363d] dark:bg-[#21262d] dark:text-white dark:hover:bg-[#30363d]"
          >
            Buy on Amazon
            <ExternalLink className="h-4 w-4" />
          </a>
          <p className="mt-3 text-center text-xs text-gray-600 dark:text-gray-400">
            Affiliate Disclaimer: We earn a commission if you make a purchase, at no extra cost to you.
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg mb-10 max-w-none dark:prose-invert">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {/* Specs */}
        {post.specs && (
          <div className="mb-10 rounded-lg border border-gray-300 bg-white p-6 dark:border-[#30363d] dark:bg-[#161b22]">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Technical Specifications</h2>
            <dl className="grid gap-3 md:grid-cols-2">
              {Object.entries(post.specs).map(([key, value]) => (
                <div key={key} className="rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-[#30363d] dark:bg-[#0d1117]">
                  <dt className="text-sm font-semibold text-gray-900 dark:text-white">{key}</dt>
                  <dd className="text-sm text-gray-600 dark:text-gray-400">{String(value)}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Pros & Cons */}
        {(post.pros || post.cons) && (
          <div className="grid gap-6 md:grid-cols-2">
            {post.pros && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-900/30 dark:bg-green-900/10">
                <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-green-700 dark:text-green-400">
                  <Check className="h-5 w-5" />
                  Pros
                </h3>
                <ul className="space-y-2">
                  {post.pros.map((pro: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-green-800 dark:text-green-400/90">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-500" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {post.cons && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/10">
                <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-red-700 dark:text-red-400">
                  <X className="h-5 w-5" />
                  Cons
                </h3>
                <ul className="space-y-2">
                  {post.cons.map((con: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-800 dark:text-red-400/90">
                      <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-500" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
