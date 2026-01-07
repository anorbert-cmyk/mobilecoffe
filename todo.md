# Project TODO

## Core Setup
- [x] Update theme colors to coffee-inspired palette
- [x] Configure 3-tab navigation (Make, Find, Learn)
- [x] Add tab icons to icon-symbol.tsx
- [x] Copy generated coffee images to assets folder

## Make Coffee Section
- [x] Create CoffeeListScreen with 2-column grid
- [x] Create CoffeeDetailScreen with recipe tabs
- [x] Add coffee data (recipes from research)
- [x] Implement timer functionality
- [x] Add step-by-step brewing instructions

## Find Coffee Section
- [x] Create CafeListScreen with single-column cards
- [x] Implement location permission request
- [x] Use production-like demo data for nearby cafes (Google Places API ready for future)
- [x] Add cafe detail view with navigation

## Learn Coffee Section
- [x] Create LearnHomeScreen with category cards
- [x] Add learning content (brewing basics, roast levels, etc.)
- [x] Create ArticleScreen for reading content

## Branding
- [x] Generate custom app logo
- [x] Update app.config.ts with branding
- [x] Copy logo to required asset locations

## Polish
- [x] Test all user flows
- [x] Verify dark mode support
- [x] Check accessibility

## v2 Premium Update
- [x] Research iOS 26 design trends and HIG updates
- [x] Create premium color palette with WCAG AA compliance
- [x] Implement Liquid Glass / translucent effects
- [x] Add smooth animations and micro-interactions
- [x] Modernize typography with SF Pro Display
- [x] Update all screens with premium design
- [x] Ensure minimum AA contrast ratios for all text

## Machine Settings Feature
- [x] Create machine database (espresso machines, grinders)
- [x] Build machine selection screen with search
- [x] Create machine detail screen with optimal settings
- [x] Add grind size recommendations per machine
- [x] Include maintenance tips and schedules
- [x] Link machine settings to coffee recipes

## Accessibility (WCAG AA)
- [x] Verify 4.5:1 contrast ratio for normal text
- [x] Verify 3:1 contrast ratio for large text
- [x] Add proper accessibility labels
- [x] Ensure touch targets are minimum 44x44pt
- [ ] Test with VoiceOver (manual testing required)

## v3 Onboarding & Personalization
- [x] Research onboarding UX psychology and best practices
- [x] Generate high-quality illustrations for onboarding screens
- [x] Create onboarding wizard with experience level selection
- [x] Implement "Want to buy a machine?" flow for beginners
- [x] Add budget selection step
- [x] Add purpose/goal selection step
- [x] Create personalized machine recommendations
- [x] Save user profile to AsyncStorage
- [x] Show/skip onboarding based on first launch
- [x] Integrate onboarding with main app navigation
- [x] Create profile screen for viewing/editing preferences
- [x] Create recommendations screen with equipment suggestions

## v4 UX Improvements
- [x] Redesign welcome screen with premium, eye-catching design
- [x] Add back navigation to all onboarding steps
- [x] Create Profile tab with settings and preferences
- [x] Add "Buy/Upgrade Equipment" menu in Profile
- [x] Create modern equipment wizard accessible from Profile
- [x] Ensure all screens have back button navigation
- [x] Make equipment flow restartable anytime from Profile
- [x] Generate new premium welcome illustration

## Future Enhancements
- [ ] Google Places API integration for real cafe data
- [ ] User favorites/bookmarks
- [ ] Brewing timer with notifications
- [ ] Cloud sync for user data


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
