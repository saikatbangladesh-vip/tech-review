import { db } from '../config/firebase'
import { collection, addDoc, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore'

export interface AnalyticsEvent {
  eventType: 'page_view' | 'post_view' | 'affiliate_click' | 'newsletter_signup' | 'search'
  timestamp: Timestamp
  data: {
    pagePath?: string
    pageTitle?: string
    postId?: string
    postTitle?: string
    affiliateUrl?: string
    email?: string
    searchTerm?: string
  }
  userAgent?: string
  sessionId?: string
}

// Generate session ID for tracking unique sessions
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('analytics_session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('analytics_session_id', sessionId)
  }
  return sessionId
}

// Store analytics event in Firestore
export const logAnalyticsEvent = async (event: Omit<AnalyticsEvent, 'timestamp' | 'sessionId'>) => {
  try {
    await addDoc(collection(db, 'analytics_events'), {
      ...event,
      timestamp: Timestamp.now(),
      sessionId: getSessionId(),
      userAgent: navigator.userAgent
    })
  } catch (error) {
    console.error('Error logging analytics event:', error)
  }
}

// Get total page views
export const getTotalPageViews = async (): Promise<number> => {
  try {
    const q = query(collection(db, 'analytics_events'), where('eventType', '==', 'page_view'))
    const snapshot = await getDocs(q)
    return snapshot.size
  } catch (error) {
    console.error('Error getting page views:', error)
    return 0
  }
}

// Get total affiliate clicks
export const getTotalAffiliateClicks = async (): Promise<number> => {
  try {
    const q = query(collection(db, 'analytics_events'), where('eventType', '==', 'affiliate_click'))
    const snapshot = await getDocs(q)
    return snapshot.size
  } catch (error) {
    console.error('Error getting affiliate clicks:', error)
    return 0
  }
}

// Get post views by post ID
export const getPostViews = async (postId: string): Promise<number> => {
  try {
    const q = query(
      collection(db, 'analytics_events'),
      where('eventType', '==', 'post_view'),
      where('data.postId', '==', postId)
    )
    const snapshot = await getDocs(q)
    return snapshot.size
  } catch (error) {
    console.error('Error getting post views:', error)
    return 0
  }
}

// Get post clicks by post ID
export const getPostClicks = async (postId: string): Promise<number> => {
  try {
    const q = query(
      collection(db, 'analytics_events'),
      where('eventType', '==', 'affiliate_click'),
      where('data.postId', '==', postId)
    )
    const snapshot = await getDocs(q)
    return snapshot.size
  } catch (error) {
    console.error('Error getting post clicks:', error)
    return 0
  }
}

// Get top posts with analytics data
export const getTopPosts = async (limitCount: number = 10) => {
  try {
    // Get all post views
    const viewsQuery = query(
      collection(db, 'analytics_events'),
      where('eventType', '==', 'post_view')
    )
    const viewsSnapshot = await getDocs(viewsQuery)
    
    // Get all affiliate clicks
    const clicksQuery = query(
      collection(db, 'analytics_events'),
      where('eventType', '==', 'affiliate_click')
    )
    const clicksSnapshot = await getDocs(clicksQuery)
    
    // Count views and clicks per post
    const postStats: Record<string, { title: string; views: number; clicks: number }> = {}
    
    viewsSnapshot.forEach(doc => {
      const data = doc.data()
      const postId = data.data?.postId
      const postTitle = data.data?.postTitle
      if (postId) {
        if (!postStats[postId]) {
          postStats[postId] = { title: postTitle || 'Untitled', views: 0, clicks: 0 }
        }
        postStats[postId].views++
      }
    })
    
    clicksSnapshot.forEach(doc => {
      const data = doc.data()
      const postId = data.data?.postId
      if (postId && postStats[postId]) {
        postStats[postId].clicks++
      }
    })
    
    // Convert to array and sort by views
    const topPosts = Object.entries(postStats)
      .map(([id, stats]) => ({
        id,
        ...stats
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, limitCount)
    
    return topPosts
  } catch (error) {
    console.error('Error getting top posts:', error)
    return []
  }
}

// Get recent activity
export const getRecentActivity = async (limitCount: number = 10) => {
  try {
    const q = query(
      collection(db, 'analytics_events'),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    )
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => {
      const data = doc.data()
      let description = ''
      
      switch (data.eventType) {
        case 'page_view':
          description = `Page view: ${data.data?.pageTitle || 'Unknown page'}`
          break
        case 'post_view':
          description = `Post viewed: ${data.data?.postTitle || 'Unknown post'}`
          break
        case 'affiliate_click':
          description = `Affiliate link clicked: ${data.data?.postTitle || 'Unknown post'}`
          break
        case 'newsletter_signup':
          description = `Newsletter signup`
          break
        case 'search':
          description = `Search: ${data.data?.searchTerm || ''}`
          break
      }
      
      return {
        type: data.eventType,
        description,
        timestamp: data.timestamp.toDate()
      }
    })
  } catch (error) {
    console.error('Error getting recent activity:', error)
    return []
  }
}

// Get analytics for a specific time period
export const getAnalyticsForPeriod = async (startDate: Date, endDate: Date) => {
  try {
    const q = query(
      collection(db, 'analytics_events'),
      where('timestamp', '>=', Timestamp.fromDate(startDate)),
      where('timestamp', '<=', Timestamp.fromDate(endDate))
    )
    const snapshot = await getDocs(q)
    
    let pageViews = 0
    let postViews = 0
    let affiliateClicks = 0
    
    snapshot.forEach(doc => {
      const data = doc.data()
      switch (data.eventType) {
        case 'page_view':
          pageViews++
          break
        case 'post_view':
          postViews++
          break
        case 'affiliate_click':
          affiliateClicks++
          break
      }
    })
    
    return {
      pageViews,
      postViews,
      affiliateClicks,
      totalEvents: snapshot.size
    }
  } catch (error) {
    console.error('Error getting analytics for period:', error)
    return {
      pageViews: 0,
      postViews: 0,
      affiliateClicks: 0,
      totalEvents: 0
    }
  }
}
