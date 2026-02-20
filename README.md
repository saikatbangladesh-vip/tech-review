# TechReview - Affiliate Product Review Platform

A modern, full-featured affiliate product review platform built with React, TypeScript, Firebase, and Tailwind CSS. This application provides a complete content management system for publishing product reviews, managing affiliate links, and tracking analytics.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [Database Schema](#database-schema)
- [Security Rules](#security-rules)
- [Analytics](#analytics)
- [Admin Features](#admin-features)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)

## Features

### Public Features
- Responsive product review blog interface
- Dark/Light theme support with persistent preferences
- Dynamic routing with React Router
- Lazy loading for optimized performance
- Product categories and tagging system
- Reading time estimation
- Featured posts section
- SEO-friendly pages
- Contact form
- Newsletter signup capability
- Legal pages (Privacy Policy, Terms of Service, Disclaimer)
- Interactive sitemap

### Admin Features
- Complete dashboard for content management
- User management system
- Post creation and editing
- Page management
- Site settings configuration
- Real-time analytics dashboard
- Affiliate click tracking
- Page view statistics
- Post performance metrics

### Technical Features
- Firebase Firestore database integration
- Firebase Authentication
- Real-time data synchronization
- Analytics event tracking
- Markdown content rendering with GitHub Flavored Markdown
- Automatic heading links
- Code syntax highlighting support
- Responsive design for all devices
- Performance optimizations with code splitting
- Production-ready build configuration

## Technology Stack

### Frontend
- **React 19.1.1** - UI library
- **TypeScript 5.9.3** - Type safety
- **Vite 7.1.7** - Build tool and dev server
- **React Router DOM 7.9.4** - Client-side routing
- **Tailwind CSS 4.1.16** - Utility-first CSS framework
- **Framer Motion 12.23.24** - Animation library
- **Lucide React 0.548.0** - Icon library

### Backend & Database
- **Firebase 12.4.0** - Backend as a Service
  - Firestore - NoSQL database
  - Authentication - User management
  - Analytics - Usage tracking
  - Hosting - Static file hosting

### Content & Markdown
- **React Markdown 10.1.0** - Markdown rendering
- **Remark GFM 4.0.1** - GitHub Flavored Markdown
- **Rehype Slug 6.0.0** - Heading ID generation
- **Rehype Autolink Headings 7.1.0** - Automatic heading links

### Development Tools
- **ESLint 9.38.0** - Code linting
- **Prettier 3.6.2** - Code formatting
- **TypeScript ESLint 8.45.0** - TypeScript linting
- **PostCSS 8.5.6** - CSS processing
- **Autoprefixer 10.4.21** - CSS vendor prefixing

## Project Structure

```
affiliate-program/
├── public/                      # Static assets
├── src/
│   ├── components/             # Reusable components
│   │   ├── layout/            # Layout components
│   │   │   ├── Header.tsx     # Site header with navigation
│   │   │   └── Footer.tsx     # Site footer
│   │   └── ScrollToTop.tsx    # Scroll restoration component
│   ├── config/                # Configuration files
│   │   └── firebase.ts        # Firebase configuration
│   ├── constants/             # Application constants
│   │   └── categories.ts      # Product categories
│   ├── contexts/              # React contexts
│   │   └── ThemeContext.tsx   # Theme management
│   ├── pages/                 # Page components
│   │   ├── public/           # Public pages
│   │   │   ├── Home.tsx      # Homepage
│   │   │   ├── Blog.tsx      # Blog listing
│   │   │   ├── PostDetail.tsx # Individual post
│   │   │   ├── About.tsx     # About page
│   │   │   ├── Contact.tsx   # Contact page
│   │   │   └── Sitemap.tsx   # Sitemap page
│   │   ├── legal/            # Legal pages
│   │   │   ├── PrivacyPolicy.tsx
│   │   │   ├── TermsOfService.tsx
│   │   │   └── Disclaimer.tsx
│   │   └── admin/            # Admin pages
│   │       ├── AdminDashboard.tsx
│   │       ├── UserManagement.tsx
│   │       ├── PostManagement.tsx
│   │       ├── PageManagement.tsx
│   │       ├── SettingsManagement.tsx
│   │       └── AnalyticsDashboard.tsx
│   ├── services/              # Service layer
│   │   ├── firestore.ts       # Firestore operations
│   │   └── analyticsService.ts # Analytics tracking
│   ├── types/                 # TypeScript type definitions
│   │   └── blog.ts            # Blog post types
│   ├── utils/                 # Utility functions
│   │   └── analytics.ts       # Analytics helpers
│   ├── App.tsx                # Main application component
│   ├── main.tsx               # Application entry point
│   └── index.css              # Global styles
├── .env                        # Environment variables
├── .gitignore                  # Git ignore rules
├── eslint.config.js            # ESLint configuration
├── firestore.rules             # Firestore security rules
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite configuration
```

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Firebase account** (free tier is sufficient)
- **Git** for version control

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd affiliate-program
```

2. Install dependencies:
```bash
npm install
```

3. Create a Firebase project:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Firestore Database
   - Enable Authentication (Email/Password provider)
   - Enable Analytics (optional)

4. Get Firebase configuration:
   - Go to Project Settings in Firebase Console
   - Scroll down to "Your apps" section
   - Click on Web app icon to create a web app
   - Copy the configuration values

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here

# Server Configuration
PORT=3000
```

**Important:** Never commit the `.env` file to version control. It's already included in `.gitignore`.

### Firebase Configuration

The Firebase configuration is located in `src/config/firebase.ts`. It automatically reads from environment variables, so you don't need to modify this file.

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port).

### Development Features
- Hot Module Replacement (HMR)
- Fast refresh for React components
- TypeScript type checking
- ESLint warnings in console
- Source maps for debugging

## Building for Production

Build the application for production:

```bash
npm run build
```

This will:
1. Run TypeScript compiler checks
2. Bundle and minify all assets
3. Generate optimized chunks
4. Output to `dist/` directory

Preview the production build locally:

```bash
npm run preview
```

## Deployment

### Netlify

1. **Connect Repository**: Connect your GitHub/GitLab/Bitbucket repository to Netlify.
2. **Build Settings**:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. **Environment Variables**: Add all variables from your `.env` file (prefixed with `VITE_`).
4. **SPA Routing**: The `netlify.toml` file in the root handles the necessary redirects for React Router.

### Vercel

1. **Import Project**: Import your repository into Vercel.
2. **Framework Preset**: Vercel should automatically detect **Vite**.
3. **Build & Output Settings**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables**: Add all `VITE_` variables in the project settings.
5. **SPA Routing**: The `vercel.json` file in the root handles the necessary rewrites.

### Render

1. **Create New Web Service**: Select "Static Site".
2. **Build & Deploy Settings**:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. **Environment Variables**: Add all `VITE_` variables.
4. **SPA Routing**: The `render.yaml` (Blueprint) or the `_redirects` file in `public/` will handle routing. If configuring manually in the dashboard, add a "Rewrite" rule: `/*` to `/index.html`.

### Firebase Hosting (Recommended)

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init
```
   - Select "Hosting"
   - Choose your Firebase project
   - Set public directory to `dist`
   - Configure as a single-page app: Yes
   - Don't overwrite `index.html`

4. Deploy to Firebase:
```bash
npm run build
firebase deploy
```

### Other Hosting Platforms

The built files in the `dist/` directory can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Google Cloud Storage

## Database Schema

### Collections

#### posts
Stores all blog posts and product reviews.

```typescript
{
  id: string              // Auto-generated document ID
  slug: string           // URL-friendly identifier
  title: string          // Post title
  excerpt: string        // Short description
  content: string        // Full content in Markdown
  coverImage: string     // Cover image URL
  date: string          // ISO date string
  author: {
    name: string
    avatar?: string
  }
  tags: string[]        // Post tags
  category: string      // Amazon category
  readingTime: number   // Minutes to read
  productName: string   // Product name
  productPrice?: number // Optional price
  affiliateUrl: string  // Amazon affiliate link
  pros?: string[]       // Product advantages
  cons?: string[]       // Product disadvantages
  specs?: {             // Product specifications
    [key: string]: string
  }
  featured?: boolean    // Featured post flag
}
```

#### users
Stores user information and preferences.

```typescript
{
  id: string           // User UID from Firebase Auth
  email: string
  displayName?: string
  photoURL?: string
  role: 'admin' | 'user'
  createdAt: Timestamp
  lastLogin: Timestamp
}
```

#### pages
Stores custom pages content.

```typescript
{
  id: string
  slug: string
  title: string
  content: string      // Markdown content
  published: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

#### settings
Stores site-wide settings.

```typescript
{
  id: string
  key: string          // Setting identifier
  value: any          // Setting value
  description?: string
  updatedAt: Timestamp
}
```

#### analytics_events
Stores analytics events for tracking.

```typescript
{
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
```

## Security Rules

Firestore security rules are defined in `firestore.rules`:

### Analytics Events
- Anyone can create analytics events (for tracking)
- Only authenticated users can read events
- No one can update or delete events

### Posts
- Anyone can read posts (public content)
- Only authenticated users can write posts (admin)

### Users
- Only authenticated users can read user data
- Users can only modify their own data

### Pages
- Anyone can read pages (public content)
- Only authenticated users can write pages (admin)

### Settings
- Anyone can read settings
- Only authenticated users can write settings (admin)

To deploy security rules:
```bash
firebase deploy --only firestore:rules
```

## Analytics

The application includes a comprehensive analytics system that tracks:

### Event Types
1. **page_view** - Track page visits
2. **post_view** - Track individual post views
3. **affiliate_click** - Track affiliate link clicks
4. **newsletter_signup** - Track newsletter subscriptions
5. **search** - Track search queries

### Analytics Functions

#### Tracking Events
```typescript
import { logAnalyticsEvent } from './services/analyticsService'

// Track page view
logAnalyticsEvent({
  eventType: 'page_view',
  data: {
    pagePath: '/about',
    pageTitle: 'About Us'
  }
})

// Track affiliate click
logAnalyticsEvent({
  eventType: 'affiliate_click',
  data: {
    postId: 'post-123',
    postTitle: 'Product Review',
    affiliateUrl: 'https://amazon.com/...'
  }
})
```

#### Retrieving Analytics
```typescript
import {
  getTotalPageViews,
  getTotalAffiliateClicks,
  getPostViews,
  getTopPosts,
  getRecentActivity
} from './services/analyticsService'

// Get total page views
const pageViews = await getTotalPageViews()

// Get top performing posts
const topPosts = await getTopPosts(10)

// Get recent activity
const activities = await getRecentActivity(20)
```

## Admin Features

### Admin Dashboard
Access the admin dashboard at `/dashboard` (requires authentication).

Features include:
- Overview statistics
- Quick actions
- Recent activity feed
- Performance metrics

### Post Management
Create, edit, and delete blog posts with:
- Markdown editor
- Category selection
- Tag management
- Featured post toggle
- Affiliate link configuration
- Product specifications

### User Management
Manage users and permissions:
- View all users
- Assign roles (admin/user)
- Monitor user activity
- Manage authentication

### Analytics Dashboard
View detailed analytics:
- Total page views
- Total affiliate clicks
- Post-specific metrics
- Top performing posts
- Recent activity timeline
- Time-based analytics

### Settings Management
Configure site settings:
- Site name and description
- Social media links
- Contact information
- SEO settings
- Feature toggles

## Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the client-side code (except for server-specific variables like `PORT`).

### Required Variables
- `VITE_FIREBASE_API_KEY` - Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID` - Firebase app ID
- `VITE_FIREBASE_MEASUREMENT_ID` - Firebase measurement ID

### Optional Variables
- `PORT` - Server port (default: 3000)

## Available Scripts

### Development
```bash
npm run dev          # Start development server
```

### Production
```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
```

## Performance Optimizations

The application includes several performance optimizations:

1. **Code Splitting**
   - Lazy loading for all pages
   - Separate vendor chunks for React and UI libraries
   - Dynamic imports for heavy components

2. **Build Optimizations**
   - ESBuild minification
   - CSS minification
   - Tree shaking
   - Asset optimization

3. **Runtime Optimizations**
   - React Suspense for lazy components
   - Memoization where appropriate
   - Efficient re-rendering strategies
   - Optimized bundle size

4. **Caching Strategy**
   - Service worker ready (can be added)
   - Asset fingerprinting
   - Long-term caching for static assets

## Browser Support

The application supports:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Theme System

The application includes a complete dark/light theme system:

### Theme Features
- Toggle between light and dark modes
- Persistent theme preference (localStorage)
- Smooth transitions
- System preference detection option
- GitHub-inspired dark theme
- Accessible color contrasts

### Custom Theme Colors
Defined in `tailwind.config.js`:
- Primary colors
- Secondary colors
- Accent colors
- Background variants
- Border colors
- GitHub canvas colors

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow the existing code style
- Run `npm run lint` before committing
- Use TypeScript types appropriately
- Write meaningful commit messages

### Commit Message Format
```
type(scope): subject

body (optional)

footer (optional)
```

Types: feat, fix, docs, style, refactor, test, chore

## Troubleshooting

### Common Issues

**Firebase Configuration Error**
- Ensure all environment variables are set correctly
- Check that `.env` file is in the root directory
- Restart the development server after changing `.env`

**Build Errors**
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check TypeScript errors: `npx tsc --noEmit`

**Firestore Permission Denied**
- Verify security rules are deployed
- Check user authentication status
- Ensure proper collection names

**Analytics Not Working**
- Verify Firebase Analytics is enabled
- Check browser console for errors
- Ensure analytics events are properly formatted

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

For support, please:
- Open an issue on GitHub
- Contact the development team
- Check the documentation

## Acknowledgments

- React team for the amazing library
- Firebase for backend services
- Tailwind CSS for the utility-first CSS framework
- Vite for the blazing fast build tool
- All contributors and open-source maintainers

---

Built with passion for creating excellent user experiences and efficient affiliate marketing solutions.