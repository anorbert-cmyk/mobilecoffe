// Coffee Beans Database
// Real specialty coffee beans from various roasters with detailed flavor profiles

import chocolateNuttyHero from '@/assets/images/beans/chocolate-nutty-hero.png';
import fruityBrightHero from '@/assets/images/beans/fruity-bright-hero.png';
import floralTeaHero from '@/assets/images/beans/floral-tea-hero.png';
import sweetCaramelHero from '@/assets/images/beans/sweet-caramel-hero.png';
import earthySpicyHero from '@/assets/images/beans/earthy-spicy-hero.png';

export type ProcessMethod = 'washed' | 'natural' | 'honey' | 'anaerobic';
export type RoastLevel = 'light' | 'medium-light' | 'medium' | 'medium-dark' | 'dark';
export type BrewMethod = 'espresso' | 'filter' | 'french-press' | 'moka-pot' | 'cold-brew';

export interface TasteProfile {
  acidity: number; // 1-10
  body: number; // 1-10
  sweetness: number; // 1-10
  bitterness: number; // 1-10
}

export interface CoffeeBean {
  id: string;
  name: string;
  roaster: string;
  origin: string;
  region?: string;
  process: ProcessMethod;
  roastLevel: RoastLevel;
  
  // Flavor Profile
  flavorNotes: string[];
  tasteProfile: TasteProfile;
  
  // Product Details
  price: number; // per 250g bag in USD
  weight: number; // grams
  description: string;
  image: any;
  
  // Compatibility
  brewMethods: BrewMethod[];
  recommendedFor: string[];
  
  // Purchase
  affiliateUrl: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
}

