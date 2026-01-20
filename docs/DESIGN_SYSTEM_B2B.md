# 🎨 World-Class Design System: CoffeeCraft B2B

## Core Philosophy

**"Elegant Utility"**: A balance between high-end aesthetic (like a lifestyle app) and dense information utility (business dashboard).

## 1. Navigation Strategy (User Request: "Too many items?")

**Current:** Dashboard, Products, Jobs, Plan.
**Proposed:**

- **Remove:** "Plan" (Subscription). This is not an everyday action. Move to "Settings" or "Profile".
- **Keep:**
  1. **Overview** (Home) - Insight at a glance.
  2. **My Cafe** (Was "Products" + "Jobs" merged? Or keep separate?)
     - *Decision:* Keep "Jobs" and "Products" separate for quick access, but visually simplify the tab bar.
     - OR: Merge into "Manage" and have sub-tabs? No, that increases clicks.
     - **Final Decision:** 3 Tabs only. **Home** | **Jobs** | **Menu**. (Renaming "Products" to "Menu" feels more natural for a cafe).
     - "Plan/Subscription" -> Move to Header Avatar / Settings.

## 2. Visual Language

### Typography (Inter)

- **Display:** 32px / 800 (Heavy) - Usage: Page Titles ("Good Morning")
- **Heading:** 20px / 700 (Bold) - Usage: Card Titles
- **Body:** 15px / 500 (Medium) - Usage: Content
- **Caption:** 13px / 600 (SemiBold) - Usage: Badges/Pills

### Colors (Glass & Gradient)

- **Background:** Subtle animated gradient or solid premium color (e.g., `#FAFAFA` light, `#101010` dark).
- **Surface:** `rgba(255,255,255, 0.7)` (Light) / `rgba(30,30,30, 0.6)` (Dark) + **Blur (30px)**.
- **Accents:**
  - **Primary:** `#D97706` (Amber 600) -> Warmth, Coffee.
  - **Success:** `#059669` (Emerald 600) -> Growth, Active Jobs.

### Components ("Pro Max")

1. **Bento Grid Overview:**
    - Stats shouldn't just be numbers. They should be *insights*.
    - "Views" -> Graph sparkline.
    - "Conversion" -> Progress ring.
2. **Action Floating Button (FAB):**
    - Instead of cluttering the header, maybe a unified "Create" FAB?
    - *Decision:* Keep it simple. Standard iOS-style top-right actions are cleaner for B2B.

## 3. Implementation Plan

1. **Refactor Navigation:**
    - Remove "Plan" tab.
    - Rename "Products" -> "Menu".
    - Update icons in `FloatingTabBar`.
2. **Redesign Overview:**
    - Implement "Bento Grid" layout.
    - Add "Greeting" logic (Morning/Afternoon).
3. **Polish interactions:**
    - Entry animations (FadeInDown).
    - Press scales.
