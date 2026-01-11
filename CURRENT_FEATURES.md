# Coffee Craft - Current Features Inventory

## Core Features

### 1. Personalized Quiz & Recommendations
- **Location**: Onboarding flow
- **Function**: 30-second quiz about brewing preferences, experience level, budget
- **Output**: Personalized equipment recommendations (machines + grinders) with match scores

### 2. Coffee Database
- **12+ Coffee Types**: Espresso, Cappuccino, Latte, Americano, Flat White, Macchiato, Mocha, Cortado, Affogato, Cold Brew, Iced Coffee, Moka Pot Coffee
- **Each coffee includes**:
  - Hero image with zoom functionality
  - Coffee composition visualization (espresso/milk/foam/water ratios)
  - Detailed description
  - Flavor profile
  - Brewing instructions with parameters (coffee amount, water amount, temperature, time)
  - Difficulty level
  - Origin story

### 3. Equipment Guide
- **10 Espresso Machines**: From budget ($200) to premium ($3000+)
  - Breville Bambino Plus, Gaggia Classic Pro, DeLonghi Stilosa, Breville Barista Express Impress, Breville Barista Pro, Rancilio Silvia, DeLonghi Specialista Touch, Lelit MaraX, Breville Oracle Jet, Breville Dual Boiler
- **5 Coffee Grinders**: From entry-level ($140) to high-end ($700)
  - Baratza Encore ESP, Baratza Sette 270, Eureka Mignon Specialita, Niche Zero, Baratza Sette 270Wi
- **Each equipment includes**:
  - Professional product images (generated)
  - Detailed specifications
  - Match score based on user preferences
  - Price
  - Rating
  - Amazon purchase links

### 4. Learning Center (11 Articles across 5 categories)
- **Brewing Basics** (3 articles):
  - What is Specialty Coffee?
  - The Importance of Water Quality
  - Grind Size Guide
- **Roast Levels** (2 articles):
  - The Roast Spectrum
  - First and Second Crack
- **Coffee Origins** (2 articles):
  - The Coffee Belt
  - Arabica vs Robusta
- **Equipment Guide** (2 articles):
  - Essential Home Equipment
  - Espresso Machine Guide
- **Home Setup** (2 articles):
  - Setting Up Your Station
  - Buying & Storing Beans
- **Content quality**: Professional barista tone, warm and educational

### 5. Café Finder
- **Function**: Discover specialty coffee shops nearby
- **Features**:
  - List view with café cards
  - Distance from user
  - Rating and specialty indicator
  - Café details (address, hours, specialties)
- **Current data**: Mock data (not real-time)

### 6. Brewing Timer
- **Function**: Step-by-step brewing guide with timer
- **Features**:
  - Multiple brewing methods
  - Visual progress indicator
  - Step-by-step instructions
  - Haptic feedback
  - Completion celebration

### 7. User Profile
- **Current features**:
  - User preferences from quiz
  - Brewing statistics
  - Settings

## Technical Capabilities

### Backend Infrastructure
- **Database**: PostgreSQL with Drizzle ORM
- **User Authentication**: OAuth login, session management
- **File Storage**: S3-compatible storage
- **Push Notifications**: Server-side delivery capability
- **AI/LLM**: Built-in multimodal AI (text, image, audio)

### Data Storage
- **Local**: AsyncStorage for offline data
- **Cloud**: Optional cross-device sync

## Missing Features (Potential Monetization Opportunities)

1. **No favorites/bookmarking system**
2. **No equipment comparison tool**
3. **No real-time café data** (using mock data)
4. **No community features** (reviews, ratings, sharing)
5. **No advanced brewing guides** (video tutorials, advanced techniques)
6. **No coffee bean marketplace**
7. **No subscription tracking** (for coffee bean deliveries)
8. **No barista certification/courses**
9. **No recipe creation/sharing**
10. **No equipment maintenance reminders**
