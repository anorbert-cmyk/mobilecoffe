export interface Article {
  id: string;
  title: string;
  content: string;
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
        content: `# What is Specialty Coffee?

Specialty coffee refers to the highest quality coffee beans, typically scoring 80 points or above on a 100-point scale by certified coffee tasters (Q Graders).

## The Journey from Farm to Cup

**1. Origin & Growing Conditions**
Specialty coffee starts at the farm. The best beans come from specific microclimates at high altitudes (1,200-2,000 meters), where cooler temperatures slow cherry maturation, developing complex flavors.

**2. Careful Processing**
After harvest, cherries are processed using methods like:
- **Washed**: Clean, bright flavors
- **Natural**: Fruity, wine-like notes
- **Honey**: Sweet, balanced profile

**3. Expert Roasting**
Specialty roasters develop unique profiles to highlight each coffee's characteristics, rather than roasting everything dark to hide defects.

**4. Precise Brewing**
The final step is brewing with care: proper grind size, water temperature, and ratios to extract the best flavors.

## Why It Matters

Specialty coffee represents only about 3% of global production. By choosing specialty, you're supporting:
- Sustainable farming practices
- Fair compensation for farmers
- Exceptional taste experiences
- Traceability from farm to cup`
      },
      {
        id: 'water-quality',
        title: 'The Importance of Water Quality',
        content: `# The Importance of Water Quality

Coffee is 98% water, making water quality crucial to your brew.

## Ideal Water Characteristics

**Total Dissolved Solids (TDS):** 75-250 ppm
Water that's too soft won't extract properly; too hard creates scale and mutes flavors.

**pH Level:** 6.5-7.5 (neutral)
Slightly acidic water enhances bright notes; alkaline water creates flat, dull coffee.

**Chlorine:** 0 ppm
Chlorine creates off-flavors. Use filtered water or let tap water sit uncovered for 24 hours.

## Simple Solutions

1. **Filtered Water**: A basic carbon filter removes chlorine and improves taste
2. **Bottled Water**: Look for mineral content around 100-150 ppm
3. **Third Wave Water**: Mineral packets designed specifically for coffee

## Temperature Matters

- **Ideal range**: 90-96°C (195-205°F)
- **Too hot**: Bitter, over-extracted
- **Too cold**: Sour, under-extracted

**Pro tip**: After boiling, wait 30-45 seconds before pouring for optimal temperature.`
      },
      {
        id: 'grind-size-guide',
        title: 'Grind Size Guide',
        content: `# Grind Size Guide

The grind size dramatically affects extraction and flavor.

## The Rule

**Finer grind = More surface area = Faster extraction**
**Coarser grind = Less surface area = Slower extraction**

## Grind Sizes by Method

| Method | Grind Size | Texture Reference |
|--------|------------|-------------------|
| Turkish | Extra Fine | Powder, like flour |
| Espresso | Fine | Table salt |
| Moka Pot | Medium-Fine | Sand |
| Pour Over | Medium | Sea salt |
| French Press | Coarse | Breadcrumbs |
| Cold Brew | Extra Coarse | Peppercorns |

## Troubleshooting

**Coffee tastes sour/weak?**
→ Grind finer (under-extracted)

**Coffee tastes bitter/harsh?**
→ Grind coarser (over-extracted)

## Burr vs Blade Grinders

**Blade Grinders**: Inconsistent, create dust and boulders
**Burr Grinders**: Uniform particles, adjustable settings

Invest in a burr grinder—it's the single biggest upgrade for home brewing.`
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

Contrary to popular belief, light roasts have slightly MORE caffeine than dark roasts. The roasting process burns off some caffeine, so the longer the roast, the less caffeine remains.`
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

Most specialty roasters stop between first crack and early second crack to preserve origin characteristics while developing sweetness.`
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

Like wine, coffee expresses "terroir"—the complete natural environment where it grows. The same variety planted in different regions will taste distinctly different.`
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

While Robusta has a reputation for low quality, specialty-grade Robusta does exist. Some Italian espresso blends traditionally include 10-20% Robusta for extra crema and caffeine kick.`
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
4. Consider espresso machine later`
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

An espresso-capable grinder is essential. Budget at least as much for the grinder as the machine.`
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
        content: `# Setting Up Your Coffee Station

Create an efficient, enjoyable brewing space at home.

## Location Considerations

**Near water source**: You'll fill kettles frequently
**Good lighting**: See your pour and extraction
**Ventilation**: Grinders create dust
**Stable surface**: Especially for espresso machines

## Organization Tips

### The Work Triangle
Arrange your station so you can move efficiently between:
1. **Grinder** → 2. **Brewer** → 3. **Cups/Serving**

### Storage Solutions
- Keep beans in airtight containers away from light
- Store filters and accessories within reach
- Use drawer organizers for small tools

## Cleaning Station

Keep these nearby:
- Microfiber cloths
- Grinder brush
- Knock box (for espresso)
- Cleaning tablets/powder

## Aesthetic Touches

- **Plants**: Add life to your corner
- **Art**: Coffee-themed prints
- **Lighting**: Warm under-cabinet lights
- **Tray**: Contains mess, looks intentional

## Maintenance Schedule

**Daily**: Wipe surfaces, rinse equipment
**Weekly**: Deep clean brewer, empty knock box
**Monthly**: Clean grinder, descale if needed
**Quarterly**: Replace gaskets, check seals`
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
- **30+ days**: Noticeably stale`
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
