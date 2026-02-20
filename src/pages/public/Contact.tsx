import { useState, useEffect } from 'react'
import { db } from '../../config/firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [pageContent, setPageContent] = useState({
    title: 'Contact Us',
    description: "Have questions or suggestions? We'd love to hear from you!"
  })

  useEffect(() => {
    const loadContent = async () => {
      try {
        const docRef = doc(db, 'settings', 'pageContents')
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data['contact']?.content) {
            try {
              const contactContent = JSON.parse(data['contact'].content)
              setPageContent({
                title: contactContent.pageTitle || 'Contact Us',
                description: contactContent.pageDescription || "Have questions or suggestions? We'd love to hear from you!"
              })
            } catch (e) {
              console.error('Error parsing contact content:', e)
            }
          }
        }
      } catch (e) {
        console.error('Error loading page content:', e)
      }
    }
    
    loadContent()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Show success message (form doesn't actually send)
    setSubmitted(true)
    // Reset form
    setFormData({ name: '', email: '', message: '' })
    // Hide message after 5 seconds
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div className="min-h-screen bg-white py-16 dark:bg-[#0d1117]">
      <div className="container mx-auto max-w-2xl px-4">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">{pageContent.title}</h1>
        <p className="mb-8 text-base text-gray-600 dark:text-gray-400">
          {pageContent.description}
        </p>

        {submitted && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-900/10">
            <p className="text-sm font-medium text-green-800 dark:text-green-400">
              ✓ Thank you for your message! We'll get back to you soon.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-[#6366f1] focus:outline-none focus:ring-1 focus:ring-[#6366f1] dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-[#6366f1] focus:outline-none focus:ring-1 focus:ring-[#6366f1] dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">Message</label>
            <textarea
              rows={6}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-[#6366f1] focus:outline-none focus:ring-1 focus:ring-[#6366f1] dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
              placeholder="Your message..."
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 dark:border-[#30363d] dark:bg-[#21262d] dark:text-white dark:hover:bg-[#30363d]"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}