export const coffeeBeans: CoffeeBean[] = [
  // CHOCOLATE & NUTTY CATEGORY
  {
    id: 'bean-001',
    name: 'House Blend Espresso',
    roaster: 'Blue Bottle Coffee',
    origin: 'Brazil',
    region: 'Sul de Minas',
    process: 'natural',
    roastLevel: 'medium-dark',
    flavorNotes: ['dark chocolate', 'hazelnut', 'caramel'],
    tasteProfile: { acidity: 4, body: 8, sweetness: 7, bitterness: 5 },
    price: 18.00,
    weight: 340,
    description: 'Our signature espresso blend delivers rich chocolate notes with a smooth, nutty finish. Perfect for milk-based drinks or enjoyed straight.',
    image: chocolateNuttyHero,
    brewMethods: ['espresso', 'moka-pot'],
    recommendedFor: ['beginners', 'espresso-lovers', 'milk-drinks'],
    affiliateUrl: 'https://bluebottlecoffee.com/us/eng/espresso',
    inStock: true,
    rating: 4.7,
    reviewCount: 2847
  },
  {
    id: 'bean-002',
    name: 'Organic Sumatra',
    roaster: 'Stumptown Coffee Roasters',
    origin: 'Indonesia',
    region: 'Sumatra',
    process: 'washed',
    roastLevel: 'dark',
    flavorNotes: ['cocoa', 'cedar', 'pipe tobacco'],
    tasteProfile: { acidity: 3, body: 9, sweetness: 5, bitterness: 7 },
    price: 16.50,
    weight: 340,
    description: 'Bold and earthy with a syrupy body. This dark roast showcases the unique terroir of Sumatra with deep, complex flavors.',
    image: chocolateNuttyHero,
    brewMethods: ['french-press', 'filter', 'cold-brew'],
    recommendedFor: ['dark-roast-lovers', 'bold-coffee'],
    affiliateUrl: 'https://www.stumptowncoffee.com/products/sumatra',
    inStock: true,
    rating: 4.5,
    reviewCount: 1923
  },
  {
    id: 'bean-003',
    name: 'Nizza Blend',
    roaster: 'Intelligentsia Coffee',
    origin: 'Multi-Origin',
    process: 'washed',
    roastLevel: 'medium',
    flavorNotes: ['milk chocolate', 'almond', 'brown sugar'],
    tasteProfile: { acidity: 5, body: 7, sweetness: 8, bitterness: 4 },
    price: 17.00,
    weight: 340,
    description: 'A balanced blend perfect for everyday drinking. Smooth chocolate sweetness with a clean finish.',
    image: chocolateNuttyHero,
    brewMethods: ['espresso', 'filter', 'french-press'],
    recommendedFor: ['beginners', 'balanced-coffee', 'everyday-drinking'],
    affiliateUrl: 'https://www.intelligentsiacoffee.com/products/nizza-blend',
    inStock: true,
    rating: 4.6,
    reviewCount: 3156
  },

  // FRUITY & BRIGHT CATEGORY
  {
    id: 'bean-004',
    name: 'Ethiopia Yirgacheffe',
    roaster: 'Counter Culture Coffee',
    origin: 'Ethiopia',
    region: 'Yirgacheffe',
    process: 'washed',
    roastLevel: 'light',
    flavorNotes: ['blueberry', 'lemon', 'jasmine'],
    tasteProfile: { acidity: 9, body: 4, sweetness: 8, bitterness: 2 },
    price: 19.50,
    weight: 340,
    description: 'Bright and tea-like with explosive fruit flavors. This washed Ethiopian showcases the best of what Yirgacheffe has to offer.',
    image: fruityBrightHero,
    brewMethods: ['filter', 'espresso'],
    recommendedFor: ['fruity-notes', 'bright-coffee', 'filter-coffee'],
    affiliateUrl: 'https://counterculturecoffee.com/shop/coffee/ethiopia-yirgacheffe',
    inStock: true,
    rating: 4.8,
    reviewCount: 2134
  },
  {
    id: 'bean-005',
    name: 'Kenya Kiambu',
    roaster: 'Blue Bottle Coffee',
    origin: 'Kenya',
    region: 'Kiambu',
    process: 'washed',
    roastLevel: 'medium-light',
    flavorNotes: ['blackcurrant', 'grapefruit', 'tomato'],
    tasteProfile: { acidity: 10, body: 6, sweetness: 7, bitterness: 3 },
    price: 22.00,
    weight: 340,
    description: 'Intensely bright with juicy fruit acidity. Kenyan coffees are known for their wine-like complexity and vibrant flavors.',
    image: fruityBrightHero,
    brewMethods: ['filter', 'french-press'],
    recommendedFor: ['fruity-notes', 'bright-coffee', 'advanced-palate'],
    affiliateUrl: 'https://bluebottlecoffee.com/us/eng/kenya',
    inStock: true,
    rating: 4.9,
    reviewCount: 1567
  },
  {
    id: 'bean-006',
    name: 'Colombia Huila',
    roaster: 'La Colombe',
    origin: 'Colombia',
    region: 'Huila',
    process: 'washed',
    roastLevel: 'medium-light',
    flavorNotes: ['red apple', 'caramel', 'orange'],
    tasteProfile: { acidity: 7, body: 6, sweetness: 8, bitterness: 3 },
    price: 17.50,
    weight: 340,
    description: 'Balanced Colombian with bright fruit notes and caramel sweetness. A crowd-pleaser that works well in any brew method.',
    image: fruityBrightHero,
    brewMethods: ['filter', 'espresso', 'french-press'],
    recommendedFor: ['balanced-coffee', 'fruity-notes', 'versatile'],
    affiliateUrl: 'https://www.lacolombe.com/products/colombia-huila',
    inStock: true,
    rating: 4.7,
    reviewCount: 2891
  },
  {
    id: 'bean-007',
    name: 'Costa Rica Tarrazu',
    roaster: 'Intelligentsia Coffee',
    origin: 'Costa Rica',
    region: 'Tarrazu',
    process: 'honey',
    roastLevel: 'medium-light',
    flavorNotes: ['raspberry', 'honey', 'citrus'],
    tasteProfile: { acidity: 8, body: 5, sweetness: 9, bitterness: 2 },
    price: 20.00,
    weight: 340,
    description: 'Honey-processed Costa Rican with berry sweetness and bright acidity. Clean and vibrant.',
    image: fruityBrightHero,
    brewMethods: ['filter', 'espresso'],
    recommendedFor: ['fruity-notes', 'sweet-coffee', 'filter-coffee'],
    affiliateUrl: 'https://www.intelligentsiacoffee.com/products/costa-rica-tarrazu',
    inStock: true,
    rating: 4.8,
    reviewCount: 1745
  },

  // FLORAL & TEA-LIKE CATEGORY
  {
    id: 'bean-008',
    name: 'Ethiopia Guji Natural',
    roaster: 'Counter Culture Coffee',
    origin: 'Ethiopia',
    region: 'Guji',
    process: 'natural',
    roastLevel: 'light',
    flavorNotes: ['bergamot', 'jasmine', 'peach'],
    tasteProfile: { acidity: 8, body: 3, sweetness: 9, bitterness: 1 },
    price: 21.00,
    weight: 340,
    description: 'Delicate and floral with tea-like body. Natural processing brings out intense fruit and floral aromatics.',
    image: floralTeaHero,
    brewMethods: ['filter', 'cold-brew'],
    recommendedFor: ['floral-notes', 'light-roast', 'filter-coffee'],
    affiliateUrl: 'https://counterculturecoffee.com/shop/coffee/ethiopia-guji',
    inStock: true,
    rating: 4.9,
    reviewCount: 1234
  },
  {
    id: 'bean-009',
    name: 'Panama Geisha',
    roaster: 'Blue Bottle Coffee',
    origin: 'Panama',
    region: 'Boquete',
    process: 'washed',
    roastLevel: 'light',
    flavorNotes: ['jasmine', 'bergamot', 'white tea'],
    tasteProfile: { acidity: 9, body: 2, sweetness: 8, bitterness: 1 },
    price: 45.00,
    weight: 250,
    description: 'The legendary Geisha variety. Ethereal floral notes with tea-like delicacy. A truly special coffee experience.',
    image: floralTeaHero,
    brewMethods: ['filter'],
    recommendedFor: ['floral-notes', 'premium-coffee', 'special-occasion'],
    affiliateUrl: 'https://bluebottlecoffee.com/us/eng/panama-geisha',
    inStock: false,
    rating: 5.0,
    reviewCount: 567
  },

  // SWEET & CARAMEL CATEGORY
  {
    id: 'bean-010',
    name: 'Guatemala Antigua',
    roaster: 'Stumptown Coffee Roasters',
    origin: 'Guatemala',
    region: 'Antigua',
    process: 'washed',
    roastLevel: 'medium',
    flavorNotes: ['caramel', 'milk chocolate', 'brown sugar'],
    tasteProfile: { acidity: 6, body: 7, sweetness: 9, bitterness: 4 },
    price: 18.50,
    weight: 340,
    description: 'Classic Guatemalan with rich caramel sweetness and chocolate depth. Smooth and approachable.',
    image: sweetCaramelHero,
    brewMethods: ['filter', 'espresso', 'french-press'],
    recommendedFor: ['sweet-coffee', 'balanced-coffee', 'beginners'],
    affiliateUrl: 'https://www.stumptowncoffee.com/products/guatemala-antigua',
    inStock: true,
    rating: 4.7,
    reviewCount: 2456
  },
  {
    id: 'bean-011',
    name: 'Honduras Marcala',
    roaster: 'La Colombe',
    origin: 'Honduras',
    region: 'Marcala',
    process: 'honey',
    roastLevel: 'medium',
    flavorNotes: ['honey', 'vanilla', 'toffee'],
    tasteProfile: { acidity: 5, body: 7, sweetness: 10, bitterness: 3 },
    price: 16.00,
    weight: 340,
    description: 'Honey-processed Honduran with intense sweetness. Like drinking liquid caramel with coffee undertones.',
    image: sweetCaramelHero,
    brewMethods: ['filter', 'espresso', 'cold-brew'],
    recommendedFor: ['sweet-coffee', 'honey-process', 'smooth-coffee'],
    affiliateUrl: 'https://www.lacolombe.com/products/honduras-marcala',
    inStock: true,
    rating: 4.8,
    reviewCount: 1834
  },

  // EARTHY & SPICY CATEGORY
  {
    id: 'bean-012',
    name: 'India Monsooned Malabar',
    roaster: 'Intelligentsia Coffee',
    origin: 'India',
    region: 'Malabar Coast',
    process: 'washed',
    roastLevel: 'dark',
    flavorNotes: ['tobacco', 'leather', 'spice'],
    tasteProfile: { acidity: 2, body: 10, sweetness: 4, bitterness: 8 },
    price: 19.00,
    weight: 340,
    description: 'Unique monsooned process creates low acidity and heavy body. Earthy, spicy, and bold.',
    image: earthySpicyHero,
    brewMethods: ['french-press', 'espresso', 'moka-pot'],
    recommendedFor: ['earthy-notes', 'bold-coffee', 'low-acid'],
    affiliateUrl: 'https://www.intelligentsiacoffee.com/products/india-monsooned-malabar',
    inStock: true,
    rating: 4.4,
    reviewCount: 987
  },
  {
    id: 'bean-013',
    name: 'Papua New Guinea',
    roaster: 'Counter Culture Coffee',
    origin: 'Papua New Guinea',
    region: 'Eastern Highlands',
    process: 'washed',
    roastLevel: 'medium-dark',
    flavorNotes: ['cedar', 'dark chocolate', 'black pepper'],
    tasteProfile: { acidity: 4, body: 8, sweetness: 5, bitterness: 7 },
    price: 20.50,
    weight: 340,
    description: 'Earthy and complex with spicy undertones. A unique origin that showcases rustic, bold flavors.',
    image: earthySpicyHero,
    brewMethods: ['french-press', 'filter', 'cold-brew'],
    recommendedFor: ['earthy-notes', 'bold-coffee', 'unique-origins'],
    affiliateUrl: 'https://counterculturecoffee.com/shop/coffee/papua-new-guinea',
    inStock: true,
    rating: 4.6,
    reviewCount: 1123
  },
  {
    id: 'bean-014',
    name: 'Yemen Mocha',
    roaster: 'Blue Bottle Coffee',
    origin: 'Yemen',
    region: 'Bani Matar',
    process: 'natural',
    roastLevel: 'medium-dark',
    flavorNotes: ['cinnamon', 'cardamom', 'dried fruit'],
    tasteProfile: { acidity: 5, body: 8, sweetness: 6, bitterness: 6 },
    price: 38.00,
    weight: 250,
    description: 'Historic Yemeni coffee with exotic spice notes. Wild and complex, this is coffee with a story.',
    image: earthySpicyHero,
    brewMethods: ['espresso', 'moka-pot', 'french-press'],
    recommendedFor: ['earthy-notes', 'spicy-notes', 'premium-coffee'],
    affiliateUrl: 'https://bluebottlecoffee.com/us/eng/yemen-mocha',
    inStock: false,
    rating: 4.9,
    reviewCount: 456
  },

  // ADDITIONAL POPULAR BEANS
  {
    id: 'bean-015',
    name: 'Decaf Colombia',
    roaster: 'Stumptown Coffee Roasters',
    origin: 'Colombia',
    region: 'Huila',
    process: 'washed',
    roastLevel: 'medium',
    flavorNotes: ['chocolate', 'caramel', 'orange'],
    tasteProfile: { acidity: 6, body: 7, sweetness: 8, bitterness: 4 },
    price: 18.00,
    weight: 340,
    description: 'Swiss Water Process decaf that retains full flavor. You won\'t believe it\'s decaf.',
    image: chocolateNuttyHero,
    brewMethods: ['filter', 'espresso', 'french-press'],
    recommendedFor: ['decaf', 'balanced-coffee', 'evening-coffee'],
    affiliateUrl: 'https://www.stumptowncoffee.com/products/decaf-colombia',
    inStock: true,
    rating: 4.6,
    reviewCount: 2134
  },
  {
    id: 'bean-016',
    name: 'Rwanda Bourbon',
    roaster: 'La Colombe',
    origin: 'Rwanda',
    region: 'Nyamasheke',
    process: 'washed',
    roastLevel: 'medium-light',
    flavorNotes: ['red currant', 'brown sugar', 'lime'],
    tasteProfile: { acidity: 8, body: 5, sweetness: 8, bitterness: 2 },
    price: 19.50,
    weight: 340,
    description: 'Bright Rwandan with complex fruit notes. Clean and vibrant with a lingering sweetness.',
    image: fruityBrightHero,
    brewMethods: ['filter', 'espresso'],
    recommendedFor: ['fruity-notes', 'bright-coffee', 'african-coffee'],
    affiliateUrl: 'https://www.lacolombe.com/products/rwanda-bourbon',
    inStock: true,
    rating: 4.8,
    reviewCount: 1567
  }
];

