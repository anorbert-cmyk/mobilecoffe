# Plan: B2B UX Redesign & World-Class UI Polish

> **Goal:** Elevate the application's UI/UX to a "world-class" standard, focusing on a modern floating navigation, unified B2B portal aesthetics, and perfect Cafe Cards.

## 1. Design Strategy

### A. Navigation (The "Floating" Bar)

- **Concept:** Adopt the modern iOS "Floating Platter" style. Instead of a bar stuck to the bottom edge, the navigation floats slightly above the home indicator with rounded corners.
- **Aesthetics:**
  - Background: `BlurView` (Glassmorphism) with high intensity.
  - Shadow: Soft, diffuse shadow for depth (`elevation`).
  - Active State: Icons scale up slightly or have a "pill" background highlighter.
- **Icons:** Switch to a high-quality, consistent set (likely **Lucide React Native**) for crisp, vector lines. "Unique" means distinct visual weight (e.g., 2px stroke) and consistent curvature.

### B. Cafe Cards (The "Perfect" Card)

- **Problem:** Inconsistent "pills" (amenities) and lack of visual hierarchy.
- **New Structure:**
  - **Hero Image:** 4:3 Aspect Ratio (immersive).
  - **Header Overlay:** "Open Now" badge (top-left) + Distance (top-right).
  - **Content Block:**
    - **Title:** H3 Bold (`Inter/SF Pro`).
    - **Metadata Row:** Type (e.g., "Specialty Cafe") • Price (`$$`) • Time.
    - **Pills Row (Scrollable if needed):** "Laptop Friendly", "WiFi", "Pet Friendly" – standardized visual style (muted background, foreground color).
- **Interaction:** `Pressable` with `Scale` animation on press (`useAnimatedStyle`).

### C. B2B Portal Unity

- **Problem:** "Dashboard" screens feel disjointed.
- **Solution:** Create a unified `B2BLayout` wrapper.
  - **Header:** Large, bold titles with consistent padding.
  - **Cards:** Standardized `DashboardCard` component (padding, radius, shadow).
  - **Empty States:** Beautiful, illustrated empty states for "No Jobs" or "No Products".

---

## 2. Technical Decisions

- **Library:** `react-native-reanimated` for all layout transitions and interactions.
- **Icons:** `lucide-react-native` (standardized, customizable).
- **Blur:** `expo-blur` for the glass effect.
- **Routing:** Custom `TabBar` component in `expo-router` using `_layout.tsx`.

---

## 3. Implementation Plan

### Phase 1: Foundation (Design System)

- [ ] Install `lucide-react-native` (if missing).
- [ ] Define `AppIcons` registry to map Lucide icons to semantic names.
- [ ] Create `GlassPanel` reusable component (Blur + Border + Shadow).

### Phase 2: Navigation Evolution

- [ ] Create `FloatingTabBar` component.
  - [ ] Implement `LayoutAnimation` for tab switching.
  - [ ] Add Haptic Feedback (`expo-haptics`) on press.
- [ ] Update `app/b2b/dashboard/_layout.tsx` to use the custom tab bar.

### Phase 3: Cafe Card Redesign

- [ ] Create `CafeCardV2`.
- [ ] Implement Smart Image loading (blurhash placeholder).
- [ ] Standardize "Pills":
  - [ ] Logic to extract amenities (WiFi, Power, etc.).
  - [ ] Render consistently with icons + text.
- [ ] Add "Skeleton" loading state for cards.

### Phase 4: B2B Dashboard Unification

- [ ] Refactor `DashboardOverview`, `Products`, `Jobs` to use `ScreenContainer`.
- [ ] Standardize Title/Header typography.
- [ ] Unify "Add New" buttons (Floating Action Button or Header Button).

---

## 4. Verification Checklist

- [ ] **Visual:** Nav bar floats correctly above Home Indicator on iPhone 14/15/16.
- [ ] **Interaction:** Tab switching feels instant and playful (bouncy).
- [ ] **Consistency:** All Cafe Cards show data in the exact same layout.
- [ ] **Performance:** No JS frame drops during scrolling (using Reanimated).
