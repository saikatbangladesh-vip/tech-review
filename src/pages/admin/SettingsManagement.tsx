import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth, db } from '../../config/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { ArrowLeft, Save, Globe, Share2, Star, Layout, Search } from 'lucide-react'

interface SiteSettings {
  // General Settings
  siteName: string
  siteDescription: string
  siteTagline: string
  logo: string
  favicon: string
  siteIcon: string
  siteRating: number
  
  // Social Media Links
  facebook: string
  twitter: string
  instagram: string
  youtube: string
  linkedin: string
  pinterest: string
  
  // Display Settings
  featuredPostsLimit: number
  postsPerPage: number
  showAuthor: boolean
  showReadingTime: boolean
  showCategories: boolean
  
  // SEO Settings
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  googleAnalyticsId: string
  googleSiteVerification: string
  
  // Footer Settings
  copyrightText: string
  footerDescription: string
  
  // Rating Section
  ratingTitle: string
  ratingDescription: string
  ratingButtonText: string
  ratingThankYouMessage: string
  ratingReviewCount: string
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'TechReview',
  siteDescription: 'Honest reviews and expert opinions on the latest tech products',
  siteTagline: 'The Best Product For You',
  logo: '',
  favicon: '',
  siteIcon: '',
  siteRating: 4.8,
  facebook: '',
  twitter: '',
  instagram: '',
  youtube: '',
  linkedin: '',
  pinterest: '',
  featuredPostsLimit: 3,
  postsPerPage: 12,
  showAuthor: true,
  showReadingTime: true,
  showCategories: true,
  metaTitle: 'TechReview - Expert Product Reviews & Buying Guides',
  metaDescription: 'Get honest, in-depth reviews of the latest tech products to help you make informed buying decisions.',
  metaKeywords: 'tech reviews, product reviews, buying guides, gadgets',
  googleAnalyticsId: '',
  googleSiteVerification: '',
  copyrightText: '© 2024 TechReview. All rights reserved.',
  footerDescription: 'Your trusted source for honest product reviews and buying guides.',
  ratingTitle: 'Rate Our Site',
  ratingDescription: 'Click to rate your experience',
  ratingButtonText: 'Site Rating',
  ratingThankYouMessage: 'Thank you for rating!',
  ratingReviewCount: 'Based on 50,000+ reviews'
}

