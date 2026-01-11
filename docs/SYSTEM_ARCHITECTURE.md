# Coffee Craft - System Architecture
## Monetization Features Technical Specification

**Author**: Principal System Architect  
**Date**: January 11, 2026  
**Version**: 1.0

---

## 1. System Overview

Coffee Craft monetization system consists of four primary subsystems:

1. **Coffee Bean Marketplace** - Discovery, recommendation, and purchase of specialty coffee beans
2. **Course System** - Video-based educational content with progress tracking
3. **Subscription Management** - Freemium tier system with feature gating
4. **Premium Features** - Equipment comparison, favorites, and coffee journal

---

## 2. Database Schema

### 2.1 Coffee Beans

```typescript
interface CoffeeBean {
  id: string;
  name: string;
  roaster: string;
  origin: string; // e.g., "Ethiopia", "Colombia", "Kenya"
  region?: string; // e.g., "Yirgacheffe", "Huila"
  process: 'washed' | 'natural' | 'honey' | 'anaerobic';
  roastLevel: 'light' | 'medium-light' | 'medium' | 'medium-dark' | 'dark';
  
  // Flavor Profile
  flavorNotes: string[]; // e.g., ["blueberry", "chocolate", "citrus"]
  tasteProfile: {
    acidity: number; // 1-10
    body: number; // 1-10
    sweetness: number; // 1-10
    bitterness: number; // 1-10
  };
  
  // Product Details
  price: number; // per 250g bag
  weight: number; // grams
  description: string;
  image: any; // require() import
  
  // Compatibility
  brewMethods: ('espresso' | 'filter' | 'french-press' | 'moka-pot' | 'cold-brew')[];
  recommendedFor: string[]; // e.g., ["beginners", "espresso-lovers", "fruity-notes"]
  
  // Purchase
  affiliateUrl: string; // Direct to roaster or marketplace
  inStock: boolean;
  rating: number; // 1-5
  reviewCount: number;
}
```

### 2.2 Courses

```typescript
interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: number; // minutes
  level: 'beginner' | 'intermediate' | 'advanced';
  category: 'brewing' | 'latte-art' | 'espresso' | 'equipment' | 'roasting';
  
  // Content
  thumbnail: any; // require() import
  heroImage: any;
  modules: CourseModule[];
  
  // Access Control
  tier: 'free' | 'enthusiast' | 'pro'; // Minimum tier required
  
  // Metadata
  enrolledCount: number;
  rating: number;
  reviewCount: number;
  certificateAvailable: boolean;
}

interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

interface CourseLesson {
  id: string;
  title: string;
  duration: number; // seconds
  videoUrl: string; // For MVP, use placeholder or demo videos
  description: string;
  resources?: {
    title: string;
    url: string;
  }[];
}
```

### 2.3 User Progress

```typescript
interface UserProgress {
  userId: string;
  
  // Course Progress
  courseProgress: {
    [courseId: string]: {
      enrolledAt: Date;
      lastAccessedAt: Date;
      completedLessons: string[]; // lesson IDs
      currentLesson: string; // lesson ID
      completionPercentage: number;
      certificateEarned: boolean;
    };
  };
  
  // Coffee Journal
  brewLogs: BrewLog[];
  
  // Favorites
  favoriteCoffees: string[]; // coffee IDs
  favoriteMachines: string[]; // machine IDs
  favoriteGrinders: string[]; // grinder IDs
  favoriteArticles: string[]; // article IDs
  favoriteBeans: string[]; // bean IDs
}

interface BrewLog {
  id: string;
  date: Date;
  coffeeType: string; // e.g., "espresso", "cappuccino"
  beanId?: string;
  machineId?: string;
  grinderId?: string;
  
  // Parameters
  coffeeAmount: number; // grams
  waterAmount: number; // ml
  waterTemp: number; // celsius
  brewTime: number; // seconds
  grindSize: string; // e.g., "fine", "medium-fine"
  
  // Evaluation
  rating: number; // 1-5
  notes: string;
  flavorNotes: string[];
  
  // Photos
  photos?: string[]; // URIs
}
```

### 2.4 Subscription

