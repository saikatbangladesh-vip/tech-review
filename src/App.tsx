import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ScrollToTop from './components/ScrollToTop'
import { ThemeProvider } from './contexts/ThemeContext'

// Public Pages
const Home = lazy(() => import('./pages/public/Home'))
const Blog = lazy(() => import('./pages/public/Blog'))
const PostDetail = lazy(() => import('./pages/public/PostDetail'))
const About = lazy(() => import('./pages/public/About'))
const Contact = lazy(() => import('./pages/public/Contact'))
const Sitemap = lazy(() => import('./pages/public/Sitemap'))

// Legal Pages
const PrivacyPolicy = lazy(() => import('./pages/legal/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/legal/TermsOfService'))
const Disclaimer = lazy(() => import('./pages/legal/Disclaimer'))

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const UserManagement = lazy(() => import('./pages/admin/UserManagement'))
const PostManagement = lazy(() => import('./pages/admin/PostManagement'))
const PageManagement = lazy(() => import('./pages/admin/PageManagement'))
const SettingsManagement = lazy(() => import('./pages/admin/SettingsManagement'))
const AnalyticsDashboard = lazy(() => import('./pages/admin/AnalyticsDashboard'))

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#0d1117] transition-colors duration-300">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#6366f1] border-t-transparent" />
        <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">Loading...</p>
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">404</h1>
      <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Page not found</p>
      <a href="/" className="mt-4 text-primary hover:underline">Go back home</a>
    </div>
  )
}

function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#0d1117] transition-colors duration-300">
      <Header />
      <main className="flex-1 bg-white dark:bg-[#0d1117]">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reviews" element={<Blog />} />
            <Route path="/product/:slug" element={<PostDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/dashboard/users" element={<UserManagement />} />
            <Route path="/dashboard/posts" element={<PostManagement />} />
            <Route path="/dashboard/pages" element={<PageManagement />} />
            <Route path="/dashboard/settings" element={<SettingsManagement />} />
            <Route path="/dashboard/analytics" element={<AnalyticsDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Layout />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
