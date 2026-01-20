# CoffeeCraft ☕️
>
> **The Ultimate Full-Stack Coffee Experience.**

![Build Status](https://img.shields.io/badge/build-passing-success)
![Expo SDK](https://img.shields.io/badge/Expo-SDK%2050-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![License](https://img.shields.io/badge/License-MIT-green)

**CoffeeCraft** is a next-generation mobile application bridging the gap between coffee lovers and specialty cafes. Built with a "World-Class" design philosophy, it combines a seamless consumer experience with a powerful B2B Dashboard for cafe owners.

---

## 🚀 Overview

CoffeeCraft redefines the cafe ecosystem. It's not just an ordering app; it's a dual-sided platform designed for scale, performance, and aesthetic perfection.

- **For Customers:** Discover top-rated cafes, order ahead with zero friction, and manage loyalty rewards in a beautiful, parallax-driven interface.
- **For Businesses (B2B):** A dedicated "Manager Mode" featuring real-time analytics, inventory management, and job postings—all wrapped in a stunning glassmorphism UI.

## ✨ Key Features

### 📱 Consumer App (B2C)

- **Immersive Discovery:** Parallax headers and fluid animations make browsing cafes a delight.
- **Smart Ordering:** Seamless flow from product selection to checkout with `tRPC` precision.
- **Loyalty Integration:** Digital stamp cards that actually feel premium.
- **Real-time Updates:** WebSocket-powered order status tracking.

### 💼 Business Dashboard (B2B)

- **Glassmorphism UI:** A dashboard effectively designed with modern blur effects and gradients.
- **Action-First Layout:** "Quick Actions" prioritize what matters: Posting jobs, updating menus, and checking revenue.
- **Visual Menu Manager:** Drag-and-drop simple. High-fidelity visuals for products.
- **Floating Navigation:** A refined, bounce-free tab bar for rock-solid navigation stability.

---

## 🛠️ The Stack

We built CoffeeCraft on a foundation of modern, type-safe technologies. No compromise on performance.

### Core

- **Framework:** [Expo](https://expo.dev/) (React Native) - Managed workflow.
- **Language:** [TypeScript](https://www.typescriptlang.org/) - Strict rendering patterns.
- **Navigation:** [Expo Router v3](https://docs.expo.dev/router/introduction/) - File-based routing.

### Backend & Data

- **API:** [tRPC](https://trpc.io/) - End-to-end type safety without schema duplication.
- **Database:** MySQL (via Railway/PlanetScale).
- **ORM:** [Prisma](https://www.prisma.io/) - Next-gen Node.js and TypeScript ORM.
- **State:** React Query (TanStack) - Server state management.

### UI & Styling

- **Styling:** [NativeWind](https://www.nativewind.dev/) (Tailwind CSS) - Utility-first.
- **Animations:** [Reanimated 3](https://docs.swmansion.com/react-native-reanimated/) - 120fps smooth interactions.
- **Visuals:** [Expo Blur](https://docs.expo.dev/versions/latest/sdk/blur/) & [Skia](https://shopify.github.io/react-native-skia/) - High-performance graphics.

---

## 🏁 Getting Started

Ready to brew some code? Follow these steps to get the environment running locally.

### Prerequisites

- Node.js (LTS recommended)
- pnpm (Preferred) or npm
- iOS Simulator (Mac) or Android Emulator

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-org/coffee-craft.git
   cd coffee-craft
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Set up Environment:**
   Copy the example environment file and configure your API keys.

   ```bash
   cp .env.example .env
   ```

4. **Run the Database (Optional for frontend-only):**

   ```bash
   pnpm db:push
   ```

5. **Start the App:**

   ```bash
   # For iOS
   npx expo run:ios
   
   # For Android
   npx expo run:android
   ```

---

## 📂 Project Structure

```
src/
├── app/                 # Expo Router file-based pages
├── components/          # Shared UI components (GlassPanel, Typography)
├── features/            # Feature-based modules (Auth, B2B, Cafe)
│   ├── b2b-dashboard/   # The Business Logic & Screens
│   └── auth/           # Authentication guards & context
├── lib/                 # Core utilities (tRPC client, API)
└── hooks/               # Global hooks (useColors, useAuth)
```

---

## 🤝 Contributing

We welcome contributions from the community! Whether it's a bug fix or a new feature, feel free to open a PR.

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Crafted with ❤️ and Caffeine by the CoffeeCraft Team.*
