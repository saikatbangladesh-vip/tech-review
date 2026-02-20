import { Link } from 'react-router-dom'
import { Sparkles, AlertCircle, Twitter, Facebook, Instagram, Linkedin, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AMAZON_CATEGORIES } from '../../constants/categories'
import { db } from '../../config/firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function Footer() {
  const [settings, setSettings] = useState({
    siteName: 'TechReview',
    siteDescription: 'Your trusted source for honest, in-depth product reviews to help you make informed buying decisions.',
    copyrightText: '© 2024 TechReview. All rights reserved.',
    siteRating: 4.8,
    siteIcon: '',
    ratingTitle: 'Rate Our Site',
    ratingDescription: 'Click to rate your experience',
    ratingButtonText: 'Site Rating',
    ratingThankYouMessage: 'Thank you for rating!',
    ratingReviewCount: 'Based on 50,000+ reviews',
    socialLinks: { twitter: '', facebook: '', instagram: '', linkedin: '', pinterest: '' },
  })
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [hasRated, setHasRated] = useState(() => {
    return localStorage.getItem('siteRated') === 'true'
  })
  const [justRated, setJustRated] = useState(false)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'siteSettings')
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const data = docSnap.data()
          setSettings({
            siteName: data.siteName || 'TechReview',
            siteDescription: data.footerDescription || data.siteDescription || 'Your trusted source for honest, in-depth product reviews.',
            copyrightText: data.copyrightText || `© ${new Date().getFullYear()} TechReview. All rights reserved.`,
            siteRating: data.siteRating || 4.8,
            siteIcon: data.siteIcon || '',
            ratingTitle: data.ratingTitle || 'Rate Our Site',
            ratingDescription: data.ratingDescription || 'Click to rate your experience',
            ratingButtonText: data.ratingButtonText || 'Site Rating',
            ratingThankYouMessage: data.ratingThankYouMessage || 'Thank you for rating!',
            ratingReviewCount: data.ratingReviewCount || 'Based on 50,000+ reviews',
            socialLinks: {
              twitter: data.twitter || '',
              facebook: data.facebook || '',
              instagram: data.instagram || '',
              linkedin: data.linkedin || '',
              pinterest: data.pinterest || ''
            },
          })
        }
      } catch (error) {
        console.error('Error loading footer settings:', error)
      }
    }
    
    loadSettings()
  }, [])

  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-[#21262d] dark:bg-[#0d1117]">
      <div className="container mx-auto px-4 py-12">
        {/* Affiliate Disclaimer */}
        <div className="mb-10 rounded-lg border border-orange-200 bg-orange-50 p-6 dark:border-orange-900/30 dark:bg-orange-900/10">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-orange-500/10">
              <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1">
              <p className="mb-2 text-sm font-semibold text-orange-900 dark:text-orange-400">
                Affiliate Disclaimer
              </p>
              <p className="mb-2 text-sm leading-relaxed text-orange-800 dark:text-orange-400/80">
                This website contains affiliate links, which means I may earn a commission if you click on them and make a purchase — at no additional cost to you.
              </p>
              <p className="mb-2 text-sm leading-relaxed text-orange-800 dark:text-orange-400/80">
                I only promote products and services that I have personally researched, used, or genuinely believe will bring value to my readers. These commissions help support the ongoing work required to create free, valuable content and maintain the quality of this website.
              </p>
              <p className="mb-2 text-sm leading-relaxed text-orange-800 dark:text-orange-400/80">
                Please note that I am not directly selling any of the products mentioned here. Any issues, warranties, or service inquiries should be directed to the original seller or manufacturer.
              </p>
              <p className="mb-2 text-sm leading-relaxed text-orange-800 dark:text-orange-400/80">
                Your trust is extremely important to me. Transparency and honesty are core values of this site, and I always aim to provide unbiased information regardless of affiliate partnerships.
              </p>
              <p className="mb-2 text-sm leading-relaxed text-orange-800 dark:text-orange-400/80">
                Our reviews are based on our own testing and research. While we strive to provide accurate information, product specifications and availability may change. For full details, please read our <Link to="/disclaimer" className="underline hover:text-orange-900 dark:hover:text-orange-300">Disclaimer page</Link>.
              </p>
              <p className="text-sm leading-relaxed text-orange-800 dark:text-orange-400/80">
                Thank you for supporting my work by using these links — it truly makes a difference!
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="lg:pr-4">
          <Link to="/" className="mb-3 inline-flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]">
                {settings.siteIcon ? (
                  <span className="text-lg">{settings.siteIcon}</span>
                ) : (
                  <Sparkles className="h-4 w-4 text-white" />
                )}
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {settings.siteName}
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 whitespace-normal">
              {settings.siteDescription}
            </p>
            {/* Social Links */}
            {(settings.socialLinks.twitter || settings.socialLinks.facebook || settings.socialLinks.instagram || settings.socialLinks.linkedin || settings.socialLinks.pinterest) && (
              <div className="mt-4 flex gap-3">
                {settings.socialLinks.twitter && (
                  <a
                    href={settings.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition-colors hover:border-[#6366f1] hover:text-[#6366f1] dark:border-[#30363d] dark:bg-[#161b22] dark:text-gray-400 dark:hover:border-[#7c3aed] dark:hover:text-[#7c3aed]"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
                {settings.socialLinks.facebook && (
                  <a
                    href={settings.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition-colors hover:border-[#6366f1] hover:text-[#6366f1] dark:border-[#30363d] dark:bg-[#161b22] dark:text-gray-400 dark:hover:border-[#7c3aed] dark:hover:text-[#7c3aed]"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                )}
                {settings.socialLinks.instagram && (
                  <a
                    href={settings.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition-colors hover:border-[#6366f1] hover:text-[#6366f1] dark:border-[#30363d] dark:bg-[#161b22] dark:text-gray-400 dark:hover:border-[#7c3aed] dark:hover:text-[#7c3aed]"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
                {settings.socialLinks.linkedin && (
                  <a
                    href={settings.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition-colors hover:border-[#6366f1] hover:text-[#6366f1] dark:border-[#30363d] dark:bg-[#161b22] dark:text-gray-400 dark:hover:border-[#7c3aed] dark:hover:text-[#7c3aed]"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {settings.socialLinks.pinterest && (
                  <a
                    href={settings.socialLinks.pinterest}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition-colors hover:border-[#6366f1] hover:text-[#6366f1] dark:border-[#30363d] dark:bg-[#161b22] dark:text-gray-400 dark:hover:border-[#7c3aed] dark:hover:text-[#7c3aed]"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Explore
            </h3>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-gray-600 transition-colors hover:text-[#6366f1] dark:text-gray-400 dark:hover:text-[#7c3aed]">
                Home
              </Link>
              <Link to="/reviews" className="text-sm text-gray-600 transition-colors hover:text-[#6366f1] dark:text-gray-400 dark:hover:text-[#7c3aed]">
                All Reviews
              </Link>
              <Link to="/about" className="text-sm text-gray-600 transition-colors hover:text-[#6366f1] dark:text-gray-400 dark:hover:text-[#7c3aed]">
                About Us
              </Link>
              <Link to="/contact" className="text-sm text-gray-600 transition-colors hover:text-[#6366f1] dark:text-gray-400 dark:hover:text-[#7c3aed]">
                Contact
              </Link>
              <Link to="/sitemap" className="text-sm text-gray-600 transition-colors hover:text-[#6366f1] dark:text-gray-400 dark:hover:text-[#7c3aed]">
                Sitemap
              </Link>
              <Link to="/privacy-policy" className="text-sm text-gray-600 transition-colors hover:text-[#6366f1] dark:text-gray-400 dark:hover:text-[#7c3aed]">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-sm text-gray-600 transition-colors hover:text-[#6366f1] dark:text-gray-400 dark:hover:text-[#7c3aed]">
                Terms of Service
              </Link>
              <Link to="/disclaimer" className="text-sm text-gray-600 transition-colors hover:text-[#6366f1] dark:text-gray-400 dark:hover:text-[#7c3aed]">
                Disclaimer
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Popular Categories
            </h3>
            <div className="flex flex-col gap-2">
              {AMAZON_CATEGORIES.slice(0, 8).map((category) => (
                <Link
                  key={category}
                  to={`/reviews?category=${encodeURIComponent(category)}`}
                  className="text-sm text-gray-600 transition-colors hover:text-[#6366f1] dark:text-gray-400 dark:hover:text-[#7c3aed]"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Stay Updated
            </h3>
            <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
              Get the latest reviews delivered to your inbox.
            </p>
            {subscribed ? (
              <div className="rounded-md border border-green-200 bg-green-50 p-3 dark:border-green-900/30 dark:bg-green-900/10">
                <p className="text-sm font-medium text-green-800 dark:text-green-400">
                  ✓ Successfully subscribed!
                </p>
                <p className="mt-1 text-xs text-green-700 dark:text-green-400/80">
                  Thank you for joining our newsletter.
                </p>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 transition-colors focus:border-[#6366f1] focus:outline-none focus:ring-1 focus:ring-[#6366f1] dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white dark:placeholder-gray-500"
                />
                <button
                  onClick={() => {
                    if (email && email.includes('@')) {
                      setSubscribed(true)
                      setEmail('')
                    }
                  }}
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 dark:border-[#30363d] dark:bg-[#21262d] dark:text-white dark:hover:bg-[#30363d]"
                >
                  Join
                </button>
              </div>
            )}
            
            {/* Star Rating */}
            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-[#30363d] dark:bg-[#161b22]">
              {!hasRated ? (
                <>
                  <div className="mb-3 text-center">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                      {settings.ratingTitle}
                    </span>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      {settings.ratingDescription}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => {
                          setHasRated(true)
                          setJustRated(true)
                          // Save to localStorage
                          localStorage.setItem('siteRated', 'true')
                          localStorage.setItem('userRating', star.toString())
                        }}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="cursor-pointer transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-7 w-7 transition-colors ${
                            star <= (hoverRating || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {justRated && (
                    <div className="mb-3 rounded-md border border-green-200 bg-green-50 p-2 text-center dark:border-green-900/30 dark:bg-green-900/10">
                      <p className="text-sm font-medium text-green-800 dark:text-green-400">
                        {settings.ratingThankYouMessage}
                      </p>
                    </div>
                  )}
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                      {settings.ratingButtonText}
                    </span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{settings.siteRating.toFixed(1)}</span>
                  </div>
                  <div className="mb-2 flex items-center justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= Math.floor(settings.siteRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : star === Math.ceil(settings.siteRating) && settings.siteRating % 1 !== 0
                            ? 'fill-yellow-400 text-yellow-400 opacity-50'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {settings.ratingReviewCount}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-gray-200 pt-8 dark:border-[#21262d]">
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:justify-between">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {settings.copyrightText}
            </p>
            <div className="flex gap-6 text-xs">
              <Link to="/privacy-policy" className="text-gray-600 transition-colors hover:text-[#6366f1] dark:text-gray-400 dark:hover:text-[#7c3aed]">Privacy Policy</Link>
              <Link to="/terms-of-service" className="text-gray-600 transition-colors hover:text-[#6366f1] dark:text-gray-400 dark:hover:text-[#7c3aed]">Terms of Service</Link>
              <Link to="/sitemap" className="text-gray-600 transition-colors hover:text-[#6366f1] dark:text-gray-400 dark:hover:text-[#7c3aed]">Sitemap</Link>
              <Link to="/disclaimer" className="text-gray-600 transition-colors hover:text-[#6366f1] dark:text-gray-400 dark:hover:text-[#7c3aed]">Disclaimer</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
