import { Users, FileText, Layout, Settings, Lock, Mail, Eye, EyeOff, LogOut, BarChart3 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth, db } from '../../config/firebase'
import { collection, getDocs } from 'firebase/firestore'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [userCount, setUserCount] = useState(0)
  const [postCount, setPostCount] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [settingsCount, setSettingsCount] = useState(0)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        // Load counts
        try {
          const [usersSnapshot, postsSnapshot, pagesSnapshot, settingsSnapshot] = await Promise.all([
            getDocs(collection(db, 'users')),
            getDocs(collection(db, 'posts')),
            getDocs(collection(db, 'pages')),
            getDocs(collection(db, 'settings'))
          ])
          setUserCount(usersSnapshot.size)
          setPostCount(postsSnapshot.size)
          setPageCount(pagesSnapshot.size)
          setSettingsCount(settingsSnapshot.size)
        } catch (error) {
          console.error('Error loading counts:', error)
        }
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoginLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#0d1117]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-[#0d1117]">
        <div className="w-full max-w-md">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
            <div className="absolute right-1/4 bottom-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />
          </div>

          <div className="relative rounded-xl border border-gray-200 bg-white p-8 shadow-lg dark:border-[#30363d] dark:bg-[#161b22]">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex rounded-lg bg-gradient-to-br from-[#7c3aed] via-[#6366f1] to-[#3b82f6] p-3">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Admin Login
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sign in to access the dashboard
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white dark:placeholder-gray-500 dark:focus:border-[#7c3aed]"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-12 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white dark:placeholder-gray-500 dark:focus:border-[#7c3aed]"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 transition-colors hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full rounded-lg bg-gradient-to-r from-[#7c3aed] via-[#6366f1] to-[#3b82f6] px-4 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-[#6366f1]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Logging in...
                  </span>
                ) : (
                  'Login to Dashboard'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Dashboard access for authorized users only
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
  const menuItems = [
    {
      title: 'User Management',
      description: 'Manage all users and their permissions',
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      bgLight: 'bg-blue-50',
      bgDark: 'dark:bg-blue-500/10',
      path: '/dashboard/users'
    },
    {
      title: 'Post Management',
      description: 'Create, edit, and manage posts',
      icon: FileText,
      color: 'from-purple-500 to-pink-600',
      bgLight: 'bg-purple-50',
      bgDark: 'dark:bg-purple-500/10',
      path: '/dashboard/posts'
    },
    {
      title: 'Page Management',
      description: 'Manage website pages and content',
      icon: Layout,
      color: 'from-green-500 to-emerald-600',
      bgLight: 'bg-green-50',
      bgDark: 'dark:bg-green-500/10',
      path: '/dashboard/pages'
    },
    {
      title: 'Settings Management',
      description: 'Configure site settings and preferences',
      icon: Settings,
      color: 'from-orange-500 to-red-600',
      bgLight: 'bg-orange-50',
      bgDark: 'dark:bg-orange-500/10',
      path: '/dashboard/settings'
    },
    {
      title: 'Analytics Dashboard',
      description: 'View real-time analytics and insights',
      icon: BarChart3,
      color: 'from-cyan-500 to-blue-600',
      bgLight: 'bg-cyan-50',
      bgDark: 'dark:bg-cyan-500/10',
      path: '/dashboard/analytics'
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117]">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white dark:border-[#30363d] dark:bg-[#161b22]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Welcome, {user?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 via-white to-gray-50 p-8 dark:border-[#30363d] dark:from-[#161b22] dark:via-[#0d1117] dark:to-[#161b22]">
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl" />
            <div className="relative">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome to Dashboard
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Select a management section below to get started
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 text-left transition-all duration-300 hover:shadow-lg hover:scale-105 dark:border-[#30363d] dark:bg-[#161b22] dark:hover:border-[#484f58]"
              >
                {/* Background Gradient */}
                <div className={`absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-to-br ${item.color} opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-20`} />
                
                {/* Icon Container */}
                <div className={`mb-4 inline-flex rounded-lg ${item.bgLight} ${item.bgDark} p-3 transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>

                {/* Content */}
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>

                {/* Arrow Indicator */}
                <div className="flex items-center text-xs font-medium text-gray-500 transition-colors group-hover:text-gray-700 dark:text-gray-500 dark:group-hover:text-gray-300">
                  <span>Open</span>
                  <svg
                    className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            )
          })}
        </div>

        {/* Stats Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-[#30363d] dark:bg-[#161b22]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{userCount}</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-500/10">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-[#30363d] dark:bg-[#161b22]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Posts</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{postCount}</p>
              </div>
              <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-500/10">
                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-[#30363d] dark:bg-[#161b22]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Pages</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{pageCount}</p>
              </div>
              <div className="rounded-lg bg-green-50 p-3 dark:bg-green-500/10">
                <Layout className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-[#30363d] dark:bg-[#161b22]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Settings</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{settingsCount}</p>
              </div>
              <div className="rounded-lg bg-orange-50 p-3 dark:bg-orange-500/10">
                <Settings className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
