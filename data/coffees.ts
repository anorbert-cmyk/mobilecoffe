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
    image: require('@/assets/images/espresso.png'),
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
    image: require('@/assets/images/double_espresso.png'),
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
    image: require('@/assets/images/ristretto.png'),
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
    image: require('@/assets/images/lungo.png'),
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
    image: require('@/assets/images/flat_white.png'),
    category: 'milk',
    difficulty: 'intermediate',
    prepTime: '2 min',
    inputGrams: 18,
    outputGrams: 36,
    extractionTime: '25-30 seconds',
    milkMl: 110,
    milkFoamDepth: '1-2mm microfoam',
    
    espressoMl: 60,    ratio: '1:3 (espresso to milk)',
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
    image: require('@/assets/images/cappuccino.png'),
    category: 'milk',
    difficulty: 'intermediate',
    prepTime: '2 min',
    inputGrams: 18,
    outputGrams: 36,
    extractionTime: '25-30 seconds',    milkFoamDepth: '1cm thick foam',
    
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
    image: require('@/assets/images/latte.png'),
    category: 'milk',
    difficulty: 'beginner',
    prepTime: '2 min',
    inputGrams: 18,
    outputGrams: 36,
    extractionTime: '25-30 seconds',
    milkMl: 200,
    milkFoamDepth: '5-10mm foam',
    
    espressoMl: 60,    foamMl: 20,
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
    image: require('@/assets/images/latte_macchiato.png'),
    category: 'milk',
    difficulty: 'intermediate',
    prepTime: '2 min',
    inputGrams: 18,
    outputGrams: 36,
    milkMl: 200,
    milkFoamDepth: '15-20mm foam',
    
    espressoMl: 30,    foamMl: 30,
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
    image: require('@/assets/images/macchiato.png'),
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
    image: require('@/assets/images/americano.png'),
    category: 'espresso',
    difficulty: 'beginner',
    prepTime: '1 min',
    inputGrams: 18,
    outputGrams: 36,
    extractionTime: '25-30 seconds',
    waterMl: 150,
    
    espressoMl: 60,    ratio: '1:4 (espresso to water)',
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
    image: require('@/assets/images/cortado.png'),
    category: 'milk',
    difficulty: 'beginner',
    prepTime: '1.5 min',
    inputGrams: 18,
    outputGrams: 36,
    extractionTime: '25-30 seconds',
    milkMl: 60,
    milkFoamDepth: 'Minimal foam',
    
    espressoMl: 30,    ratio: '1:1 (espresso to milk)',
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
    image: require('@/assets/images/moka_pot_coffee.png'),
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
  }
];

export const getCoffeeById = (id: string): CoffeeRecipe | undefined => {
  return coffeeRecipes.find(coffee => coffee.id === id);
};

export const getCoffeesByCategory = (category: CoffeeRecipe['category']): CoffeeRecipe[] => {
  return coffeeRecipes.filter(coffee => coffee.category === category);
};
