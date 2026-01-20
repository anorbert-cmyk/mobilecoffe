export interface Article {
  id: string;
  title: string;
  content: string;
  readTime: number; // in minutes
}

export interface LearningCategory {
  id: string;
  title: string;
  description: string;
  emoji: string;
  articles: Article[];
}

export const learningCategories: LearningCategory[] = [
  {
    id: 'brewing-basics',
    title: 'Brewing Basics',
    description: 'Learn the fundamentals of making great coffee at home',
    emoji: '☕',
    articles: [
      {
        id: 'what-is-specialty-coffee',
        title: 'What is Specialty Coffee?',
        // 1. Specialty Coffee - The Foundation
        content: `# What is Specialty Coffee?

**It's more than just a buzzword—it's a promise of quality.**

Specialty coffee isn't just a marketing term; it's a measurable standard. It refers to the highest grade of coffee beans, scoring **80 points or above** on a 100-point scale by certified Q Graders.

> "Life is too short for bad coffee."

## The Journey: Farm to Cup

Specialty coffee represents the top 3% of global production. Here's what makes it different from commodity coffee:

### 1. 🏔️ Specific Microclimates
The best beans are grown at high altitudes (1,200-2,000m), where cooler temperatures slow down cherry maturation. This extended growth period allows complex sugars and acids to develop, creating the unique flavor notes we love.

### 2. 🍒 Careful Processing
After harvest, cherries are processed with extreme care.
- **Washed**: Clean, bright, high acidity.
- **Natural**: Dried in the fruit. Jammy, wine-like, sweet.
- **Honey**: A hybrid method. Sweet like honey, balanced.

### 3. 🔥 Artisan Roasting
Specialty roasters don't burn beans to hide defects (looking at you, dark roast chains). They roast to *highlight* the bean's natural character—whether that's Ethiopian jasmine or Colombian caramel.

## Why It Matters

By choosing specialty, you're voting for a better industry:
*   **Traceability**: You know exactly who grew your coffee.
*   **Sustainability**: Farmers are paid premium prices, often 2-3x Fair Trade rates.
*   **Taste**: You'll discover flavors you never knew coffee could have—blueberry, jasmine, earl grey, dark chocolate.

## Your Challenge
        content: `# What is Specialty Coffee?

**It's more than just a buzzword—it's a promise of quality.**

Specialty coffee isn't just a marketing term; it's a measurable standard. It refers to the highest grade of coffee beans, scoring **80 points or above** on a 100-point scale by certified Q Graders.

> "Life is too short for bad coffee."

## The Journey: Farm to Cup

Specialty coffee represents the top 3% of global production. Here's what makes it different from commodity coffee:

### 1. 🏔️ Specific Microclimates
The best beans are grown at high altitudes (1,200-2,000m), where cooler temperatures slow down cherry maturation. This extended growth period allows complex sugars and acids to develop, creating the unique flavor notes we love.

### 2. 🍒 Careful Processing
After harvest, cherries are processed with extreme care.
- **Washed**: Clean, bright, high acidity.
- **Natural**: Dried in the fruit. Jammy, wine-like, sweet.
- **Honey**: A hybrid method. Sweet like honey, balanced.

### 3. 🔥 Artisan Roasting
Specialty roasters don't burn beans to hide defects (looking at you, dark roast chains). They roast to *highlight* the bean's natural character—whether that's Ethiopian jasmine or Colombian caramel.

## Why It Matters

By choosing specialty, you're voting for a better industry:
*   **Traceability**: You know exactly who grew your coffee.
*   **Sustainability**: Farmers are paid premium prices, often 2-3x Fair Trade rates.
*   **Taste**: You'll discover flavors you never knew coffee could have—blueberry, jasmine, earl grey, dark chocolate.

## Your Challenge
Next time you buy beans, look for the **Region** and **Altitude** on the bag. If it's there, you're on the right track.`,
        readTime: 6
      },
      {
        id: 'water-quality',
        title: 'The Importance of Water Quality',
        content: `# Coffee is 98% Water. Don't Ruin It.

**You can buy the best beans in the world, but if your water sucks, your coffee will suck.**

Water acts as the solvent that extracts flavor compounds from the grounds. Ideally, it needs to grab the good stuff (sugars, acids) and leave the bad stuff behind.

## The Chemistry of Good Water

You don't need a PhD, but you should know these two terms:

### 1. Hardness (TDS)
**Target: 75-150 ppm**
- **Too Soft**: Coffee tastes flat, sour, and lacks body (distilled water is a no-go).
- **Too Hard**: Coffee tastes chalky, dull, and mutes the delicate acidity. Plus, it kills your espresso machine with scale.

### 2. Alkalinity (Buffer)
**Target: 40-70 ppm**
- Acts as a buffer against acidity.
- **Too Low**: Coffee tastes sharply sour/acidic.
- **Too High**: Coffee tastes "flat" and boring because the buffer neutralizes the good acids.

## 🚱 The Enemies
1.  **Chlorine**: Tastes chemical/medicinal. Use a carbon filter.
2.  **Odors**: Any smell in the water will end up in the cup.

## Solutions (Ranked)
1.  **Mineral Packets (Third Wave Water)**: The gold standard. Add a packet to distilled water for perfect specs.
2.  **BWT / Peak Water Jug**: Pitchers designed specifically to optimize water for coffee.
3.  **Bottled Spring Water**: Look for "Volvic" or "Crystal Geyser" (check the label for ~150 TDS).
4.  **Carbon Filter (Brita)**: Better than tap, but doesn't fix hardness issues.

> **Pro Tip:** Never use hot tap water for brewing. It picks up heavy metals from pipes. Always heat fresh, cold water.`,
        readTime: 5
      },
      {
        id: 'grind-size-guide',
        title: 'Grind Size Guide',
        content: `# Grind Size: The Secret Variables

**You can buy the best beans and have perfect water, but if your grind is wrong, your coffee is ruined.**

Grind size controls the surface area of the coffee.
*   **Finer Grind**: More surface area = Faster extraction (risk of bitterness).
*   **Coarser Grind**: Less surface area = Slower extraction (risk of sourness).

## The Golden Rule
> **Consistent particles = Consistent flavor.**

If your grinder produces "boulders" (big chunks) and "dust" (fine powder) at the same time, you'll get both sour and bitter flavors. This is why **Burr Grinders** > Blade Grinders.

## Grind Size Cheat Sheet

| Brew Method | Size | Texture Reference |
| :--- | :--- | :--- |
| **Turkish** | Extra Fine | Powder / Flour |
| **Espresso** | Fine | Table Salt |
| **AeroPress** | Medium-Fine | Beach Sand |
| **Pour Over** | Medium | Sea Salt |
| **Chemex** | Med-Coarse | Kosher Salt |
| **French Press**| Coarse | Breadcrumbs |
| **Cold Brew** | Extra Coarse | Peppercorns |

## Troubleshooting
*   **Sour/Salty?** → Grind Finer.
*   **Bitter/Dry?** → Grind Coarser.

> **Pro Tip:** Change your grind size *before* you change your dose or water temp. It has the biggest impact.

## Burr vs Blade Grinders

**Blade Grinders**: Inconsistent, create dust and boulders
**Burr Grinders**: Uniform particles, adjustable settings

Invest in a burr grinder—it's the single biggest upgrade for home brewing.`,
      readTime: 5
      }
]
  },
{
  id: 'roast-levels',
    title: 'Roast Levels',
      description: 'Understanding light, medium, and dark roasts',
        emoji: '🔥',
          articles: [
            {
              id: 'roast-spectrum',
              title: 'The Roast Spectrum',
              content: `# The Roast Spectrum

Roasting transforms green coffee beans into the aromatic brown beans we know.

## Light Roast

**Appearance**: Light brown, no oil on surface
**Temperature**: 180-205°C (356-401°F)
**Characteristics**:
- Highest acidity (brightness)
- Most caffeine
- Origin flavors shine through
- Fruity, floral, tea-like notes

**Best for**: Pour over, Aeropress

## Medium Roast

**Appearance**: Medium brown, slight oil
**Temperature**: 210-220°C (410-428°F)
**Characteristics**:
- Balanced acidity and body
- Caramelization develops
- Nutty, chocolate notes emerge
- Origin + roast flavors balanced

**Best for**: All methods

## Dark Roast

**Appearance**: Dark brown to black, oily surface
**Temperature**: 225-230°C (437-446°F)
**Characteristics**:
- Low acidity
- Heavy body
- Smoky, bitter, bold
- Roast flavor dominates

**Best for**: Espresso, French Press

## The Caffeine Myth

Contrary to popular belief, light roasts have slightly MORE caffeine than dark roasts. The roasting process burns off some caffeine, so the longer the roast, the less caffeine remains.`,
      readTime: 5
            },
  {
    id: 'first-second-crack',
    title: 'First and Second Crack',
    content: `# First and Second Crack

During roasting, beans go through two audible "cracks" that indicate development stages.

## First Crack

**When**: Around 196°C (385°F)
**Sound**: Like popcorn popping
**What happens**: 
- Moisture escapes as steam
- Beans expand and become porous
- Chemical reactions begin
- Light roast territory begins

## Development Time

The time between first crack and end of roast is called "development time." This is where roasters craft the flavor profile:

- **Short development**: Brighter, more acidic
- **Long development**: More body, less acidity

## Second Crack

**When**: Around 224°C (435°F)
**Sound**: Quieter, like Rice Krispies
**What happens**:
- Oils migrate to surface
- Cellular structure breaks down
- Dark roast territory
- Smoky flavors develop

**Warning**: Going too far past second crack leads to burnt, ashy flavors and potential fire hazards!

## Specialty Coffee Approach

Most specialty roasters stop between first crack and early second crack to preserve origin characteristics while developing sweetness.`,
  readTime: 5
            }
          ]
},
{
  id: 'bean-origins',
    title: 'Coffee Origins',
      description: 'Explore flavors from around the world',
        emoji: '🌍',
          articles: [
            {
              id: 'coffee-belt',
              title: 'The Coffee Belt',
              content: `# The Coffee Belt

Coffee grows in a band around the equator known as the "Coffee Belt" or "Bean Belt."

## Geographic Requirements

Coffee thrives between the Tropics of Cancer and Capricorn (23.5°N to 23.5°S) where conditions include:

- **Altitude**: 1,000-2,000 meters ideal
- **Temperature**: 15-24°C (60-75°F)
- **Rainfall**: 1,500-2,500mm annually
- **Soil**: Rich, volcanic preferred

## Major Growing Regions

### Africa
- **Ethiopia**: Birthplace of coffee. Floral, fruity, wine-like
- **Kenya**: Bright acidity, blackcurrant, tomato notes
- **Rwanda**: Clean, sweet, citrus

### Central & South America
- **Colombia**: Balanced, nutty, caramel
- **Brazil**: Low acidity, chocolate, nuts
- **Guatemala**: Complex, spicy, chocolate

### Asia-Pacific
- **Indonesia**: Earthy, herbal, full body
- **Vietnam**: Robusta dominant, strong, bitter
- **Papua New Guinea**: Fruity, complex, wild

## Terroir

Like wine, coffee expresses "terroir"—the complete natural environment where it grows. The same variety planted in different regions will taste distinctly different.`,
              readTime: 5
            },
            {
              id: 'arabica-vs-robusta',
              title: 'Arabica vs Robusta',
              content: `# Arabica vs Robusta

The two main commercial coffee species have distinct characteristics.

## Coffea Arabica (60-70% of world production)

**Growing conditions**:
- Higher altitude (1,000-2,000m)
- Cooler temperatures
- More susceptible to disease
- Lower yield

**Flavor profile**:
- Complex, nuanced
- Higher acidity
- Sweeter, softer
- Fruity, floral notes

**Caffeine**: 1.2-1.5%

## Coffea Canephora (Robusta) (30-40% of production)

**Growing conditions**:
- Lower altitude (0-800m)
- Hotter temperatures
- Disease resistant
- Higher yield

**Flavor profile**:
- Simple, harsh
- Low acidity
- Bitter, earthy
- Woody, rubbery notes

**Caffeine**: 2.2-2.7% (almost double!)

## When to Use Each

**Arabica**: Specialty coffee, single origins, pour over
**Robusta**: Instant coffee, some espresso blends (adds crema and body)

## The Quality Gap

While Robusta has a reputation for low quality, specialty-grade Robusta does exist. Some Italian espresso blends traditionally include 10-20% Robusta for extra crema and caffeine kick.`,
              readTime: 5
            }
          ]
},
{
  id: 'equipment',
    title: 'Equipment Guide',
      description: 'Essential tools for home brewing',
        emoji: '⚙️',
          articles: [
            {
              id: 'essential-equipment',
              title: 'Essential Home Equipment',
              content: `# Essential Home Equipment

Build your home coffee setup with these fundamentals.

## The Essentials

### 1. Grinder (Most Important!)
A good grinder matters more than your brewer.

**Budget**: Timemore C2 (~$60)
**Mid-range**: Baratza Encore (~$170)
**Premium**: Niche Zero (~$700)

### 2. Scale
Precision is key. Look for:
- 0.1g accuracy
- Timer function
- Fast response

**Recommended**: Timemore Black Mirror (~$50)

### 3. Kettle
For pour over, a gooseneck kettle provides control.

**Basic**: Any gooseneck (~$30)
**With temp control**: Fellow Stagg EKG (~$150)

### 4. Brewer
Start with one method and master it:

| Method | Cost | Difficulty |
|--------|------|------------|
| French Press | $20-40 | Easy |
| AeroPress | $35 | Easy |
| V60 | $25 | Medium |
| Moka Pot | $30 | Easy |

## Nice to Have

- **Thermometer**: If kettle lacks temp control
- **Timer**: Most scales include one
- **Cleaning brush**: For grinder maintenance
- **Storage container**: Airtight, opaque

## Upgrade Path

1. Start with grinder + simple brewer
2. Add scale for consistency
3. Upgrade kettle for pour over
4. Consider espresso machine later`,
              readTime: 5
            },
            {
              id: 'espresso-machines',
              title: 'Espresso Machine Guide',
              content: `# Espresso Machine Guide

Espresso at home requires significant investment but rewards with café-quality drinks.

## Machine Categories

### Manual Lever (~$200-1,500)
- Full control over pressure
- No electricity needed
- Steep learning curve
- Examples: Flair, Robot

### Semi-Automatic (~$300-3,000)
- You control grind, dose, timing
- Machine provides pressure
- Most popular for home
- Examples: Gaggia Classic, Breville Barista Express

### Automatic (~$500-2,000)
- Machine controls shot timing
- Consistent results
- Less hands-on
- Examples: Breville Bambino Plus

### Super-Automatic (~$500-5,000)
- Bean to cup with one button
- Built-in grinder
- Least control, most convenience
- Examples: Jura, Philips

## Key Specifications

**Boiler type**:
- Single: Switch between brew and steam
- Heat exchanger: Brew and steam simultaneously
- Dual: Separate boilers, best temperature stability

**Pressure**: 9 bars is standard for espresso

**Portafilter size**: 58mm is commercial standard

## Budget Recommendations

**Under $500**: Breville Bambino, Gaggia Classic
**$500-1,000**: Breville Barista Pro, Rancilio Silvia
**$1,000+**: Profitec Go, Lelit MaraX

## Don't Forget the Grinder!

An espresso-capable grinder is essential. Budget at least as much for the grinder as the machine.`,
              readTime: 5
            }
          ]
},
{
  id: 'home-setup',
    title: 'Home Coffee Station',
      description: 'Create your perfect brewing corner',
        emoji: '🏠',
          articles: [
            {
              id: 'setting-up-station',
              title: 'Setting Up Your Station',
              content: `# Setting Up Your Home Coffee Station

Let's build a coffee corner that makes you excited to brew every morning.

## Choose Your Spot

Pick a location with:
- **Counter space**: At least 2 feet wide for equipment
- **Power outlet**: For grinder and kettle
- **Natural light**: Makes the ritual more enjoyable
- **Water access**: Close to sink for easy refills

## Essential Layout

**The Workflow Triangle:**
1. **Beans & Grinder** (left)
2. **Scale & Brewer** (center)
3. **Kettle & Water** (right)

This left-to-right flow matches how you'll actually brew, reducing unnecessary movement.

## Storage Solutions

**For Beans:**
- Airtight containers away from light
- Room temperature (not fridge!)
- Label with roast date

**For Equipment:**
- Grinder stays on counter (you'll use it daily)
- Filters in a drawer or container
- Brewing devices on open shelving for easy access

## Keep It Clean

A clean station = better coffee:
- Wipe down daily after brewing
- Deep clean grinder weekly
- Descale kettle monthly
- Replace filters as needed

## Make It Yours

Add personal touches:
- Favorite mug collection on display
- Small plant or succulent
- Tasting notes journal
- Brewing recipe cards

**Pro tip**: Keep your most-used method front and center. Rotate seasonal brewers (cold brew in summer, moka pot in winter) to keep things interesting.

Your coffee station should feel inviting, not intimidating. Start simple and add equipment as your skills grow.`,
              readTime: 5
            },
            {
              id: 'buying-beans',
              title: 'Buying & Storing Beans',
              content: `# Buying & Storing Beans

Get the most from your coffee with proper selection and storage.

## Where to Buy

### Local Roasters (Best)
- Freshest beans
- Can ask questions
- Support local business
- Often can sample before buying

### Online Specialty Roasters
- Wide selection
- Subscription options
- Ships fresh after roasting
- Trade Coffee, Onyx, Counter Culture

### Grocery Stores (Avoid)
- Often stale (check roast date)
- Limited selection
- Poor storage conditions

## What to Look For

**Roast date**: Buy beans roasted within 2-4 weeks
**Origin info**: Single origin or blend details
**Tasting notes**: Match to your preferences
**Processing method**: Washed, natural, honey

## Storage Rules

### Do:
- Use airtight container
- Store at room temperature
- Keep away from light
- Buy in small quantities (2-4 weeks supply)

### Don't:
- Refrigerate (absorbs odors)
- Freeze (controversial, only for long-term)
- Store near heat sources
- Keep in original bag (unless has valve + seal)

## Recommended Containers

- **Fellow Atmos**: Vacuum seal, stylish
- **Airscape**: Push-down lid removes air
- **Mason jar**: Budget option (keep in dark)

## Freshness Timeline

- **Days 1-3**: Degassing, may taste uneven
- **Days 4-14**: Peak flavor window
- **Days 15-30**: Still good, declining
- **30+ days**: Noticeably stale`,
              readTime: 5
            }
          ]
}
];

export const getCategoryById = (id: string): LearningCategory | undefined => {
  return learningCategories.find(cat => cat.id === id);
};

export const getArticleById = (categoryId: string, articleId: string): Article | undefined => {
  const category = getCategoryById(categoryId);
  return category?.articles.find(article => article.id === articleId);
};
