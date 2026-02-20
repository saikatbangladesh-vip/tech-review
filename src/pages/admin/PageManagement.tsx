import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth, db } from '../../config/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { ArrowLeft, Save, FileText } from 'lucide-react'

interface PageContent {
  id: string
  title: string
  content: string
  lastUpdated: string
}

const EDITABLE_PAGES = [
  { 
    id: 'home', 
    title: 'Home', 
    defaultContent: JSON.stringify({
      heroTitle: 'The Best Product For You',
      heroSubtitle: 'TechReview',
      heroDescription: 'We created this platform for everyone who spends hours researching before buying online. Here, you’ll discover the best products, best prices, and honest reviews, all in one place. We don’t sell anything; we simply research and recommend so you can shop smarter and confidently.',
      badgeText: 'Trusted by 50,000+ Familys'
    }, null, 2),
    isJson: true
  },
  { 
    id: 'reviews', 
    title: 'All Reviews',
    defaultContent: JSON.stringify({
      pageTitle: 'Product Reviews',
      pageDescription: 'Expert reviews and honest opinions on the latest products'
    }, null, 2),
    isJson: true
  },
  { 
    id: 'about', 
    title: 'About Us', 
    defaultContent: `<h1>About TechReview</h1>
<p>Welcome to TechReview, your trusted source for honest, in-depth product reviews. We're passionate about technology and helping you make informed buying decisions.</p>
<p>Our team of experienced reviewers thoroughly tests each product before writing a review. We don't just regurgitate specs – we use products in real-world scenarios to give you practical insights.</p>
<h2>Our Promise</h2>
<ul>
<li>Honest, unbiased reviews based on real testing</li>
<li>Clear pros and cons for every product</li>
<li>Transparent affiliate disclosure</li>
<li>Regular updates as products evolve</li>
</ul>`,
    isHtml: true
  },
  { 
    id: 'contact', 
    title: 'Contact',
    defaultContent: JSON.stringify({
      pageTitle: 'Contact Us',
      pageDescription: "Have questions or suggestions? We'd love to hear from you!"
    }, null, 2),
    isJson: true
  },
  { 
    id: 'sitemap', 
    title: 'Sitemap',
    defaultContent: `<h1>Sitemap</h1>
<p>Navigate through all pages on our website</p>

<h2>Main Pages</h2>
<ul>
<li><a href="/">Home</a></li>
<li><a href="/reviews">All Reviews</a></li>
<li><a href="/about">About Us</a></li>
<li><a href="/contact">Contact</a></li>
</ul>

<h2>Legal Pages</h2>
<ul>
<li><a href="/privacy-policy">Privacy Policy</a></li>
<li><a href="/terms-of-service">Terms of Service</a></li>
<li><a href="/disclaimer">Disclaimer</a></li>
</ul>

<h2>Admin</h2>
<ul>
<li><a href="/dashboard">Admin Dashboard</a></li>
</ul>`,
    isHtml: true
  },
  { 
    id: 'privacy-policy', 
    title: 'Privacy Policy',
    defaultContent: `<h1>Privacy Policy</h1>
<p>Last updated: ${new Date().toLocaleDateString()}</p>
<h2>Information We Collect</h2>
<p>We collect information that you provide directly to us when you use our services.</p>
<h2>How We Use Your Information</h2>
<p>We use the information we collect to provide, maintain, and improve our services.</p>
<h2>Contact Us</h2>
<p>If you have any questions about this Privacy Policy, please contact us.</p>`,
    isHtml: true
  },
  { 
    id: 'terms-of-service', 
    title: 'Terms of Service',
    defaultContent: `<h1>Terms of Service</h1>
<p>Last updated: ${new Date().toLocaleDateString()}</p>
<h2>Acceptance of Terms</h2>
<p>By accessing our website, you agree to be bound by these terms of service.</p>
<h2>Use License</h2>
<p>Permission is granted to temporarily use our website for personal, non-commercial use only.</p>
<h2>Disclaimer</h2>
<p>The materials on our website are provided on an 'as is' basis.</p>`,
    isHtml: true
  },
  { 
    id: 'disclaimer', 
    title: 'Disclaimer',
    defaultContent: `<h1>Affiliate Disclaimer</h1>
<p>Last updated: ${new Date().toLocaleDateString()}</p>
<h2>Affiliate Links</h2>
<p>This website contains affiliate links. When you click on these links and make a purchase, we may earn a commission at no additional cost to you.</p>
<h2>Honest Reviews</h2>
<p>Our reviews are based on our honest opinions and testing. We only recommend products we believe provide value to our readers.</p>
<h2>Disclosure</h2>
<p>We are committed to transparency and will always disclose when content contains affiliate links.</p>`,
    isHtml: true
  },
]

