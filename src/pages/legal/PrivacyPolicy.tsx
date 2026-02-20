import { useState, useEffect } from 'react'
import { db } from '../../config/firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function PrivacyPolicy() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const docRef = doc(db, 'settings', 'pageContents')
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data['privacy-policy']?.content) {
            setContent(data['privacy-policy'].content)
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

  return (
    <div className="min-h-screen bg-white py-16 dark:bg-[#0d1117]">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="mb-6 text-5xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
        <div className="space-y-6 text-base leading-relaxed text-gray-700 dark:text-gray-300">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <section>
            <h2 className="mb-3 mt-8 text-2xl font-bold text-gray-900 dark:text-white">Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, including when you subscribe to our newsletter, 
              contact us, or interact with our website.
            </p>
          </section>

          <section>
            <h2 className="mb-3 mt-8 text-2xl font-bold text-gray-900 dark:text-white">How We Use Your Information</h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>To send you updates and newsletters (if subscribed)</li>
              <li>To respond to your inquiries and provide customer support</li>
              <li>To improve our website and services</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 mt-8 text-2xl font-bold text-gray-900 dark:text-white">Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our website and store certain information. 
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section>
            <h2 className="mb-3 mt-8 text-2xl font-bold text-gray-900 dark:text-white">Third-Party Services</h2>
            <p>
              We may use third-party services such as analytics providers and affiliate networks. These third parties 
              have their own privacy policies addressing how they use such information.
            </p>
          </section>

          <section>
            <h2 className="mb-3 mt-8 text-2xl font-bold text-gray-900 dark:text-white">Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information. If you wish to exercise these 
              rights, please contact us using the information provided on our Contact page.
            </p>
          </section>

          <section>
            <h2 className="mb-3 mt-8 text-2xl font-bold text-gray-900 dark:text-white">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us through our Contact page.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
