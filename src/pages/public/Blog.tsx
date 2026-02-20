import { Link, useSearchParams } from 'react-router-dom'
import { Clock, Search, ArrowRight, SlidersHorizontal } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { BlogPost } from '../../types/blog'
import { getAllPosts } from '../../services/firestore'
import { AMAZON_CATEGORIES } from '../../constants/categories'
import { db } from '../../config/firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function Blog() {
  const [searchParams] = useSearchParams()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<string>('all')
  const [customMinPrice, setCustomMinPrice] = useState<string>('')
  const [customMaxPrice, setCustomMaxPrice] = useState<string>('')
  const [pageContent, setPageContent] = useState({
    pageTitle: 'All Reviews',
    pageDescription: 'Browse our complete collection of product reviews'
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load page content
        const docRef = doc(db, 'settings', 'pageContents')
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data['reviews']?.content) {
            try {
              const reviewsContent = JSON.parse(data['reviews'].content)
              setPageContent({
                pageTitle: reviewsContent.pageTitle || 'All Reviews',
                pageDescription: reviewsContent.pageDescription || 'Browse our complete collection of product reviews'
              })
            } catch (e) {
              console.error('Error parsing reviews content:', e)
            }
          }
        }

        // Load posts
        const postsData = await getAllPosts()
        setPosts(postsData)
      } catch (error) {
        console.error('Failed to load data:', error)
      }
    }
    
    loadData()
  }, [])

  // Read category from URL parameter
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam && AMAZON_CATEGORIES.includes(categoryParam as any)) {
      setSelectedCategory(categoryParam)
    }
  }, [searchParams])

  const filtered = posts.filter(p => {
    // Search filter
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase())
    
    // Category filter
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory
    
    // Price filter
    let matchesPrice = true
    if (p.productPrice) {
      const price = p.productPrice
      
      // Custom price range takes priority
      if (priceRange === 'custom' && (customMinPrice || customMaxPrice)) {
        const min = customMinPrice ? parseFloat(customMinPrice) : 0
        const max = customMaxPrice ? parseFloat(customMaxPrice) : Infinity
        matchesPrice = price >= min && price <= max
      } else if (priceRange !== 'all') {
        switch (priceRange) {
          case 'under-50':
            matchesPrice = price < 50
            break
          case '50-100':
            matchesPrice = price >= 50 && price <= 100
            break
          case '100-200':
            matchesPrice = price >= 100 && price <= 200
            break
          case '200-500':
            matchesPrice = price >= 200 && price <= 500
            break
          case 'over-500':
            matchesPrice = price > 500
            break
        }
      }
    }
    
    return matchesSearch && matchesCategory && matchesPrice
  })

  return (
    <div className="min-h-screen bg-white py-16 dark:bg-[#0d1117]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <h1 className="mb-3 text-5xl font-bold text-gray-900 dark:text-white">
            {pageContent.pageTitle}
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400">{pageContent.pageDescription}</p>
        </div>
        
        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search for products, brands, categories..."
              className="w-full rounded-lg border border-gray-300 bg-white px-11 py-3 text-sm transition-colors focus:border-[#6366f1] focus:outline-none focus:ring-1 focus:ring-[#6366f1] dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white dark:placeholder-gray-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category and Price Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
            </div>
            
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm transition-colors focus:border-[#6366f1] focus:outline-none focus:ring-1 focus:ring-[#6366f1] dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
            >
              <option value="all">All Categories</option>
              {AMAZON_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Price Filter */}
            <select
              value={priceRange}
              onChange={(e) => {
                setPriceRange(e.target.value)
                if (e.target.value !== 'custom') {
                  setCustomMinPrice('')
                  setCustomMaxPrice('')
                }
              }}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm transition-colors focus:border-[#6366f1] focus:outline-none focus:ring-1 focus:ring-[#6366f1] dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
            >
              <option value="all">All Prices</option>
              <option value="under-50">Under $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100-200">$100 - $200</option>
              <option value="200-500">$200 - $500</option>
              <option value="over-500">Over $500</option>
              <option value="custom">Custom Range</option>
            </select>

            {/* Custom Price Inputs */}
            {priceRange === 'custom' && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min $"
                  value={customMinPrice}
                  onChange={(e) => setCustomMinPrice(e.target.value)}
                  className="w-24 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm transition-colors focus:border-[#6366f1] focus:outline-none focus:ring-1 focus:ring-[#6366f1] dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                  min="0"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">to</span>
                <input
                  type="number"
                  placeholder="Max $"
                  value={customMaxPrice}
                  onChange={(e) => setCustomMaxPrice(e.target.value)}
                  className="w-24 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm transition-colors focus:border-[#6366f1] focus:outline-none focus:ring-1 focus:ring-[#6366f1] dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                  min="0"
                />
              </div>
            )}

            {/* Results Count */}
            <span className="ml-auto text-sm text-gray-600 dark:text-gray-400">
              {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
            </span>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map(post => (
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
      </div>
    </div>
  )
}
