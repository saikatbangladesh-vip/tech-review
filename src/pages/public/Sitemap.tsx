import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { db } from '../../config/firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function Sitemap() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const docRef = doc(db, 'settings', 'pageContents')
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data['sitemap']?.content) {
            setContent(data['sitemap'].content)
          }
        }
      } catch (e) {
        console.error('Error loading page content:', e)
      } finally {
        setLoading(false)
      }
    }
    
    loadContent()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#0d1117]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400" />
      </div>
    )
  }

  if (content) {
    return (
      <div className="min-h-screen bg-white py-16 dark:bg-[#0d1117]">
        <div className="container mx-auto max-w-3xl px-4">
          <div 
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    )
  }

  // Default fallback content
  return (
    <div className="min-h-screen bg-white py-16 dark:bg-[#0d1117]">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white">Sitemap</h1>
        <p className="mb-8 text-base text-gray-600 dark:text-gray-400">Navigate through all pages on our website</p>
        <div className="space-y-8 text-base leading-relaxed text-gray-700 dark:text-gray-300">
          
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Main Pages</h2>
            <ul className="space-y-2 pl-0">
              <li>
                <Link to="/" className="text-[#6366f1] hover:underline dark:text-[#7c3aed]">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-[#6366f1] hover:underline dark:text-[#7c3aed]">
                  All Reviews
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-[#6366f1] hover:underline dark:text-[#7c3aed]">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#6366f1] hover:underline dark:text-[#7c3aed]">
                  Contact
                </Link>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Legal Pages</h2>
            <ul className="space-y-2 pl-0">
              <li>
                <Link to="/privacy-policy" className="text-[#6366f1] hover:underline dark:text-[#7c3aed]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-[#6366f1] hover:underline dark:text-[#7c3aed]">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-[#6366f1] hover:underline dark:text-[#7c3aed]">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
