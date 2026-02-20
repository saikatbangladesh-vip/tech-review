import { useState, useEffect } from 'react'
import { db } from '../../config/firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function TermsOfService() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const docRef = doc(db, 'settings', 'pageContents')
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data['terms-of-service']?.content) {
            setContent(data['terms-of-service'].content)
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
        <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
        <div className="space-y-6 text-base leading-relaxed text-gray-700 dark:text-gray-300">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <section>
            <h2 className="mb-3 mt-8 text-2xl font-bold text-gray-900 dark:text-white">Acceptance of Terms</h2>
            <p>
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to these terms, please do not use this website.
            </p>
          </section>

          <section>
            <h2 className="mb-3 mt-8 text-2xl font-bold text-gray-900 dark:text-white">Use License</h2>
            <p>
              Permission is granted to temporarily access the materials on our website for personal, non-commercial 
              transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>
            <p className="mt-3">Under this license you may not:</p>
            <ul className="list-disc space-y-2 pl-6 mt-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 mt-8 text-2xl font-bold text-gray-900 dark:text-white">Disclaimer</h2>
            <p>
              The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, 
              and hereby disclaim and negate all other warranties including, without limitation, implied warranties or 
              conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property 
              or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="mb-3 mt-8 text-2xl font-bold text-gray-900 dark:text-white">Limitations</h2>
            <p>
              In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for 
              loss of data or profit, or due to business interruption) arising out of the use or inability to use the 
              materials on our website.
            </p>
          </section>

          <section>
            <h2 className="mb-3 mt-8 text-2xl font-bold text-gray-900 dark:text-white">Affiliate Links</h2>
            <p>
              Our website contains affiliate links. When you click on these links and make a purchase, we may earn a 
              commission at no additional cost to you. This helps support our website and allows us to continue providing 
              quality content.
            </p>
          </section>

          <section>
            <h2 className="mb-3 mt-8 text-2xl font-bold text-gray-900 dark:text-white">Revisions</h2>
            <p>
              We may revise these terms of service at any time without notice. By using this website, you are agreeing to 
              be bound by the current version of these terms of service.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
