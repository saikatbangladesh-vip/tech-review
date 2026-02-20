import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth, db } from '../../config/firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc as firestoreDoc } from 'firebase/firestore'
import { ArrowLeft, Plus, Edit2, Trash2, X, Image as ImageIcon, Tag, Star } from 'lucide-react'
import type { BlogPost } from '../../types/blog'
import { AMAZON_CATEGORIES } from '../../constants/categories'

export default function PostManagement() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [modalError, setModalError] = useState('')
  
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: 'Electronics',
    productName: '',
    productPrice: 0,
    affiliateUrl: '',
    tags: [],
    pros: [],
    cons: [],
    specs: {},
    featured: false,
    readingTime: 5,
    date: new Date().toISOString(),
    author: { name: 'Admin' }
  })
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/dashboard')
      } else {
        setCurrentUser(user)
        loadPosts()
      }
    })
    return () => unsubscribe()
  }, [navigate])

  const loadPosts = async () => {
    try {
      const postsSnapshot = await getDocs(collection(db, 'posts'))
      const postsList = postsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as BlogPost))
      setPosts(postsList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setModalError('')

    try {
      const postData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title || ''),
        date: formData.date || new Date().toISOString(),
        author: formData.author || { name: 'Admin' },
        pros: formData.pros?.map(p => p.trim()).filter(Boolean) || [],
        cons: formData.cons?.map(c => c.trim()).filter(Boolean) || []
      }
      
      console.log('Saving post with featured:', postData.featured)

      if (editingPost && editingPost.id) {
        await updateDoc(firestoreDoc(db, 'posts', editingPost.id), postData)
      } else {
        await addDoc(collection(db, 'posts'), postData)
      }

      setShowModal(false)
      setEditingPost(null)
      resetForm()
      loadPosts()
    } catch (error: any) {
      console.error('Error saving post:', error)
      setModalError(error.message || 'Failed to save post')
    }
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      await deleteDoc(firestoreDoc(db, 'posts', postId))
      loadPosts()
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post')
    }
  }

  const openEditModal = (post: BlogPost) => {
    setEditingPost(post)
    setFormData(post)
    setShowModal(true)
  }

  const openAddModal = () => {
    setEditingPost(null)
    resetForm()
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImage: '',
      category: 'Electronics',
      productName: '',
      productPrice: 0,
      affiliateUrl: '',
      tags: [],
      pros: [],
      cons: [],
      specs: {},
      featured: false,
      readingTime: 5,
      date: new Date().toISOString(),
      author: { name: 'Admin' }
    })
  }

  if (!currentUser || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#0d1117]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400" />
      </div>
    )
  }

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
                  Post Management
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Create and manage blog posts
                </p>
              </div>
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#7c3aed] via-[#6366f1] to-[#3b82f6] px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg"
            >
              <Plus className="h-4 w-4" />
              New Post
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-xl border border-gray-200 bg-white dark:border-[#30363d] dark:bg-[#161b22]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50 dark:border-[#30363d] dark:bg-[#0d1117]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-[#30363d]">
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                      No posts found. Create your first post.
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post.id} className="group transition-colors hover:bg-gray-50 dark:hover:bg-[#0d1117]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                            {post.coverImage ? (
                              <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="max-w-md">
                            <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                              {post.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                              {post.excerpt}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                          <Tag className="h-3 w-3" />
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {post.featured && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400">
                            <Star className="h-3 w-3 fill-current" />
                            Featured
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(post)}
                            className="rounded-lg border border-gray-300 p-2 text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => post.id && handleDelete(post.id)}
                            className="rounded-lg border border-red-200 p-2 text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="my-8 w-full max-w-4xl rounded-xl border border-gray-200 bg-white p-6 dark:border-[#30363d] dark:bg-[#161b22]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingPost ? 'Edit Post' : 'Create New Post'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false)
                  setModalError('')
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                <p className="text-sm text-red-600 dark:text-red-400">{modalError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title and Slug */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ 
                        ...formData, 
                        title: e.target.value,
                        slug: formData.slug || generateSlug(e.target.value)
                      })
                    }}
                    required
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                    placeholder="Post title"
                  />
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                    placeholder="post-url-slug"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    URL: /product/{formData.slug || 'post-url-slug'}
                  </p>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Excerpt *
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  required
                  rows={2}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                  placeholder="Short description"
                />
              </div>

              {/* Content */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={6}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                  placeholder="Post content (Markdown supported)"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Category */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                  >
                    {AMAZON_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Product Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    required
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                    placeholder="iPhone 15 Pro"
                  />
                </div>
                
                {/* Product Price */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Product Price ($)
                  </label>
                  <input
                    type="number"
                    value={formData.productPrice || ''}
                    onChange={(e) => setFormData({ ...formData, productPrice: Number(e.target.value) })}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                    placeholder="999"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Cover Image */}
                <div className="col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cover Image URL *
                  </label>
                  <input
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    required
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                    placeholder="https://..."
                  />
                </div>
                
                {/* Reading Time */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Reading Time (min)
                  </label>
                  <input
                    type="number"
                    value={formData.readingTime || 5}
                    onChange={(e) => setFormData({ ...formData, readingTime: Number(e.target.value) })}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                    placeholder="5"
                  />
                </div>
              </div>
              
              {/* Affiliate URL */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Affiliate URL *
                </label>
                <input
                  type="url"
                  value={formData.affiliateUrl}
                  onChange={(e) => setFormData({ ...formData, affiliateUrl: e.target.value })}
                  required
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                  placeholder="https://amazon.com/..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Tags */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags?.join(', ')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                      })
                    }
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                    placeholder="apple, iphone, review"
                  />
                </div>
                
                {/* Publish Date */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Publish Date
                  </label>
                  {editingPost ? (
                    <div className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-[#30363d] dark:bg-[#0d1117]/50 dark:text-gray-400">
                      {new Date(formData.date || new Date()).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  ) : (
                    <input
                      type="datetime-local"
                      value={formData.date ? new Date(formData.date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)}
                      onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value).toISOString() })}
                      className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                    />
                  )}
                </div>
              </div>
              
              {/* Pros and Cons */}
              <div className="grid grid-cols-2 gap-4">
                {/* Pros */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Pros (one per line)
                  </label>
                  <textarea
                    value={formData.pros?.join('\n') || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pros: e.target.value.split('\n')
                      })
                    }
                    rows={4}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                    placeholder="Great camera&#10;Long battery life&#10;Fast performance"
                  />
                </div>
                
                {/* Cons */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cons (one per line)
                  </label>
                  <textarea
                    value={formData.cons?.join('\n') || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cons: e.target.value.split('\n')
                      })
                    }
                    rows={4}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                    placeholder="Expensive&#10;No charger included&#10;Heavy"
                  />
                </div>
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured || false}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mark as Featured
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setModalError('')
                  }}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg"
                >
                  {editingPost ? 'Update Post' : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