```typescript
interface UserSubscription {
  userId: string;
  tier: 'free' | 'enthusiast' | 'pro' | 'lifetime';
  status: 'active' | 'trial' | 'expired' | 'cancelled';
  
  // Billing
  startDate: Date;
  expiryDate?: Date;
  trialEndsAt?: Date;
  billingCycle: 'monthly' | 'annual' | 'lifetime';
  price: number;
  
  // Payment
  paymentMethod?: 'apple-pay' | 'google-pay' | 'stripe';
  lastPaymentDate?: Date;
  nextBillingDate?: Date;
  
  // Features
  features: {
    unlimitedArticles: boolean;
    equipmentComparison: boolean;
    favorites: boolean;
    coffeeJournal: boolean;
    courses: boolean;
    adFree: boolean;
    cafeFinderPremium: boolean;
    aiRecommendations: boolean;
  };
}
```

---

## 3. API Endpoints

### 3.1 Coffee Bean Marketplace

```typescript
// GET /api/beans - Get all beans with optional filters
interface GetBeansRequest {
  roaster?: string;
  origin?: string;
  roastLevel?: string;
  minPrice?: number;
  maxPrice?: number;
  flavorNotes?: string[]; // filter by flavor notes
  brewMethod?: string;
  limit?: number;
  offset?: number;
}

// GET /api/beans/:id - Get bean details
// POST /api/beans/recommend - Get personalized bean recommendations
interface RecommendBeansRequest {
  userPreferences: {
    preferredRoasters?: string[];
    flavorProfile?: {
      acidity?: number;
      body?: number;
      sweetness?: number;
    };
    flavorNotes?: string[]; // e.g., ["fruity", "chocolate", "nutty"]
    brewMethods?: string[];
    budget?: { min: number; max: number };
  };
  limit?: number;
}

// POST /api/beans/wizard - Flavor profile wizard results
interface BeanWizardRequest {
  step1: 'brand' | 'flavor'; // User chooses brand loyalty or flavor exploration
  step2Brand?: string[]; // If brand: selected roasters
  step2Flavor?: string[]; // If flavor: selected flavor notes
  brewMethod?: string;
  budget?: { min: number; max: number };
}
```

### 3.2 Course System

```typescript
// GET /api/courses - Get all courses
interface GetCoursesRequest {
  category?: string;
  level?: string;
  tier?: string; // Filter by access tier
  limit?: number;
  offset?: number;
}

// GET /api/courses/:id - Get course details with modules and lessons
// POST /api/courses/:id/enroll - Enroll in course
// GET /api/courses/:id/progress - Get user progress for course
// POST /api/courses/:courseId/lessons/:lessonId/complete - Mark lesson complete
// POST /api/courses/:id/certificate - Generate completion certificate
```

### 3.3 Subscription Management

```typescript
// GET /api/subscription - Get user subscription status
// POST /api/subscription/upgrade - Upgrade subscription tier
interface UpgradeSubscriptionRequest {
  tier: 'enthusiast' | 'pro' | 'lifetime';
  billingCycle: 'monthly' | 'annual' | 'lifetime';
  paymentMethod: 'apple-pay' | 'google-pay' | 'stripe';
}

// POST /api/subscription/cancel - Cancel subscription
// POST /api/subscription/trial - Start free trial
// GET /api/subscription/features - Get available features for current tier
```

### 3.4 Premium Features

```typescript
// POST /api/favorites/add - Add item to favorites
interface AddFavoriteRequest {
  type: 'coffee' | 'machine' | 'grinder' | 'article' | 'bean';
  itemId: string;
}

// DELETE /api/favorites/:type/:itemId - Remove from favorites
// GET /api/favorites - Get all favorites

// POST /api/journal/log - Create brew log
// GET /api/journal/logs - Get all brew logs
// GET /api/journal/stats - Get brewing statistics and analytics

// POST /api/compare - Compare equipment
interface CompareEquipmentRequest {
  type: 'machine' | 'grinder';
  itemIds: string[]; // max 3
}
```

---

## 4. Feature Gating Logic

### 4.1 Subscription Tiers

