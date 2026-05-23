export interface CoffeeRecipe {
  id: string;
  name: string;
  subtitle: string;
  image: any;
  category: 'espresso' | 'milk' | 'alternative';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prepTime: string;
  
  // Recipe details
  inputGrams: number;
  outputGrams?: number;
  outputMl?: number;
  extractionTime?: string;
  
  // Ratio visualization
  espressoMl?: number;
  milkMl?: number;
  foamMl?: number;
  waterMl?: number;
  milkFoamDepth?: string;
  
  ratio: string;
  temperature?: string;
  
  // Description
  description: string;
  flavorProfile: string[];
  
  // Steps
  steps: string[];
  
  // Tips
  tips: string[];
}

export const coffeeRecipes: CoffeeRecipe[] = [
  {
    id: 'espresso',
    name: 'Espresso',
    subtitle: 'Single shot',
    image: require('@/assets/images/coffees/espresso.png'),
    category: 'espresso',
    difficulty: 'intermediate',
    prepTime: '30 sec',
    inputGrams: 18,
    outputGrams: 36,
    extractionTime: '25-30 seconds',
    
    espressoMl: 36,
    ratio: '1:2',
    temperature: '93°C (200°F)',
    description: 'The foundation of all espresso drinks. A concentrated coffee brewed by forcing hot water through finely-ground coffee at high pressure.',
    flavorProfile: ['Intense', 'Rich', 'Complex', 'Crema'],
    steps: [
      'Grind 18g of coffee to a fine consistency',
      'Distribute grounds evenly in the portafilter',
      'Tamp with 20-30 lbs of pressure',
      'Lock portafilter and start extraction',
      'Target 36g output in 25-30 seconds',
      'Look for honey-like flow and tiger striping'
    ],
    tips: [
      'Freshly roasted beans (7-21 days) work best',
      'Preheat your cup for better temperature retention',
      'If too fast, grind finer. If too slow, grind coarser'
    ]
  },
  {
    id: 'double-espresso',
    name: 'Double Espresso',
    subtitle: 'Doppio',
    image: require('@/assets/images/coffees/double_espresso.png'),
    category: 'espresso',
    difficulty: 'intermediate',
    prepTime: '30 sec',
    inputGrams: 18,
    outputGrams: 36,
    extractionTime: '25-30 seconds',
    
    espressoMl: 60,
    ratio: '1:2',
    temperature: '93°C (200°F)',
    description: 'A double shot of espresso, the standard serving size in most specialty coffee shops. Same ratio as single, just more coffee.',
    flavorProfile: ['Bold', 'Full-bodied', 'Intense', 'Rich crema'],
    steps: [
      'Grind 18g of coffee to a fine consistency',
      'Distribute grounds evenly in the portafilter',
      'Tamp with consistent pressure',
      'Extract 36g in 25-30 seconds',
      'Serve immediately in a preheated cup'
    ],
    tips: [
      'This is the standard "shot" at most cafes',
      'Perfect base for milk drinks',
      'Adjust grind to hit target time'
    ]
  },
  {
    id: 'ristretto',
    name: 'Ristretto',
    subtitle: 'Concentrated shot',
    image: require('@/assets/images/coffees/ristretto.png'),
    category: 'espresso',
    difficulty: 'advanced',
    prepTime: '20 sec',
    inputGrams: 18,
    outputGrams: 22,
    extractionTime: '15-20 seconds',
    
    espressoMl: 25,
    ratio: '1:1.2',
    temperature: '93°C (200°F)',
    description: 'A "restricted" shot using less water for a more concentrated, sweeter espresso with less bitterness.',
    flavorProfile: ['Sweet', 'Syrupy', 'Concentrated', 'Less bitter'],
    steps: [
      'Grind 18g of coffee slightly finer than espresso',
      'Distribute and tamp as usual',
      'Extract only 18-22g of liquid',
      'Stop extraction at 15-20 seconds',
      'Serve immediately'
    ],
    tips: [
      'Grind slightly finer than normal espresso',
      'Highlights sweeter notes, reduces bitterness',
      'Popular in Italy as a quick pick-me-up'
    ]
  },
  {
    id: 'lungo',
    name: 'Lungo',
    subtitle: 'Extended shot',
    image: require('@/assets/images/coffees/lungo.png'),
    category: 'espresso',
    difficulty: 'intermediate',
    prepTime: '45 sec',
    inputGrams: 18,
    outputMl: 110,
    extractionTime: '35-45 seconds',
    
    espressoMl: 60,
    waterMl: 40,
    ratio: '1:3 to 1:4',
    temperature: '93°C (200°F)',
    description: 'A "long" espresso shot with more water passed through the coffee, resulting in a larger, milder drink.',
    flavorProfile: ['Milder', 'More volume', 'Slightly bitter', 'Less intense'],
    steps: [
      'Grind 18g of coffee slightly coarser than espresso',
      'Distribute and tamp evenly',
      'Extract 90-110ml of liquid',
      'Total extraction time 35-45 seconds',
      'Serve in a larger cup'
    ],
    tips: [
      'Grind slightly coarser to avoid over-extraction',
      'Popular in Northern Europe',
      'Not the same as an Americano'
    ]
  },
  {
    id: 'flat-white',
    name: 'Flat White',
    subtitle: 'Double shot + microfoam',
    image: require('@/assets/images/coffees/flat_white.png'),
    category: 'milk',
    difficulty: 'intermediate',
    prepTime: '2 min',
    inputGrams: 18,
    outputGrams: 36,
    extractionTime: '25-30 seconds',
    milkMl: 110,
    milkFoamDepth: '1-2mm microfoam',
    
    espressoMl: 60,
    ratio: '1:3 (espresso to milk)',
    temperature: '60-65°C (140-150°F)',
    description: 'A velvety smooth coffee with a double shot of espresso and silky steamed milk with minimal foam. Originated in Australia/New Zealand.',
    flavorProfile: ['Velvety', 'Strong coffee flavor', 'Creamy', 'Balanced'],
    steps: [
      'Pull a double espresso (18g → 36g)',
      'Steam 110ml of whole milk to 60-65°C',
      'Create silky microfoam with minimal air',
      'Tap pitcher to remove large bubbles',
      'Pour in a steady stream, finish with latte art',
      'Serve in a 160-180ml tulip cup'
    ],
    tips: [
      'Less foam than a latte or cappuccino',
      'The coffee flavor should shine through',
      'Use whole milk for best texture'
    ]
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    subtitle: 'Equal parts espresso, milk, foam',
    image: require('@/assets/images/coffees/cappuccino.png'),
    category: 'milk',
    difficulty: 'intermediate',
    prepTime: '2 min',
    inputGrams: 18,
    outputGrams: 36,
    extractionTime: '25-30 seconds',
    milkFoamDepth: '1cm thick foam',
    
    espressoMl: 30,
    milkMl: 60,
    foamMl: 60,
    ratio: '1:1:1 (espresso:milk:foam)',
    temperature: '60-65°C (140-150°F)',
    description: 'The classic Italian coffee drink with equal parts espresso, steamed milk, and thick milk foam. Often dusted with cocoa.',
    flavorProfile: ['Balanced', 'Creamy', 'Airy foam', 'Traditional'],
    steps: [
      'Pull a double espresso (18g → 36g)',
      'Steam 120ml milk to create thick foam',
      'Aim for 1/3 steamed milk, 2/3 foam',
      'Pour milk first, then spoon foam on top',
      'Optional: dust with cocoa powder',
      'Serve in a 150-180ml cup'
    ],
    tips: [
      'Traditional Italian cappuccino is smaller than modern versions',
      'Foam should be thick enough to hold cocoa',
      'Best enjoyed in the morning in Italy'
    ]
  },
  {
    id: 'latte',
    name: 'Caffè Latte',
    subtitle: 'Espresso with steamed milk',
    image: require('@/assets/images/coffees/latte.png'),
    category: 'milk',
    difficulty: 'beginner',
    prepTime: '2 min',
    inputGrams: 18,
    outputGrams: 36,
    extractionTime: '25-30 seconds',
    milkMl: 200,
    milkFoamDepth: '5-10mm foam',
    
    espressoMl: 60,
    foamMl: 20,
    ratio: '1:4 (espresso to milk)',
    temperature: '60-65°C (140-150°F)',
    description: 'A mild, milky coffee drink with espresso and lots of steamed milk. Perfect for those who prefer a gentler coffee flavor.',
    flavorProfile: ['Mild', 'Milky', 'Smooth', 'Gentle coffee'],
    steps: [
      'Pull a double espresso (18g → 36g)',
      'Steam 200ml of whole milk to 60-65°C',
      'Create smooth microfoam with slight air',
      'Pour milk into espresso in steady stream',
      'Finish with latte art if desired',
      'Serve in a 240-350ml glass or cup'
    ],
    tips: [
      'Most popular espresso drink worldwide',
      'Great canvas for flavored syrups',
      'Use a tall glass to show the layers'
    ]
  },
  {
    id: 'latte-macchiato',
    name: 'Latte Macchiato',
    subtitle: 'Milk stained with espresso',
    image: require('@/assets/images/coffees/latte_macchiato.png'),
    category: 'milk',
    difficulty: 'intermediate',
    prepTime: '2 min',
    inputGrams: 18,
    outputGrams: 36,
    milkMl: 200,
    milkFoamDepth: '15-20mm foam',
    
    espressoMl: 30,
    foamMl: 30,
    ratio: '1:6 (espresso to milk)',
    temperature: '60-65°C (140-150°F)',
    description: 'Steamed milk "stained" with espresso, poured to create distinct layers. The reverse of a caffè latte.',
    flavorProfile: ['Layered', 'Milky', 'Visual appeal', 'Mild'],
    steps: [
      'Steam 200ml milk with thick foam',
      'Pour steamed milk into a tall glass',
      'Let it settle for 30 seconds',
      'Pull a double espresso',
      'Slowly pour espresso through the foam',
      'Watch the layers form'
    ],
    tips: [
      'Pour espresso slowly to maintain layers',
      'Use a tall, clear glass to show layers',
      'The espresso "stains" the milk'
    ]
  },
  {
    id: 'macchiato',
    name: 'Espresso Macchiato',
    subtitle: 'Espresso stained with foam',
    image: require('@/assets/images/coffees/macchiato.png'),
    category: 'milk',
    difficulty: 'beginner',
    prepTime: '1 min',
    inputGrams: 18,
    outputGrams: 36,
    extractionTime: '25-30 seconds',
    milkMl: 15,
    milkFoamDepth: 'Dollop of foam',
    
    espressoMl: 30,
    foamMl: 15,
    ratio: '4:1 (espresso to foam)',
    temperature: '60-65°C (140-150°F)',
    description: 'An espresso "marked" or "stained" with just a dollop of milk foam. Strong coffee with a hint of creaminess.',
    flavorProfile: ['Strong', 'Espresso-forward', 'Touch of cream', 'Bold'],
    steps: [
      'Pull a double espresso (18g → 36g)',
      'Steam a small amount of milk',
      'Spoon a dollop of foam onto espresso',
      'Serve immediately in a demitasse',
      'The foam should just "mark" the crema'
    ],
    tips: [
      'Not the same as a Starbucks "macchiato"',
      'Traditional Italian afternoon drink',
      'Just enough milk to cut the intensity'
    ]
  },
  {
    id: 'americano',
    name: 'Americano',
    subtitle: 'Espresso with hot water',
    image: require('@/assets/images/coffees/americano.png'),
    category: 'espresso',
    difficulty: 'beginner',
    prepTime: '1 min',
    inputGrams: 18,
    outputGrams: 36,
    extractionTime: '25-30 seconds',
    waterMl: 150,
    
    espressoMl: 60,
    ratio: '1:4 (espresso to water)',
    temperature: '90-95°C (194-203°F)',
    description: 'Espresso diluted with hot water, creating a coffee similar in strength to drip coffee but with espresso\'s flavor profile.',
    flavorProfile: ['Smooth', 'Less intense', 'Clean', 'Drip-like strength'],
    steps: [
      'Pull a double espresso (18g → 36g)',
      'Heat 150ml of water to 90-95°C',
      'Pour hot water into cup first',
      'Add espresso on top (preserves crema)',
      'Alternatively, add water to espresso',
      'Serve in a 200-250ml cup'
    ],
    tips: [
      'Water first = more crema preserved',
      'Espresso first = traditional method',
      'Adjust water amount to taste'
    ]
  },
  {
    id: 'cortado',
    name: 'Cortado',
    subtitle: 'Equal parts espresso and milk',
    image: require('@/assets/images/coffees/cortado.png'),
    category: 'milk',
    difficulty: 'beginner',
    prepTime: '1.5 min',
    inputGrams: 18,
    outputGrams: 36,
    extractionTime: '25-30 seconds',
    milkMl: 60,
    milkFoamDepth: 'Minimal foam',
    
    espressoMl: 30,
    ratio: '1:1 (espresso to milk)',
    temperature: '60-65°C (140-150°F)',
    description: 'A Spanish drink meaning "cut" - espresso cut with an equal amount of warm milk to reduce acidity. Small but perfectly balanced.',
    flavorProfile: ['Balanced', 'Smooth', 'Strong', 'Reduced acidity'],
    steps: [
      'Pull a double espresso (18g → 36g)',
      'Steam 60ml of milk with minimal foam',
      'Pour milk directly into espresso',
      'The milk should "cut" the espresso',
      'Serve in a small 120ml gibraltar glass'
    ],
    tips: [
      'Popular in Spain and Portugal',
      'Perfect afternoon pick-me-up',
      'Less milk than a flat white'
    ]
  },
  {
    id: 'moka-pot',
    name: 'Moka Pot Coffee',
    subtitle: 'Stovetop espresso-style',
    image: require('@/assets/images/coffees/moka_pot_coffee.png'),
    category: 'alternative',
    difficulty: 'beginner',
    prepTime: '5 min',
    inputGrams: 18,
    outputMl: 130,
    
    espressoMl: 120,
    ratio: '1:7 (coffee to water)',
    temperature: '100°C (212°F) starting water',
    description: 'Strong, rich coffee brewed on the stovetop using a Moka pot. Not true espresso, but a beloved Italian tradition.',
    flavorProfile: ['Strong', 'Rich', 'Slightly bitter', 'Full-bodied'],
    steps: [
      'Fill bottom chamber with boiling water to valve',
      'Add 18-20g medium-fine ground coffee to basket',
      'Level grounds without tamping',
      'Assemble pot (use cloth - it\'s hot!)',
      'Place on medium-low heat',
      'Remove when coffee starts sputtering',
      'Run cold water on base to stop extraction'
    ],
    tips: [
      'Use pre-boiled water to prevent bitter taste',
      'Never tamp the coffee grounds',
      'Remove from heat before sputtering ends',
      'Clean with hot water only, no soap'
    ]
  },
  {
    id: 'french-press',
    name: 'French Press',
    subtitle: 'Immersion brewer',
    image: require('@/assets/images/coffees/french_press.png'),
    category: 'alternative',
    difficulty: 'beginner',
    prepTime: '5 min',
    inputGrams: 30,
    waterMl: 500,
    ratio: '1:16.7',
    temperature: '94°C (201°F)',
    description: 'A classic immersion brewing method that produces a full-bodied, rich, and textured cup of coffee by steeping grounds directly in water.',
    flavorProfile: ['Full-bodied', 'Robust', 'Rich', 'Textured'],
    steps: [
      'Grind 30g of coffee coarsely (like breadcrumbs)',
      'Add coffee grounds to the French press beaker',
      'Pour 500g of hot water (94°C), wetting all grounds',
      'Let it steep for 4 minutes',
      'Stir the top crust gently, let grounds settle for 1 minute',
      'Insert plunger and press down slowly with even pressure',
      'Pour immediately into cups to avoid over-extraction'
    ],
    tips: [
      'If coffee feels muddy, use a slightly coarser grind',
      'Clean the mesh filter thoroughly after each use to prevent old oils from spoiling flavor',
      'Scoop off the top foam/crust before plunging for a cleaner cup'
    ]
  },
  {
    id: 'affogato',
    name: 'Affogato',
    subtitle: 'Espresso over gelato',
    image: require('@/assets/images/coffees/affogato.png'),
    category: 'alternative',
    difficulty: 'beginner',
    prepTime: '2 min',
    inputGrams: 18,
    espressoMl: 36,
    ratio: '1 scoop gelato : 1 shot espresso',
    temperature: '93°C (200°F) espresso',
    description: 'A simple, elegant Italian dessert-beverage featuring a scoop of cold vanilla gelato drowned in a hot, freshly pulled shot of espresso.',
    flavorProfile: ['Sweet', 'Creamy', 'Contrast', 'Indulgent'],
    steps: [
      'Chill a small glass or dessert bowl in the freezer',
      'Pull a high-quality double espresso shot (18g in, 36g out)',
      'Place one large scoop of premium vanilla gelato or ice cream in the chilled dish',
      'Pour the hot espresso directly over the gelato immediately',
      'Serve with a small spoon'
    ],
    tips: [
      'Use high-quality vanilla bean gelato rather than standard ice cream',
      'Chilling the dish keeps the gelato from melting too quickly',
      'Try with a ristretto for an even sweeter, more concentrated flavor'
    ]
  },
  {
    id: 'turkish-coffee',
    name: 'Turkish Coffee',
    subtitle: 'Traditional cezve brew',
    image: require('@/assets/images/coffees/turkish_coffee.png'),
    category: 'alternative',
    difficulty: 'intermediate',
    prepTime: '4 min',
    inputGrams: 7,
    waterMl: 70,
    ratio: '1:10',
    temperature: 'Simmered on heat',
    description: 'An ancient brewing method where extra-fine coffee grounds are simmered with water in a copper pot (cezve), serving unfiltered with foam.',
    flavorProfile: ['Strong', 'Unfiltered', 'Foamy', 'Traditional'],
    steps: [
      'Grind 7g of coffee beans to an extra-fine powder (finer than espresso)',
      'Add coffee and 70ml of cold water to the cezve (sugar optional)',
      'Stir well to mix, then place on low heat',
      'Let it heat slowly without stirring; watch for foam rising',
      'Just as it starts to boil and foam rises, remove from heat',
      'Pour a bit of foam into the cup, return cezve to heat for a second rise',
      'Pour the unfiltered coffee slowly into the cup',
      'Wait 1-2 minutes for grounds to settle to the bottom before drinking'
    ],
    tips: [
      'Never let the coffee boil vigorously, only let the foam rise',
      'Do not stir after placing on heat to preserve the foam layer',
      'Serve with a glass of water to cleanse the palate'
    ]
  },
  {
    id: 'irish-coffee',
    name: 'Irish Coffee',
    subtitle: 'With whiskey & cream',
    image: require('@/assets/images/coffees/irish_coffee.png'),
    category: 'alternative',
    difficulty: 'intermediate',
    prepTime: '5 min',
    inputGrams: 15,
    waterMl: 120,
    ratio: '120ml coffee : 40ml whiskey : 30ml cream',
    temperature: 'Hot coffee, cold cream',
    description: 'A warming cocktail of hot specialty filter coffee, Irish whiskey, and brown sugar, topped with a thick layer of cold, lightly whipped cream.',
    flavorProfile: ['Warm', 'Sweet', 'Spirited', 'Creamy contrast'],
    steps: [
      'Warm a stemmed Irish coffee glass with hot water, then discard water',
      'Pour 120ml of hot brewed filter coffee into the glass',
      'Add 1-2 teaspoons of brown sugar and stir until fully dissolved',
      'Add 40ml of Irish whiskey and stir to combine',
      'Lightly whip 30ml of cold heavy cream until it thickens but remains pourable',
      'Pour the cream slowly over the back of a spoon to float it on top',
      'Drink the hot coffee through the cold layer of cream (do not stir)'
    ],
    tips: [
      'Brown sugar is essential; it helps the cream float by increasing density',
      'Do not over-whip the cream; it should be pourable, not stiff peaks',
      'Use a clean, balanced filter coffee like Colombian or Guatemalan'
    ]
  },
  {
    id: 'v60-pour-over',
    name: 'V60 Pour Over',
    subtitle: 'Drip filter method',
    image: require('@/assets/images/coffees/v60_pour_over.png'),
    category: 'alternative',
    difficulty: 'advanced',
    prepTime: '3 min',
    inputGrams: 15,
    waterMl: 250,
    ratio: '1:16.6',
    temperature: '93°C (200°F)',
    description: 'A clean, bright drip brewing method that highlights the subtle floral and fruity acidity of specialty coffee using a conical V60 dripper.',
    flavorProfile: ['Clean', 'Bright acidity', 'Clarity', 'Nuanced'],
    steps: [
      'Fold and place filter paper in V60, rinse with hot water to remove paper taste',
      'Grind 15g coffee to medium-fine consistency (like table salt) and add to filter',
      'Pour 45g of water (93°C) to bloom for 30-45 seconds, allowing degassing',
      'Pour in concentric circles up to 150g in a gentle, steady stream',
      'Let water draw down slightly, then pour up to 250g',
      'Swirl the dripper gently at the end for an even bed',
      'Target draw-down completion at 2:30 to 3:00 minutes'
    ],
    tips: [
      'Use a gooseneck kettle for precise water flow control',
      'Adjust grind finer if water drains too fast, coarser if it stalls',
      'Best suited for light-roast single-origin coffees'
    ]
  },
  {
    id: 'cold-brew',
    name: 'Cold Brew',
    subtitle: 'Slow cold-steeped',
    image: require('@/assets/images/coffees/cold_brew.png'),
    category: 'alternative',
    difficulty: 'beginner',
    prepTime: '12-24 hrs',
    inputGrams: 80,
    waterMl: 800,
    ratio: '1:10',
    temperature: 'Room temp or cold',
    description: 'A smooth, low-acid coffee brewed by steeping coarse grounds in cold water for a long period, resulting in a naturally sweet concentrate.',
    flavorProfile: ['Smooth', 'Low-acid', 'Naturally sweet', 'Chocolatey'],
    steps: [
      'Grind 80g of coffee extra-coarsely (like peppercorns)',
      'Add coffee grounds and 800ml of cold filtered water to a large jar',
      'Stir gently to ensure all grounds are wet, then seal the jar',
      'Steep in the refrigerator or room temperature for 12 to 18 hours',
      'Strain the mixture through a fine mesh sieve, then through paper filter',
      'Dilute the cold brew concentrate with water or milk (1:1 ratio) to serve'
    ],
    tips: [
      'Double-filter through paper to remove silt and create a clean cup',
      'Keep the concentrate refrigerated; it stays fresh for up to two weeks',
      'Perfect base for iced coffee drinks'
    ]
  },
  {
    id: 'iced-latte',
    name: 'Iced Latte',
    subtitle: 'Chilled espresso & milk',
    image: require('@/assets/images/coffees/iced_latte.png'),
    category: 'milk',
    difficulty: 'beginner',
    prepTime: '2 min',
    inputGrams: 18,
    espressoMl: 36,
    milkMl: 150,
    ratio: '1:4 (espresso to milk)',
    temperature: 'Cold / Iced',
    description: 'A refreshing, creamy drink made with rich espresso shots poured over cold milk and ice cubes in a tall glass.',
    flavorProfile: ['Refreshing', 'Creamy', 'Smooth', 'Mild'],
    steps: [
      'Pull a double espresso shot (18g in, 36g out) and let it cool slightly',
      'Fill a tall glass (350ml) to the top with ice cubes',
      'Pour 150ml of cold milk over the ice',
      'Pour the espresso shot slowly over the top to create a layered effect',
      'Stir gently before drinking'
    ],
    tips: [
      'Use whole milk or oat milk for a creamier texture',
      'Add simple syrup or vanilla syrup before pouring espresso if sweetness is desired',
      'Pouring the espresso slowly onto an ice cube helps preserve the layered look'
    ]
  }
];

export const getCoffeeById = (id: string): CoffeeRecipe | undefined => {
  return coffeeRecipes.find(coffee => coffee.id === id);
};

export const getCoffeesByCategory = (category: CoffeeRecipe['category']): CoffeeRecipe[] => {
  return coffeeRecipes.filter(coffee => coffee.category === category);
};