// Helper functions for filtering
export const getBeansByRoaster = (roaster: string) =>
  coffeeBeans.filter(bean => bean.roaster === roaster);

export const getBeansByOrigin = (origin: string) =>
  coffeeBeans.filter(bean => bean.origin === origin);

export const getBeansByFlavorNote = (flavorNote: string) =>
  coffeeBeans.filter(bean => 
    bean.flavorNotes.some(note => note.toLowerCase().includes(flavorNote.toLowerCase()))
  );

export const getBeansByRoastLevel = (roastLevel: RoastLevel) =>
  coffeeBeans.filter(bean => bean.roastLevel === roastLevel);

export const getBeansByBrewMethod = (brewMethod: BrewMethod) =>
  coffeeBeans.filter(bean => bean.brewMethods.includes(brewMethod));

export const getInStockBeans = () =>
  coffeeBeans.filter(bean => bean.inStock);

// Roaster list
export const roasters = [
  'Blue Bottle Coffee',
  'Stumptown Coffee Roasters',
  'Intelligentsia Coffee',
  'Counter Culture Coffee',
  'La Colombe'
];

// Flavor categories for wizard
export const flavorCategories = [
  {
    id: 'chocolate-nutty',
    name: 'Chocolate & Nutty',
    icon: '🍫',
    description: 'Rich, smooth, comforting',
    flavorNotes: ['chocolate', 'cocoa', 'hazelnut', 'almond', 'nutty'],
    image: chocolateNuttyHero
  },
  {
    id: 'fruity-bright',
    name: 'Fruity & Bright',
    icon: '🍓',
    description: 'Vibrant, juicy, lively',
    flavorNotes: ['berry', 'blueberry', 'raspberry', 'citrus', 'orange', 'lemon', 'tropical'],
    image: fruityBrightHero
  },
  {
    id: 'floral-tea',
    name: 'Floral & Tea-like',
    icon: '🌸',
    description: 'Delicate, elegant, refined',
    flavorNotes: ['jasmine', 'bergamot', 'floral', 'tea', 'delicate'],
    image: floralTeaHero
  },
  {
    id: 'sweet-caramel',
    name: 'Sweet & Caramel',
    icon: '🍮',
    description: 'Sweet, smooth, indulgent',
    flavorNotes: ['caramel', 'brown sugar', 'honey', 'vanilla', 'toffee'],
    image: sweetCaramelHero
  },
  {
    id: 'earthy-spicy',
    name: 'Earthy & Spicy',
    icon: '🌿',
    description: 'Bold, complex, adventurous',
    flavorNotes: ['tobacco', 'cedar', 'leather', 'spice', 'cinnamon', 'earthy'],
    image: earthySpicyHero
  }
];