| Feature | Free | Enthusiast | Pro | Lifetime |
|---------|------|------------|-----|----------|
| Learning Articles | 3 per category | All | All | All |
| Coffee Database | View only | View only | View only | View only |
| Equipment Browse | View only | View only | View only | View only |
| Brewing Timer | 3 presets | Unlimited | Unlimited | Unlimited |
| Café Finder | View only | With directions | With directions | With directions |
| Bean Marketplace | Browse only | Browse + Purchase | Browse + Purchase | Browse + Purchase |
| Equipment Comparison | No | Up to 3 items | Unlimited | Unlimited |
| Favorites | No | Unlimited | Unlimited | Unlimited |
| Coffee Journal | No | Basic (50 logs) | Unlimited | Unlimited |
| Courses | No | Enthusiast tier courses | All courses | All courses |
| Ad-Free | No | Yes | Yes | Yes |
| AI Recommendations | No | No | Yes | Yes |
| Certificates | No | No | Yes | Yes |
| Expert Q&A | No | No | Monthly | Monthly |

### 4.2 Paywall Implementation

```typescript
// hooks/use-subscription.ts
export function useSubscription() {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  
  const hasFeature = (feature: keyof UserSubscription['features']) => {
    return subscription?.features[feature] ?? false;
  };
  
  const canAccessCourse = (course: Course) => {
    if (course.tier === 'free') return true;
    if (course.tier === 'enthusiast') return ['enthusiast', 'pro', 'lifetime'].includes(subscription?.tier ?? 'free');
    if (course.tier === 'pro') return ['pro', 'lifetime'].includes(subscription?.tier ?? 'free');
    return false;
  };
  
  const showPaywall = (feature: string) => {
    // Navigate to paywall screen with feature context
    router.push(`/paywall?feature=${feature}`);
  };
  
  return { subscription, hasFeature, canAccessCourse, showPaywall };
}
```

---

## 5. Coffee Bean Wizard Flow

### Step 1: Brand vs Flavor
**Question**: "How do you choose your coffee?"
- Option A: "I have favorite roasters/brands" → Go to Step 2A
- Option B: "I explore by flavor and taste" → Go to Step 2B

### Step 2A: Brand Selection
**Question**: "Which roasters do you love?"
- Multi-select list of popular roasters:
  - Blue Bottle Coffee
  - Intelligentsia
  - Counter Culture
  - Stumptown
  - La Colombe
  - Local roasters (user can add)
- Button: "Show me beans from these roasters"

### Step 2B: Flavor Selection
**Question**: "What flavors excite you?"
- Multi-select flavor categories with icons:
  - 🍫 Chocolate & Nutty (cocoa, hazelnut, almond)
  - 🍓 Fruity & Bright (berry, citrus, tropical)
  - 🌸 Floral & Tea-like (jasmine, bergamot, delicate)
  - 🍮 Sweet & Caramel (brown sugar, honey, vanilla)
  - 🌿 Earthy & Spicy (tobacco, cedar, cinnamon)
- Button: "Find my perfect beans"

### Step 3: Results
- Display personalized bean recommendations
- Filter by brew method (espresso, filter, etc.)
- Sort by match score, price, or rating
- Each bean card shows:
  - Roaster & origin
  - Flavor notes
  - Match percentage
  - Price & "Buy Now" CTA

---

## 6. Course Curriculum Design

### Course 1: Brewing Mastery (Enthusiast Tier)
**Duration**: 2 hours | **Modules**: 4 | **Lessons**: 12

**Module 1: Foundation**
1. Understanding Coffee Extraction (10 min)
2. Water Quality & Temperature (8 min)
3. Grind Size Fundamentals (12 min)

**Module 2: Pour Over Techniques**
4. V60 Brewing Method (15 min)
5. Chemex Brewing Method (12 min)
6. Kalita Wave Brewing Method (10 min)

**Module 3: Immersion Brewing**
7. French Press Mastery (10 min)
8. AeroPress Techniques (15 min)
9. Cold Brew Perfection (8 min)

**Module 4: Troubleshooting**
10. Diagnosing Extraction Issues (12 min)
11. Adjusting for Taste (10 min)
12. Recipe Development (15 min)

