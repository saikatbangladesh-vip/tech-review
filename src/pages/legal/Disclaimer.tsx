import { useState, useEffect } from 'react'
import { db } from '../../config/firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function Disclaimer() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const docRef = doc(db, 'settings', 'pageContents')
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data['disclaimer']?.content) {
            setContent(data['disclaimer'].content)
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
        <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white">Disclaimer</h1>
        <div className="space-y-6 text-base leading-relaxed text-gray-700 dark:text-gray-300">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <section>
            <h2 className="mb-4 mt-8 text-4xl font-bold text-gray-900 dark:text-white">Affiliate Disclosure</h2>
            <p>
              This website contains affiliate links, which means we may earn a commission if you click on a link and make a 
              purchase. This comes at no additional cost to you. We only recommend products and services that we believe will 
              add value to our readers.
            </p>
          </section>

          <section>
            <h2 className="mb-3 mt-8 text-2xl font-bold text-gray-900 dark:text-white">Product Reviews</h2>
            <p>
              Our product reviews are based on our own testing, research, and experience. While we strive to provide accurate 
              and up-to-date information, product specifications, prices, and availability may change without notice.
            </p>
            <p className="mt-3">
              The opinions expressed in our reviews are our own and are not influenced by advertisers or affiliate partnerships. 
              However, we may receive compensation when you purchase through our affiliate links.
            </p>
          </section>

          <section>
            <h2 className="mb-3 mt-8 text-2xl font-bold text-gray-900 dark:text-white">No Professional Advice</h2>
            <p>
              The information provided on this website is for general informational purposes only. It should not be considered 
              as professional advice. Always do your own research and consult with a professional before making any purchasing 
              decisions.
            </p>
          </section>

          <section>
            <h2 className="mb-3 mt-8 text-2xl font-bold text-gray-900 dark:text-white">Accuracy of Information</h2>
            <p>
              While we make every effort to ensure the accuracy of the information on our website, we make no representations 
              or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or 
              availability of the information, products, services, or related graphics contained on the website.
            </p>
          </section>

          <section>
            <h2 className="mb-3 mt-8 text-2xl font-bold text-gray-900 dark:text-white">Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We have no control over the content, privacy policies, 
              or practices of these sites and cannot accept responsibility or liability for them.
            </p>
          </section>

          <section>
            <h2 className="mb-3 mt-8 text-2xl font-bold text-gray-900 dark:text-white">Limitation of Liability</h2>
            <p>
              In no event will we be liable for any loss or damage including without limitation, indirect or consequential 
              loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in 
              connection with, the use of this website.
            </p>
          </section>

          <section>
            <h2 className="mb-3 mt-8 text-2xl font-bold text-gray-900 dark:text-white">Changes to This Disclaimer</h2>
            <p>
              We reserve the right to modify this disclaimer at any time. Changes will be effective immediately upon posting 
              on this page. Your continued use of the website following the posting of changes constitutes your acceptance 
              of such changes.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
