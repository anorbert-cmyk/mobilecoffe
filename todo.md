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


## v9 Real Equipment Data & Image Enhancements
- [x] Research and collect real espresso machines (budget, mid-range, high-end)
- [x] Research and collect real coffee grinders
- [x] Generate header images for all learning articles
- [x] Add real machine images to recommendations
- [x] Add detailed specs to machine cards (price, features, ratings)
- [x] Implement image zoom/modal for coffee detail images
- [ ] Update equipment recommender with real data


## v10 Onboarding Navigation Fix
- [x] Update onboarding completion to navigate to recommendations if wantsToBuyEquipment === true
- [x] Navigate to tab bar (Make Coffee) if wantsToBuyEquipment === false
- [x] Test onboarding flow end-to-end

## v11 Bug Fixes
- [x] Fix grinder layout breaking/falling apart
- [x] Fix equipment images not loading (espresso machines)

## v12 Bug Fix
- [x] Fix coffee composition image not displaying

## v13 Comprehensive Audit Fixes
- [x] Fix learning article header images to use generated images from /assets/images/learning/
- [x] Verify coffee composition SVG renders correctly on all platforms
- [x] Verify equipment images load from Amazon URLs
- [x] Verify grinder layout and all specs display correctly

## v14 Bug Fixes
- [x] Fix grinder detail screen layout issues
- [x] Fix grinder images not displaying properly
- [x] Fix image zoom functionality not working
- [x] Fix learning header images being stretched

## v15 Bug Fix
- [x] Fix recommendations screen showing coffee images instead of machine/grinder images

## v16 Equipment Image Generation
- [x] Generate professional product images for all 10 espresso machines
- [x] Generate professional product images for all 5 grinders
- [x] Update equipment database with generated local image paths
- [x] Verify all equipment images display correctly
- [x] Fix coffee category header images to have perfect aspect ratio without stretching

## v17 Critical Bug Fix
- [x] Fix str.startsWith is not a function error in expo-image on recommendations screen