### Course 2: Latte Art Fundamentals (Pro Tier)
**Duration**: 1.5 hours | **Modules**: 3 | **Lessons**: 9

**Module 1: Milk Steaming**
1. Understanding Milk Science (8 min)
2. Steaming Technique (15 min)
3. Microfoam Texture (10 min)

**Module 2: Basic Patterns**
4. The Heart (12 min)
5. The Tulip (15 min)
6. The Rosetta (18 min)

**Module 3: Advanced Techniques**
7. Contrast & Definition (10 min)
8. Multi-Layer Pours (12 min)
9. Free Pour Art (15 min)

### Course 3: Espresso Dialing In (Pro Tier)
**Duration**: 2.5 hours | **Modules**: 5 | **Lessons**: 15

**Module 1: Espresso Theory**
1. What is Espresso? (10 min)
2. Pressure & Flow Profiling (15 min)
3. The Espresso Compass (12 min)

**Module 2: Equipment Setup**
4. Machine Calibration (10 min)
5. Grinder Alignment (15 min)
6. Portafilter Prep (8 min)

**Module 3: Dialing Process**
7. Dose & Yield Ratios (12 min)
8. Time & Temperature (10 min)
9. Taste Evaluation (15 min)

**Module 4: Advanced Techniques**
10. Pre-Infusion (10 min)
11. Pressure Profiling (18 min)
12. Temperature Surfing (12 min)

**Module 5: Troubleshooting**
13. Channeling Solutions (15 min)
14. Consistency Techniques (12 min)
15. Recipe Adaptation (15 min)

### Course 4: Equipment Maintenance (Enthusiast Tier)
**Duration**: 1 hour | **Modules**: 3 | **Lessons**: 8

**Module 1: Daily Maintenance**
1. Espresso Machine Cleaning (10 min)
2. Grinder Cleaning (8 min)
3. Accessory Care (6 min)

**Module 2: Deep Cleaning**
4. Backflushing (10 min)
5. Descaling (12 min)
6. Burr Replacement (10 min)

**Module 3: Troubleshooting**
7. Common Issues (8 min)
8. When to Service (6 min)

---

## 7. Technical Implementation Notes

### 7.1 Video Hosting
For MVP, use placeholder video URLs or demo videos. Production should use:
- **Option 1**: Vimeo Pro (privacy controls, no ads, good player)
- **Option 2**: AWS S3 + CloudFront (full control, HLS streaming)
- **Option 3**: Mux (video infrastructure as a service)

### 7.2 Payment Integration
- **iOS**: Use StoreKit 2 for in-app purchases
- **Android**: Use Google Play Billing Library
- **Web**: Use Stripe Checkout
- **Wrapper**: RevenueCat for cross-platform subscription management

### 7.3 AsyncStorage Schema
```typescript
// @storage/subscription
{
  tier: string;
  expiryDate: string;
  features: object;
}

// @storage/favorites
{
  coffees: string[];
  machines: string[];
  grinders: string[];
  articles: string[];
  beans: string[];
}

// @storage/journal
{
  logs: BrewLog[];
  lastSync: string;
}

// @storage/courseProgress
{
  [courseId]: {
    completedLessons: string[];
    currentLesson: string;
    lastAccessed: string;
  }
}
```

### 7.4 Offline Support
- Cache course videos for offline viewing (Pro tier feature)
- Sync brew logs when back online
- Cache bean data for offline browsing
- Store favorites locally with sync

---

## 8. UI/UX Design Principles

### 8.1 Bean Marketplace
- **Hero Section**: Featured roaster of the month
- **Wizard CTA**: Prominent "Find Your Perfect Bean" button
- **Browse Grid**: 2-column card layout with bean images
- **Filters**: Sticky filter bar (roaster, origin, flavor, price)
- **Bean Card**: Image, roaster, origin, flavor notes, price, CTA

### 8.2 Course Library
- **Hero Section**: Featured course with progress indicator
- **Category Tabs**: Horizontal scroll (Brewing, Latte Art, Espresso, Equipment)
- **Course Cards**: Thumbnail, title, instructor, duration, level, rating
- **Progress Indicator**: Circular progress ring on enrolled courses
- **Lock Icon**: For courses requiring higher tier

