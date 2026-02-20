import { logEvent } from 'firebase/analytics'
import { analytics } from '../config/firebase'
import { logAnalyticsEvent } from '../services/analyticsService'

// Track page views
export const trackPageView = (pagePath: string, pageTitle: string) => {
  // Log to Firebase Analytics
  if (analytics) {
    logEvent(analytics, 'page_view', {
      page_path: pagePath,
      page_title: pageTitle
    })
  }
  
  // Store in Firestore for real-time analytics
  logAnalyticsEvent({
    eventType: 'page_view',
    data: {
      pagePath,
      pageTitle
    }
  })
}

// Track post views
export const trackPostView = (postId: string, postTitle: string) => {
  // Log to Firebase Analytics
  if (analytics) {
    logEvent(analytics, 'view_item', {
      item_id: postId,
      item_name: postTitle,
      content_type: 'post'
    })
  }
  
  // Store in Firestore for real-time analytics
  logAnalyticsEvent({
    eventType: 'post_view',
    data: {
      postId,
      postTitle
    }
  })
}

// Track affiliate link clicks
export const trackAffiliateClick = (postId: string, postTitle: string, affiliateUrl: string) => {
  // Log to Firebase Analytics
  if (analytics) {
    logEvent(analytics, 'select_content', {
      content_type: 'affiliate_link',
      item_id: postId,
      item_name: postTitle,
      link_url: affiliateUrl
    })
  }
  
  // Store in Firestore for real-time analytics
  logAnalyticsEvent({
    eventType: 'affiliate_click',
    data: {
      postId,
      postTitle,
      affiliateUrl
    }
  })
}

// Track newsletter signup
export const trackNewsletterSignup = (email: string) => {
  // Log to Firebase Analytics
  if (analytics) {
    logEvent(analytics, 'sign_up', {
      method: 'newsletter',
      email: email
    })
  }
  
  // Store in Firestore for real-time analytics
  logAnalyticsEvent({
    eventType: 'newsletter_signup',
    data: {
      email
    }
  })
}

// Track search
export const trackSearch = (searchTerm: string) => {
  // Log to Firebase Analytics
  if (analytics) {
    logEvent(analytics, 'search', {
      search_term: searchTerm
    })
  }
  
  // Store in Firestore for real-time analytics
  logAnalyticsEvent({
    eventType: 'search',
    data: {
      searchTerm
    }
  })
}

// Track custom events
export const trackCustomEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (analytics) {
    logEvent(analytics, eventName, eventParams)
  }
}
