# Project TODO

## Core Setup
- [x] Initialize Expo project with React Native
- [x] Configure NativeWind (Tailwind CSS)
- [x] Set up coffee-themed color palette
- [x] Create 3-tab navigation (Make, Find, Learn)
- [x] Generate app icon and branding

## Make Coffee Section
- [x] Create CoffeeListScreen with 2-column grid
- [x] Add AI-generated coffee images with measurements
- [x] Create CoffeeDetailScreen with recipe
- [x] Add timer functionality
- [x] Include step-by-step instructions
- [x] Add Moka pot recipes

## Find Coffee Section
- [x] Create CafeListScreen with single-column cards
- [x] Implement location permission request
- [x] Use production-like demo data for nearby cafes (Google Places API ready for future)
- [x] Add cafe detail view with navigation

## Learn Coffee Section
- [x] Create LearnHomeScreen with category cards
- [x] Add brewing basics articles
- [x] Add roast levels guide
- [x] Add coffee origins information
- [x] Add equipment guide
- [x] Add home setup tips

## v2 Premium Update
- [x] Research iOS 26 design trends and Liquid Glass
- [x] Create premium color palette with WCAG AA
- [x] Build Glass component with blur effects
- [x] Build PremiumCard and PremiumButton components
- [x] Modernize all screens with premium design

## v3 Onboarding & Personalization
- [x] Research onboarding psychology
- [x] Generate premium onboarding illustrations
- [x] Create multi-step onboarding wizard
- [x] Add experience level selection
- [x] Add equipment interest questions
- [x] Add budget and purpose selection
- [x] Create UserProfileProvider with AsyncStorage
- [x] Build equipment recommender system
- [x] Create recommendations screen

## v4 UX Improvements
- [x] Redesign welcome screen with premium hero
- [x] Add back navigation to all screens
- [x] Create Profile tab with settings
- [x] Add "Buy Equipment" wizard accessible from Profile
- [x] Improve navigation consistency

## v5 Make Coffee Apple-Quality Redesign
- [x] Research Apple app design patterns (App Store, Music, Fitness+)
- [x] Redesign Make Coffee screen with Apple-quality layout
- [x] Add featured/hero section at top
- [x] Implement horizontal scrolling categories
- [x] Add large card design with rich visuals
- [x] Polish animations and transitions

## v6 Apple HIG Compliance Audit
- [x] Audit all screens for back button navigation
- [x] Update tab bar to iOS 26 style (Liquid Glass)
- [x] Ensure consistent navigation patterns
- [x] Add back buttons to all detail/sub screens
- [x] Verify swipe-to-go-back gesture support
- [x] Check tab bar icon sizes and spacing per HIG

## v7 Dark Mode Toggle
- [x] Extend ThemeProvider with manual theme switching
- [x] Create theme selector UI in Profile screen (Light/Dark/Auto)
- [x] Persist theme preference to AsyncStorage
- [x] Add smooth transition animation between themes
- [x] Test dark mode across all screens

## v8 Complete UX Overhaul
### Sprint 1 - Layout & Recommendations
- [x] Fix card layout issues (spacing, consistent sizes)
- [x] Fix text truncation on cards
- [x] Fix horizontal scroll edge clipping
- [x] Create premium recommendation cards UI
- [x] Add match percentage to recommendations
- [x] Implement basic button press microinteractions
- [x] Add card tap lift effect
- [x] Add haptic feedback to interactions

### Sprint 2 - Content & Visualization
- [x] Redesign Learn article layout with hero images
- [x] Add pull quotes to articles
- [x] Add tip boxes for important information
- [x] Improve typography hierarchy
- [x] Create interactive coffee ratio visualization
- [x] Add SVG layer diagram to coffee detail
- [x] Implement advanced tab crossfade animation
- [x] Add staggered list entrance animations
- [x] Add pull-to-refresh custom animation

## Future Enhancements
- [ ] Add favorites functionality with AsyncStorage
- [ ] Integrate Google Places API for real cafe data
- [ ] Add push notifications for brewing timers
- [ ] Add reading progress indicator for Learn articles
- [ ] Add comparison view for machines
- [ ] Add pull-to-refresh on cafe list