### 8.3 Paywall
- **Trigger**: When user taps locked content
- **Design**: Full-screen modal with blur background
- **Content**: 
  - Feature highlight (what they're trying to access)
  - Tier comparison table
  - Benefits list with checkmarks
  - Pricing cards with "Start Free Trial" CTA
  - "Restore Purchases" link at bottom

### 8.4 Coffee Journal
- **Log Entry**: Quick-add FAB button
- **Timeline View**: Reverse chronological list of brew logs
- **Log Card**: Date, coffee type, rating, photo thumbnail, notes preview
- **Analytics Tab**: Charts (brews per day, favorite coffees, rating trends)
- **Export**: Share as PDF or CSV

---

## 9. Performance Considerations

### 9.1 Image Optimization
- Use `expo-image` with caching
- Generate thumbnails for bean/course images
- Lazy load images in lists
- Use `contentFit="cover"` with proper aspect ratios

### 9.2 Data Loading
- Implement pagination for bean/course lists (20 items per page)
- Cache API responses with TTL
- Use optimistic UI updates for favorites/journal
- Prefetch next page on scroll

### 9.3 Video Performance
- Use adaptive bitrate streaming (HLS)
- Cache video metadata
- Preload next lesson in background
- Show buffering indicator

---

## 10. Analytics & Metrics

### 10.1 Key Metrics to Track
- **Conversion**: Free → Paid conversion rate
- **Retention**: Day 7, Day 30 retention
- **Engagement**: Course completion rate, journal entries per user
- **Revenue**: MRR, ARPU, LTV
- **Marketplace**: Bean click-through rate, purchase conversion

### 10.2 Events to Track
- `paywall_viewed` - User sees paywall
- `trial_started` - User starts free trial
- `subscription_purchased` - User completes purchase
- `course_enrolled` - User enrolls in course
- `lesson_completed` - User completes lesson
- `bean_purchased` - User clicks affiliate link
- `journal_entry_created` - User logs brew
- `favorite_added` - User adds favorite

---

## 11. Security & Privacy

### 11.1 Data Protection
- Encrypt sensitive data in AsyncStorage
- Use HTTPS for all API calls
- Implement certificate pinning for production
- Sanitize user inputs

### 11.2 Subscription Validation
- Verify receipts server-side (iOS/Android)
- Implement grace period for failed payments
- Handle subscription status changes (upgrade/downgrade/cancel)
- Prevent subscription fraud

### 11.3 Privacy
- Clear privacy policy for data collection
- Allow users to export/delete their data
- Don't track users without consent
- Comply with GDPR/CCPA

---

## 12. Deployment Strategy

### Phase 1: MVP (Week 1-2)
- Bean marketplace with wizard (mock data)
- 2 courses with placeholder videos
- Subscription tiers (no payment, just UI)
- Favorites system

### Phase 2: Beta (Week 3-4)
- Real bean data (10-20 beans)
- 4 complete courses with real videos
- Payment integration (iOS/Android)
- Coffee journal

### Phase 3: Launch (Week 5-6)
- 50+ beans from multiple roasters
- 6+ courses
- Equipment comparison
- Analytics dashboard
- Marketing materials

### Phase 4: Growth (Month 2+)
- B2B features (coffee shop plans)
- Roaster partnerships
- Community features (recipe sharing)
- International expansion

---

## 13. Success Criteria

### Technical
- ✅ All features work offline
- ✅ Video playback smooth (no buffering)
- ✅ App loads in < 2 seconds
- ✅ Subscription flow completes in < 60 seconds
- ✅ No crashes (99.9% crash-free rate)

### Business
- ✅ 5% free → paid conversion rate
- ✅ < 10% monthly churn
- ✅ 4.5+ App Store rating
- ✅ $50K MRR within 6 months
- ✅ 10K+ active users

### User Experience
- ✅ Users complete onboarding (> 80%)
- ✅ Users enroll in courses (> 30%)
- ✅ Users log brews regularly (> 20%)
- ✅ Users purchase beans (> 5%)
- ✅ NPS score > 50

---

**End of System Architecture Document**
