import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, MousePointerClick, Users, TrendingUp, Calendar } from 'lucide-react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../../config/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { getTotalPageViews, getTotalAffiliateClicks, getTopPosts, getRecentActivity } from '../../services/analyticsService'

interface AnalyticsData {
  totalPageViews: number
  totalAffiliateClicks: number
  totalPosts: number
  totalUsers: number
  topPosts: Array<{ title: string; views: number; clicks: number }>
  recentActivity: Array<{ type: string; description: string; timestamp: Date }>
}

export default function AnalyticsDashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalPageViews: 0,
    totalAffiliateClicks: 0,
    totalPosts: 0,
    totalUsers: 0,
    topPosts: [],
    recentActivity: []
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/dashboard')
      } else {
        await loadAnalytics()
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [navigate])

  const loadAnalytics = async () => {
    try {
      // Load basic counts and real analytics data in parallel
      const [
        postsSnapshot,
        usersSnapshot,
        pageViews,
        affiliateClicks,
        topPostsData,
        recentActivityData
      ] = await Promise.all([
        getDocs(collection(db, 'posts')),
        getDocs(collection(db, 'users')),
        getTotalPageViews(),
        getTotalAffiliateClicks(),
        getTopPosts(5),
        getRecentActivity(10)
      ])

      setAnalytics({
        totalPageViews: pageViews,
        totalAffiliateClicks: affiliateClicks,
        totalPosts: postsSnapshot.size,
        totalUsers: usersSnapshot.size,
        topPosts: topPostsData,
        recentActivity: recentActivityData
      })
    } catch (error) {
      console.error('Error loading analytics:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#0d1117]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117]">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white dark:border-[#30363d] dark:bg-[#161b22]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Analytics Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Real-time insights and statistics
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-[#30363d] dark:bg-[#161b22]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Page Views</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{analytics.totalPageViews}</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-500/10">
                <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600">+12.5%</span>
              <span className="text-gray-500 dark:text-gray-400">vs last month</span>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-[#30363d] dark:bg-[#161b22]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Affiliate Clicks</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{analytics.totalAffiliateClicks}</p>
              </div>
              <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-500/10">
                <MousePointerClick className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600">+8.2%</span>
              <span className="text-gray-500 dark:text-gray-400">vs last month</span>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-[#30363d] dark:bg-[#161b22]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Posts</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{analytics.totalPosts}</p>
              </div>
              <div className="rounded-lg bg-green-50 p-3 dark:bg-green-500/10">
                <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-[#30363d] dark:bg-[#161b22]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{analytics.totalUsers}</p>
              </div>
              <div className="rounded-lg bg-orange-50 p-3 dark:bg-orange-500/10">
                <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Top Posts */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-[#30363d] dark:bg-[#161b22]">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Top Performing Posts</h2>
          <div className="space-y-3">
            {analytics.topPosts.map((post, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-[#30363d]">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">{post.title}</h3>
                  <div className="mt-1 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {post.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <MousePointerClick className="h-4 w-4" />
                      {post.clicks} clicks
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {post.views > 0 ? ((post.clicks / post.views) * 100).toFixed(1) : '0.0'}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">CTR</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-[#30363d] dark:bg-[#161b22]">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
          <div className="space-y-3">
            {analytics.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 rounded-lg border border-gray-200 p-4 dark:border-[#30363d]">
                <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-500/10">
                  {activity.type === 'page_view' ? (
                    <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <MousePointerClick className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{activity.description}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
