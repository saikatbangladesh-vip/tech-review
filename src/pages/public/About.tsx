import { useState, useEffect } from 'react'
import { db } from '../../config/firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function About() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const docRef = doc(db, 'settings', 'pageContents')
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data['about']?.content) {
            setContent(data['about'].content)
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
        <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white">About TechReview</h1>
        <div className="space-y-4 text-base leading-relaxed text-gray-700 dark:text-gray-300">
          <p>
            Welcome to TechReview, your trusted source for honest, in-depth product reviews. We're passionate about technology and helping you make informed buying decisions.
          </p>
          <p>
            Our team of experienced reviewers thoroughly tests each product before writing a review. We don't just regurgitate specs – we use products in real-world scenarios to give you practical insights.
          </p>
          <h2 className="mt-10 mb-3 text-2xl font-bold text-gray-900 dark:text-white">Our Promise</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Honest, unbiased reviews based on real testing</li>
            <li>Clear pros and cons for every product</li>
            <li>Transparent affiliate disclosure</li>
            <li>Regular updates as products evolve</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
