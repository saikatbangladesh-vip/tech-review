import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth, db } from '../../config/firebase'
import { collection, getDocs, doc as firestoreDoc, setDoc, getDoc } from 'firebase/firestore'
import { ArrowLeft, UserPlus, Edit2, X, Mail, User as UserIcon } from 'lucide-react'

interface AdminUser {
  uid: string
  email: string
  displayName: string
  createdAt: string
}

export default function UserManagement() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [modalError, setModalError] = useState('')
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: ''
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/dashboard')
      } else {
        setCurrentUser(user)
        loadUsers()
      }
    })
    return () => unsubscribe()
  }, [navigate])

  const loadUsers = async () => {
    try {
      // Load all users from Firestore
      const usersSnapshot = await getDocs(collection(db, 'users'))
      const usersList: AdminUser[] = []
      
      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data()
        usersList.push({
          uid: userDoc.id,
          email: userData.email || '',
          displayName: userData.displayName || 'No Name',
          createdAt: userData.createdAt || new Date().toISOString()
        })
      }
      
      setUsers(usersList)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setModalError('')
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )
      
      // Update display name
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: formData.displayName
        })
        
        // Save user info in Firestore for easy listing
        await setDoc(firestoreDoc(db, 'users', userCredential.user.uid), {
          email: formData.email,
          displayName: formData.displayName,
          createdAt: new Date().toISOString()
        })
      }
      
      setShowAddModal(false)
      setFormData({ email: '', password: '', displayName: '' })
      loadUsers()
    } catch (error: any) {
      console.error('Error adding user:', error)
      let errorMessage = 'Failed to add user'
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please use a different email.'
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setModalError(errorMessage)
    }
  }

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return
    setModalError('')
    
    try {
      // Get existing data
      const userDocRef = firestoreDoc(db, 'users', editingUser.uid)
      const userDoc = await getDoc(userDocRef)
      const existingData = userDoc.exists() ? userDoc.data() : {}
      
      // Update only displayName in Firestore
      await setDoc(userDocRef, {
        ...existingData,
        email: editingUser.email,
        displayName: formData.displayName,
        createdAt: editingUser.createdAt
      })
      
      setShowEditModal(false)
      setEditingUser(null)
      setFormData({ email: '', password: '', displayName: '' })
      loadUsers()
    } catch (error: any) {
      console.error('Error updating user:', error)
      setModalError(error.message || 'Failed to update user')
    }
  }


  const openEditModal = (user: AdminUser) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      password: '',
      displayName: user.displayName
    })
    setShowEditModal(true)
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
                  User Management
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Manage admin users and permissions
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#7c3aed] via-[#6366f1] to-[#3b82f6] px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg"
            >
              <UserPlus className="h-4 w-4" />
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-xl border border-gray-200 bg-white dark:border-[#30363d] dark:bg-[#161b22]">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50 dark:border-[#30363d] dark:bg-[#0d1117]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    User Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Joined Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-[#30363d]">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                      No users found. Add your first admin user.
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={user.uid} className="group transition-colors hover:bg-gray-50 dark:hover:bg-[#0d1117]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">
                            {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.displayName || 'No Name'}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                          <UserIcon className="h-3 w-3" />
                          User #{index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openEditModal(user)}
                          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          Edit Name
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 dark:border-[#30363d] dark:bg-[#161b22]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New User</h2>
              <button onClick={() => { setShowAddModal(false); setModalError(''); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {modalError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                <p className="text-sm text-red-600 dark:text-red-400">{modalError}</p>
              </div>
            )}
            
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Display Name</label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  required
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setModalError(''); }}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 dark:border-[#30363d] dark:bg-[#161b22]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Display Name</h2>
              <button onClick={() => { setShowEditModal(false); setModalError(''); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {modalError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                <p className="text-sm text-red-600 dark:text-red-400">{modalError}</p>
              </div>
            )}
            
            <form onSubmit={handleEditUser} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  value={editingUser?.email || ''}
                  disabled
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-gray-400"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Display Name</label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  required
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white"
                  placeholder="John Doe"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setModalError(''); }}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg"
                >
                  Update Name
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