export default function SettingsManagement() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS)
  const [activeTab, setActiveTab] = useState<'general' | 'social' | 'display' | 'seo' | 'footer'>('general')
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/dashboard')
      } else {
        setCurrentUser(user)
        loadSettings()
      }
    })
    return () => unsubscribe()
  }, [navigate])

  const loadSettings = async () => {
    try {
      const docRef = doc(db, 'settings', 'siteSettings')
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        console.log('Settings loaded from Firebase:', docSnap.data())
        setSettings({ ...DEFAULT_SETTINGS, ...docSnap.data() } as SiteSettings)
      } else {
        console.log('No settings found in Firebase, using defaults')
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveMessage('')
    
    try {
      console.log('Saving settings:', settings)
      const docRef = doc(db, 'settings', 'siteSettings')
      await setDoc(docRef, settings)
      console.log('Settings saved successfully to Firebase')
      
      setSaveMessage('Settings saved successfully!')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setSaveMessage('Failed to save settings: ' + (error as Error).message)
    } finally {
      setSaving(false)
    }
  }

  if (!currentUser || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#0d1117]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400" />
      </div>
    )
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'social', label: 'Social Media', icon: Share2 },
    { id: 'display', label: 'Display', icon: Layout },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'footer', label: 'Footer', icon: Star },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117]">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white dark:border-[#30363d] dark:bg-[#161b22]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
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
                  Settings Management
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Configure site settings and preferences
                </p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#7c3aed] via-[#6366f1] to-[#3b82f6] px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className="mx-auto max-w-7xl px-4 pt-4">
          <div className={`rounded-lg border p-3 ${
            saveMessage.includes('success')
              ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-900/30 dark:bg-green-900/10 dark:text-green-400'
              : 'border-red-200 bg-red-50 text-red-800 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400'
          }`}>
            <p className="text-sm font-medium">{saveMessage}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-5 gap-6">
          {/* Tabs Sidebar */}
          <div className="col-span-1">
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-[#30363d] dark:bg-[#161b22]">
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-[#6366f1] text-white'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#0d1117]'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Settings Form */}
          <div className="col-span-4">
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-[#30363d] dark:bg-[#161b22]">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">General Settings</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Site Name
                      </label>
                      <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Site Tagline
                      </label>
                      <input
                        type="text"
                        value={settings.siteTagline}
                        onChange={(e) => setSettings({ ...settings, siteTagline: e.target.value })}
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Site Description
                    </label>
                    <textarea
                      value={settings.siteDescription}
                      onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                      rows={3}
                      className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Logo URL
                      </label>
                      <input
                        type="url"
                        value={settings.logo}
                        onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                        placeholder="https://example.com/logo.png"
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Favicon URL
                      </label>
                      <input
                        type="url"
                        value={settings.favicon}
                        onChange={(e) => setSettings({ ...settings, favicon: e.target.value })}
                        placeholder="https://example.com/favicon.ico"
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Site Icon/Emoji
                      </label>
                      <input
                        type="text"
                        value={settings.siteIcon}
                        onChange={(e) => setSettings({ ...settings, siteIcon: e.target.value })}
                        placeholder="✨ 🚀 💎 ⭐"
                        maxLength={2}
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900/30 dark:bg-blue-900/10">
                    <p className="text-xs text-blue-800 dark:text-blue-400">
                      💡 <strong>Site Icon:</strong> Enter an emoji (✨, 🚀, 💎, ⭐) to use as your site icon in the header. This will replace the default Sparkles icon.
                    </p>
                  </div>
                </div>
              )}

              {/* Social Media Settings */}
              {activeTab === 'social' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Social Media Links</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Add your social media profile URLs</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Facebook
                      </label>
                      <input
                        type="url"
                        value={settings.facebook}
                        onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                        placeholder="https://facebook.com/yourpage"
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Twitter
                      </label>
                      <input
                        type="url"
                        value={settings.twitter}
                        onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                        placeholder="https://twitter.com/yourhandle"
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Instagram
                      </label>
                      <input
                        type="url"
                        value={settings.instagram}
                        onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                        placeholder="https://instagram.com/yourhandle"
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        YouTube
                      </label>
                      <input
                        type="url"
                        value={settings.youtube}
                        onChange={(e) => setSettings({ ...settings, youtube: e.target.value })}
                        placeholder="https://youtube.com/@yourchannel"
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        value={settings.linkedin}
                        onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/company/yourcompany"
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Pinterest
                      </label>
                      <input
                        type="url"
                        value={settings.pinterest}
                        onChange={(e) => setSettings({ ...settings, pinterest: e.target.value })}
                        placeholder="https://pinterest.com/yourhandle"
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Display Settings */}
              {activeTab === 'display' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Display Settings</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Control how content is displayed</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Featured Posts Limit (Home)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={settings.featuredPostsLimit}
                        onChange={(e) => setSettings({ ...settings, featuredPostsLimit: parseInt(e.target.value) })}
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Posts Per Page (Reviews)
                      </label>
                      <input
                        type="number"
                        min="6"
                        max="50"
                        value={settings.postsPerPage}
                        onChange={(e) => setSettings({ ...settings, postsPerPage: parseInt(e.target.value) })}
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Show/Hide Elements
                    </label>
                    
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="showAuthor"
                        checked={settings.showAuthor}
                        onChange={(e) => setSettings({ ...settings, showAuthor: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20"
                      />
                      <label htmlFor="showAuthor" className="text-sm text-gray-700 dark:text-gray-300">
                        Show Author Information
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="showReadingTime"
                        checked={settings.showReadingTime}
                        onChange={(e) => setSettings({ ...settings, showReadingTime: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20"
                      />
                      <label htmlFor="showReadingTime" className="text-sm text-gray-700 dark:text-gray-300">
                        Show Reading Time
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="showCategories"
                        checked={settings.showCategories}
                        onChange={(e) => setSettings({ ...settings, showCategories: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20"
                      />
                      <label htmlFor="showCategories" className="text-sm text-gray-700 dark:text-gray-300">
                        Show Categories
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* SEO Settings */}
              {activeTab === 'seo' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">SEO Settings</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Optimize your site for search engines</p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={settings.metaTitle}
                      onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                      className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Recommended: 50-60 characters
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Meta Description
                    </label>
                    <textarea
                      value={settings.metaDescription}
                      onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                      rows={3}
                      className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Recommended: 150-160 characters
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Meta Keywords
                    </label>
                    <input
                      type="text"
                      value={settings.metaKeywords}
                      onChange={(e) => setSettings({ ...settings, metaKeywords: e.target.value })}
                      placeholder="keyword1, keyword2, keyword3"
                      className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Google Analytics ID
                      </label>
                      <input
                        type="text"
                        value={settings.googleAnalyticsId}
                        onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                        placeholder="G-XXXXXXXXXX"
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Google Site Verification
                      </label>
                      <input
                        type="text"
                        value={settings.googleSiteVerification}
                        onChange={(e) => setSettings({ ...settings, googleSiteVerification: e.target.value })}
                        placeholder="Verification code"
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Settings */}
              {activeTab === 'footer' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Footer Settings</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Customize your footer content</p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Copyright Text
                    </label>
                    <input
                      type="text"
                      value={settings.copyrightText}
                      onChange={(e) => setSettings({ ...settings, copyrightText: e.target.value })}
                      className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Footer Description
                    </label>
                    <textarea
                      value={settings.footerDescription}
                      onChange={(e) => setSettings({ ...settings, footerDescription: e.target.value })}
                      rows={3}
                      className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                    />
                  </div>

                  <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-[#30363d] dark:bg-[#0d1117]">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Site Rating Section</h3>
                    
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Rating Value (out of 5)
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={settings.siteRating}
                          onChange={(e) => setSettings({ ...settings, siteRating: parseFloat(e.target.value) || 0 })}
                          className="block w-32 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#161b22] dark:text-white"
                        />
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setSettings({ ...settings, siteRating: star })}
                              className="transition-transform hover:scale-110"
                            >
                              <svg
                                className={`h-6 w-6 ${
                                  star <= Math.floor(settings.siteRating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : star === Math.ceil(settings.siteRating) && settings.siteRating % 1 !== 0
                                    ? 'fill-yellow-400 text-yellow-400 opacity-50'
                                    : 'fill-none text-gray-300 dark:text-gray-600'
                                }`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                            </button>
                          ))}
                          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            {settings.siteRating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Rating Title (Before Rating)
                        </label>
                        <input
                          type="text"
                          value={settings.ratingTitle}
                          onChange={(e) => setSettings({ ...settings, ratingTitle: e.target.value })}
                          placeholder="Rate Our Site"
                          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#161b22] dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Rating Description
                        </label>
                        <input
                          type="text"
                          value={settings.ratingDescription}
                          onChange={(e) => setSettings({ ...settings, ratingDescription: e.target.value })}
                          placeholder="Click to rate your experience"
                          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#161b22] dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Rating Label (After Rating)
                        </label>
                        <input
                          type="text"
                          value={settings.ratingButtonText}
                          onChange={(e) => setSettings({ ...settings, ratingButtonText: e.target.value })}
                          placeholder="Site Rating"
                          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#161b22] dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Thank You Message
                        </label>
                        <input
                          type="text"
                          value={settings.ratingThankYouMessage}
                          onChange={(e) => setSettings({ ...settings, ratingThankYouMessage: e.target.value })}
                          placeholder="Thank you for rating!"
                          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#161b22] dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Review Count Text
                      </label>
                      <input
                        type="text"
                        value={settings.ratingReviewCount}
                        onChange={(e) => setSettings({ ...settings, ratingReviewCount: e.target.value })}
                        placeholder="Based on 50,000+ reviews"
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#161b22] dark:text-white"
                      />
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      💡 These texts will appear in the rating widget in the footer.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