export default function PageManagement() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedPageId, setSelectedPageId] = useState<string>(EDITABLE_PAGES[0].id)
  const [pageContents, setPageContents] = useState<Record<string, PageContent>>({})
  const [editContent, setEditContent] = useState('')
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/dashboard')
      } else {
        setCurrentUser(user)
        loadPageContents()
      }
    })
    return () => unsubscribe()
  }, [navigate])

  const loadPageContents = async () => {
    try {
      const docRef = doc(db, 'settings', 'pageContents')
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        setPageContents(data as Record<string, PageContent>)
        
        // Set initial edit content
        const firstPage = EDITABLE_PAGES[0]
        const content = data[firstPage.id]?.content || firstPage.defaultContent
        setEditContent(content)
      } else {
        // Initialize Firebase with all default content
        const initialContents: Record<string, PageContent> = {}
        EDITABLE_PAGES.forEach(page => {
          initialContents[page.id] = {
            id: page.id,
            title: page.title,
            content: page.defaultContent,
            lastUpdated: new Date().toISOString()
          }
        })
        
        await setDoc(docRef, initialContents)
        setPageContents(initialContents)
        setEditContent(EDITABLE_PAGES[0].defaultContent)
      }
    } catch (error) {
      console.error('Error loading page contents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageSelect = (pageId: string) => {
    setSelectedPageId(pageId)
    const page = EDITABLE_PAGES.find(p => p.id === pageId)
    const content = pageContents[pageId]?.content || page?.defaultContent || ''
    setEditContent(content)
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveMessage('')
    
    try {
      const updatedPageContent: PageContent = {
        id: selectedPageId,
        title: EDITABLE_PAGES.find(p => p.id === selectedPageId)?.title || '',
        content: editContent,
        lastUpdated: new Date().toISOString()
      }

      const updatedContents = {
        ...pageContents,
        [selectedPageId]: updatedPageContent
      }

      const docRef = doc(db, 'settings', 'pageContents')
      await setDoc(docRef, updatedContents, { merge: true })
      
      setPageContents(updatedContents)
      setSaveMessage('Content saved successfully!')
      
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      console.error('Error saving content:', error)
      setSaveMessage('Failed to save content')
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

  const selectedPage = EDITABLE_PAGES.find(p => p.id === selectedPageId)

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
                  Page Management
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Edit content for all pages
                </p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#7c3aed] via-[#6366f1] to-[#3b82f6] px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`mx-auto max-w-7xl px-4 pt-4`}>
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
        <div className="grid grid-cols-4 gap-6">
          {/* Sidebar - Page List */}
          <div className="col-span-1">
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-[#30363d] dark:bg-[#161b22]">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Pages
              </h2>
              <div className="space-y-1">
                {EDITABLE_PAGES.map((page) => (
                  <button
                    key={page.id}
                    onClick={() => handlePageSelect(page.id)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      selectedPageId === page.id
                        ? 'bg-[#6366f1] text-white'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#0d1117]'
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    {page.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="col-span-3">
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-[#30363d] dark:bg-[#161b22]">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedPage?.title}
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {pageContents[selectedPageId]?.lastUpdated
                    ? `Last updated: ${new Date(pageContents[selectedPageId].lastUpdated).toLocaleString()}`
                    : 'Never updated'}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Content {selectedPage?.isHtml && '(HTML supported)'} {selectedPage?.isJson && '(JSON format)'}
                </label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={selectedPage?.isHtml ? 20 : selectedPage?.isJson ? 12 : 6}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                  placeholder="Enter page content..."
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {selectedPage?.isHtml 
                    ? 'You can use HTML tags like <h1>, <h2>, <p>, <ul>, <li>, etc.'
                    : selectedPage?.isJson
                    ? 'Edit the JSON structure to update page content'
                    : 'Plain text content'}
                </p>
              </div>

              {/* Preview for HTML pages */}
              {selectedPage?.isHtml && editContent && (
                <div className="mt-6">
                  <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Preview:
                  </h3>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-[#30363d] dark:bg-[#0d1117]">
                    <div
                      className="prose prose-sm max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: editContent }}
                    />
                  </div>
                </div>
              )}
              
              {/* Info for JSON pages */}
              {selectedPage?.isJson && (
                <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900/30 dark:bg-blue-900/10">
                  <p className="text-xs text-blue-800 dark:text-blue-400">
                    💡 This page uses JSON format. Make sure to maintain valid JSON syntax.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
