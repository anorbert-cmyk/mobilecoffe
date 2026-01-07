# Coffee Craft - Mobile App Interface Design

## Design Philosophy

This app follows **Apple Human Interface Guidelines (HIG)** to feel like a first-party iOS app. The design assumes **mobile portrait orientation (9:16)** and **one-handed usage**.

---

## Screen List

### Tab Navigation (Bottom)
1. **Make** - Coffee recipes and brewing guides
2. **Find** - Nearby specialty cafes
3. **Learn** - Coffee education content

### Make Coffee Section
- **CoffeeListScreen** - 2-column grid of coffee types with images
- **CoffeeDetailScreen** - Full recipe with tabs (Recipe, About, Nearby)

### Find Coffee Section
- **CafeListScreen** - Single-column list of nearby specialty cafes
- **CafeDetailScreen** - Cafe details with map, reviews, amenities

### Learn Coffee Section
- **LearnHomeScreen** - Categories of learning content
- **ArticleScreen** - Individual learning article

---

## Primary Content and Functionality

### Make Coffee Tab
| Screen | Content | Functionality |
|--------|---------|---------------|
| CoffeeListScreen | 2-column grid with coffee images, names | Tap to view recipe |
| CoffeeDetailScreen | Hero image, recipe details, tabs | Timer, step-by-step guide |

**Coffee Types Included:**
- Espresso, Double Espresso, Ristretto, Lungo
- Flat White, Cappuccino, Latte, Latte Macchiato
- Macchiato, Americano, Cortado
- Moka Pot Coffee

**Recipe Details:**
- Input (grams of coffee)
- Output (ml/grams)
- Extraction time
- Milk ratio (for milk drinks)
- Step-by-step instructions
- Timer functionality

### Find Coffee Tab
| Screen | Content | Functionality |
|--------|---------|---------------|
| CafeListScreen | Cafe cards with image, name, rating, distance | Tap to view details |
| CafeDetailScreen | Full info, photos, reviews | Navigate, call, website |

**Cafe Card Info:**
- Large hero image
- Cafe name
- Google rating (stars)
- Distance from user
- Quick tags (WiFi, Card payment, Accessible)

### Learn Coffee Tab
| Screen | Content | Functionality |
|--------|---------|---------------|
| LearnHomeScreen | Category cards | Tap to browse articles |
| ArticleScreen | Rich text content | Read, bookmark |

**Learning Categories:**
- Brewing Basics
- Coffee Bean Types
- Roast Levels
- Equipment Guide
- Home Setup

---

## Key User Flows

### Flow 1: Make a Flat White
1. User opens app → Make tab (default)
2. Scrolls 2-column grid → Taps "Flat White" card
3. Views hero image with measurement indicators
4. Reads recipe: 18g espresso → 36g output + 110ml steamed milk
5. Taps "Start Timer" → Timer counts extraction time
6. Follows step-by-step milk steaming guide

### Flow 2: Find Nearby Cafe
1. User taps "Find" tab
2. App requests location permission (if needed)
3. Shows list of nearby specialty cafes sorted by distance
4. User taps cafe card → Views full details
5. Taps "Navigate" → Opens Maps app with directions

### Flow 3: Learn About Roast Levels
1. User taps "Learn" tab
2. Sees category cards → Taps "Roast Levels"
3. Reads article about light, medium, dark roasts
4. Can bookmark for later reference

---

## Color Choices

### Brand Colors
| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| primary | #8B4513 | #D2691E | Accent, buttons, active states |
| background | #FFFAF5 | #1A1412 | Screen backgrounds (warm cream/dark brown) |
| surface | #FFF5EB | #2A2220 | Cards, elevated surfaces |
| foreground | #2C1810 | #F5E6D3 | Primary text |
| muted | #8B7355 | #A89080 | Secondary text |
| border | #E8DDD0 | #3D3230 | Dividers, card borders |
| success | #4A7C59 | #6B9B7A | Success states |
| warning | #C4A35A | #D4B86A | Warning states |
| error | #B54545 | #D66666 | Error states |

### Color Rationale
- **Warm cream background** evokes coffee shop ambiance
- **Brown primary** reflects coffee bean colors
- **High contrast** ensures readability
- **Muted earth tones** feel premium and sophisticated

---

## Typography

- **Headlines:** SF Pro Display Bold (iOS) / System Bold
- **Body:** SF Pro Text Regular
- **Numbers/Data:** SF Pro Mono (for measurements)

---

## Component Patterns

### Coffee Card (2-column grid)
```
┌─────────────────┐
│   [Image]       │
│                 │
├─────────────────┤
│ Flat White      │
│ Double shot     │
└─────────────────┘
```

### Cafe Card (single column)
```
┌─────────────────────────────────────┐
│         [Large Hero Image]          │
├─────────────────────────────────────┤
│ Cafe Name                    ★ 4.8  │
│ 0.3 km away                         │
│ [WiFi] [Card] [Accessible]          │
└─────────────────────────────────────┘
```

### Recipe Detail Screen
```
┌─────────────────────────────────────┐
│         [Hero Image with            │
│          measurement indicators]    │
├─────────────────────────────────────┤
│ Flat White                          │
│ ─────────────────────────────────── │
│ [Recipe] [About] [Nearby]    ← tabs │
├─────────────────────────────────────┤
│                                     │
│ ☕ Input:  18g ground coffee        │
│ 📊 Output: 36g espresso             │
│ ⏱️ Time:   25-30 seconds            │
│ 🥛 Milk:   110ml steamed            │
│                                     │
│ ─────────────────────────────────── │
│                                     │
│ Steps:                              │
│ 1. Grind 18g coffee fine            │
│ 2. Distribute and tamp evenly       │
│ 3. Extract 36g in 25-30 sec         │
│ 4. Steam 110ml milk to 65°C         │
│ 5. Pour with thin microfoam         │
│                                     │
│ [  ▶️ Start Timer  ]                │
│                                     │
└─────────────────────────────────────┘
```

---

## Spacing & Layout

- **Screen padding:** 16px horizontal
- **Card gap:** 12px
- **Section spacing:** 24px
- **Tab bar height:** 56px + safe area
- **Touch targets:** Minimum 44x44px

---

## Animations & Interactions

- **Card press:** Scale 0.97 + opacity 0.9
- **Tab switch:** Cross-fade 200ms
- **Timer:** Pulse animation on active
- **Pull to refresh:** Standard iOS spring

---

## Accessibility

- All images have descriptive alt text
- Minimum contrast ratio 4.5:1
- VoiceOver labels on all interactive elements
- Dynamic Type support
