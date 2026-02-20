import { Link } from 'react-router-dom'
import { Menu, X, Moon, Sun, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { db } from '../../config/firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const [siteName, setSiteName] = useState('TechReview')
  const [siteIcon, setSiteIcon] = useState('')

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'siteSettings')
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const data = docSnap.data()
          setSiteName(data.siteName || 'TechReview')
          setSiteIcon(data.siteIcon || '')
        }
      } catch (error) {
        console.error('Error loading header settings:', error)
      }
    }
    
    loadSettings()
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md transition-all duration-300 dark:border-[#21262d] dark:bg-[#0d1117]/95">
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]">
              {siteIcon ? (
                <span className="text-lg">{siteIcon}</span>
              ) : (
                <Sparkles className="h-4 w-4 text-white" />
              )}
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {siteName}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-2 md:flex">
            <Link 
              to="/" 
              className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#21262d] dark:hover:text-white"
            >
              Home
            </Link>
            <Link 
              to="/reviews" 
              className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#21262d] dark:hover:text-white"
            >
              Reviews
            </Link>
            <Link 
              to="/about" 
              className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#21262d] dark:hover:text-white"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="ml-1 rounded-md border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 dark:border-[#30363d] dark:bg-[#21262d] dark:text-white dark:hover:bg-[#30363d]"
            >
              Contact
            </Link>
            <button
              onClick={toggleTheme}
              className="ml-1 rounded-md border border-gray-300 bg-white p-2 transition-colors hover:bg-gray-50 dark:border-[#30363d] dark:bg-[#0d1117] dark:hover:bg-[#21262d]"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-gray-400" /> : <Moon className="h-4 w-4 text-gray-600" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="rounded-md border border-gray-300 bg-white p-1.5 transition-colors hover:bg-gray-50 dark:border-[#30363d] dark:bg-[#0d1117] dark:hover:bg-[#21262d]"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-gray-400" /> : <Moon className="h-4 w-4 text-gray-600" />}
            </button>
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="rounded-md border border-gray-300 bg-white p-1.5 transition-colors hover:bg-gray-50 dark:border-[#30363d] dark:bg-[#0d1117] dark:hover:bg-[#21262d]"
            >
              {isOpen ? <X className="h-5 w-5 text-gray-600 dark:text-gray-400" /> : <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="border-t border-gray-200 py-4 dark:border-[#21262d] md:hidden">
            <div className="flex flex-col gap-1">
              <Link 
                to="/" 
                onClick={() => setIsOpen(false)} 
                className="rounded-md px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#21262d]"
              >
                Home
              </Link>
              <Link 
                to="/reviews" 
                onClick={() => setIsOpen(false)} 
                className="rounded-md px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#21262d]"
              >
                Reviews
              </Link>
              <Link 
                to="/about" 
                onClick={() => setIsOpen(false)} 
                className="rounded-md px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#21262d]"
              >
                About
              </Link>
              <Link 
                to="/contact" 
                onClick={() => setIsOpen(false)} 
                className="mt-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-center font-medium text-gray-900 transition-colors hover:bg-gray-50 dark:border-[#30363d] dark:bg-[#21262d] dark:text-white dark:hover:bg-[#30363d]"
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
