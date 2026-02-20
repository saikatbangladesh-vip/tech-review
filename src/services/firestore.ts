import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  where 
} from 'firebase/firestore'
import { db } from '../config/firebase'
import type { BlogPost } from '../types/blog'

const POSTS_COLLECTION = 'posts'

// Get all posts
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const postsRef = collection(db, POSTS_COLLECTION)
    const q = query(postsRef, orderBy('date', 'desc'))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as BlogPost))
  } catch (error) {
    console.error('Error fetching posts:', error)
    throw error
  }
}

// Get single post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const postsRef = collection(db, POSTS_COLLECTION)
    const q = query(postsRef, where('slug', '==', slug))
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      return null
    }
    
    const postDoc = querySnapshot.docs[0]
    return {
      id: postDoc.id,
      ...postDoc.data()
    } as BlogPost
  } catch (error) {
    console.error('Error fetching post:', error)
    throw error
  }
}

// Create new post
export async function createPost(postData: Omit<BlogPost, 'id'>): Promise<string> {
  try {
    const postsRef = collection(db, POSTS_COLLECTION)
    
    // Check if slug already exists
    const q = query(postsRef, where('slug', '==', postData.slug))
    const existingPost = await getDocs(q)
    
    if (!existingPost.empty) {
      throw new Error('Post with this slug already exists')
    }
    
    const docRef = await addDoc(postsRef, {
      ...postData,
      date: new Date().toISOString()
    })
    
    return docRef.id
  } catch (error) {
    console.error('Error creating post:', error)
    throw error
  }
}

// Update post
export async function updatePost(postId: string, postData: Partial<BlogPost>): Promise<void> {
  try {
    const postRef = doc(db, POSTS_COLLECTION, postId)
    await updateDoc(postRef, {
      ...postData,
      date: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error updating post:', error)
    throw error
  }
}

// Delete post
export async function deletePost(postId: string): Promise<void> {
  try {
    const postRef = doc(db, POSTS_COLLECTION, postId)
    await deleteDoc(postRef)
  } catch (error) {
    console.error('Error deleting post:', error)
    throw error
  }
}

// Get featured posts
export async function getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
  try {
    const postsRef = collection(db, POSTS_COLLECTION)
    const q = query(postsRef, where('featured', '==', true))
    const querySnapshot = await getDocs(q)
    
    // Sort by date in memory to avoid needing a composite index
    const posts = querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      } as BlogPost))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit)
    
    return posts
  } catch (error) {
    console.error('Error fetching featured posts:', error)
    // Fallback: return empty array instead of throwing
    return []
  }
}
