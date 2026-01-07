# iOS 26 Liquid Glass Design System Research

## Key Design Principles

### 1. Liquid Glass Material
- Translucent, reactive design that animates and responds to touch
- Creates functional layer floating above content
- Brings structure and clarity without stealing focus
- Reflects navigation focus through subtle material variation

### 2. Typography Updates
- Bolder text for improved readability
- Left-aligned for clarity in key moments (alerts, onboarding)
- Strengthened structure and hierarchy

### 3. Shape System (Concentricity)
Three shape types for concentric layouts:
- **Fixed shapes**: Constant corner radius
- **Capsules**: Radius = half the height of container
- **Concentric shapes**: Radius calculated by subtracting padding from parent

### 4. Color System
- Adjusted colors for Light, Dark, and Increased Contrast
- Work in harmony with Liquid Glass
- Improved hue differentiation
- Maintains optimistic Apple spirit

### 5. Control Sizes
- Mini, Small, Medium: Rounded rectangles (compact layouts)
- Large: Capsule shapes
- X-Large: New size with Liquid Glass emphasis

## Implementation Guidelines

### Visual Harmony
- Interface elements should complement system's rhythm
- Avoid corners that feel too pinched or flared
- Use concentric shapes for nested containers

### Navigation & Focus
- Action sheets spring from their source element
- Dimming layer for modal interruptions
- Subtle material variation for navigation depth
- Liquid Glass lifts navigational controls

### Accessibility Considerations
- Increased Contrast appearance support
- Clear separation between UI layers
- Maintain WCAG AA compliance (4.5:1 for normal text, 3:1 for large text)

## Premium Design Elements for Coffee Craft

### Color Palette (WCAG AA Compliant)
- Primary: Rich espresso brown with sufficient contrast
- Background: Warm cream/off-white
- Surface: Translucent glass effect
- Text: High contrast dark on light

### Typography
- SF Pro Display for headers (bold, left-aligned)
- SF Pro Text for body content
- Increased font weights for hierarchy

### Components
- Capsule-shaped buttons for primary actions
- Concentric card layouts
- Floating tab bar with glass effect
- Smooth spring animations
