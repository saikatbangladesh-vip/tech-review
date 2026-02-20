import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { BlogPost } from '../../types/blog'
import { getFeaturedPosts } from '../../services/firestore'
import { db } from '../../config/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { trackPageView } from '../../utils/analytics'

export default function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [pageContent, setPageContent] = useState({
    heroTitle: 'The Best Product For You',
    heroSubtitle: 'TechReview',
    heroDescription: 'We created this platform for everyone who spends hours researching before buying online. Here, you’ll discover the best products, best prices, and honest reviews, all in one place. We don’t sell anything; we simply research and recommend so you can shop smarter and confidently.',
    badgeText: 'Trusted by 50,000+ Familys'
  })

  useEffect(() => {
    // Track page view
    trackPageView('/', 'Home')
    
    const loadData = async () => {
      try {
        // Load page content
        const pageDocRef = doc(db, 'settings', 'pageContents')
        const pageDocSnap = await getDoc(pageDocRef)
        
        if (pageDocSnap.exists()) {
          const data = pageDocSnap.data()
          if (data['home']?.content) {
            try {
              const homeContent = JSON.parse(data['home'].content)
              setPageContent({
                heroTitle: homeContent.heroTitle || 'The Best Product For You',
                heroSubtitle: homeContent.heroSubtitle || 'TechReview',
                heroDescription: homeContent.heroDescription || 'Discover honest, in-depth reviews of the latest tech products to help you make the perfect purchase.',
                badgeText: homeContent.badgeText || 'Trusted by 50,000+ Familys'
              })
            } catch (e) {
              console.error('Error parsing home content:', e)
            }
          }
        }

        // Load site settings for featured posts limit
        const settingsDocRef = doc(db, 'settings', 'siteSettings')
        const settingsDocSnap = await getDoc(settingsDocRef)
        let limit = 3
        
        if (settingsDocSnap.exists()) {
          const settings = settingsDocSnap.data()
          limit = settings.featuredPostsLimit || 3
          console.log('Featured posts limit from settings:', limit)
        }
        
        const featuredPosts = await getFeaturedPosts(limit)
        console.log('Featured posts loaded:', featuredPosts)
        setPosts(featuredPosts)
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  return (
    <div className="bg-white dark:bg-[#0d1117]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 py-32 dark:from-[#0d1117] dark:via-[#161b22] dark:to-[#0d1117]">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-3xl" />
        </div>
        
        <div className="container relative mx-auto px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
            <Sparkles className="h-4 w-4" />
            {pageContent.badgeText}
          </div>
          <h1 className="mb-6 text-6xl font-bold leading-tight tracking-tight text-gray-900 md:text-7xl dark:text-white">
            {pageContent.heroTitle}
            <br />
            <span className="bg-gradient-to-r from-[#7c3aed] via-[#6366f1] to-[#3b82f6] bg-clip-text text-transparent">
              {pageContent.heroSubtitle}
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            {pageContent.heroDescription}
          </p>
          <Link
            to="/reviews"
            className="group inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-900 transition-all hover:bg-gray-50 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          >
            Explore Reviews
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              Featured Reviews
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400">Hand-picked reviews from our editors</p>
          </div>
          
          {loading ? (
            <div className="py-12 text-center text-gray-600 dark:text-gray-400">
              Loading featured reviews...
            </div>
          ) : posts.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No featured reviews yet. Check out all reviews!
              </p>
              <Link
                to="/reviews"
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
              >
                View All Reviews
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {posts.map(post => (
              <Link key={post.slug} to={`/product/${post.slug}`} className="group">
                <article className="relative overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-[#30363d] dark:bg-[#161b22] dark:hover:border-[#484f58]">
                  {/* Square Image Container */}
                  <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#a855f7]">
                    {post.coverImage ? (
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
                            placeholder.innerHTML = '<div class="text-4xl opacity-70">📱</div>'
                            parent.appendChild(placeholder)
                          }
                        }}
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-4xl opacity-70">📱</div>
                        </div>
                      </>
                    )}
                    {/* Category Badge */}
                    <div className="absolute right-2 top-2 rounded-md border border-white/20 bg-black/20 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                      {post.category}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-3">
                    <div className="mb-1.5 flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400">
                      <Clock className="h-2.5 w-2.5" />
                      <span>{post.readingTime} min</span>
                    </div>
                    <h3 className="mb-1.5 text-sm font-semibold leading-tight line-clamp-2 text-gray-900 transition-colors group-hover:text-[#6366f1] dark:text-white dark:group-hover:text-[#7c3aed]">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2 dark:text-gray-400">{post.excerpt}</p>
                    <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-gray-600 dark:text-gray-400">
                      Read Review
                      <ArrowRight className="h-2.5 w-2.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
