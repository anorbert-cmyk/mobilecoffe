// Equipment Images
import brevilleBambinoPlus from '@/assets/images/equipment/breville-bambino-plus.png';
import gaggiaClassicPro from '@/assets/images/equipment/gaggia-classic-pro.png';
import delonghiStilosa from '@/assets/images/equipment/delonghi-stilosa.png';
import brevilleExpressImpress from '@/assets/images/equipment/breville-barista-express-impress.png';
import brevilleBaristaPro from '@/assets/images/equipment/breville-barista-pro.png';
import rancilioSilvia from '@/assets/images/equipment/rancilio-silvia.png';
import delonghiSpecialistaTouch from '@/assets/images/equipment/delonghi-specialista-touch.png';
import lelitMarax from '@/assets/images/equipment/lelit-marax.png';
import brevilleOracleJet from '@/assets/images/equipment/breville-oracle-jet.png';
import brevilleOracleDualBoiler from '@/assets/images/equipment/breville-oracle-dual-boiler.png';
import baratzaEncoreEsp from '@/assets/images/equipment/baratza-encore-esp.png';
import baratzaSette270 from '@/assets/images/equipment/baratza-sette-270.png';
import eurekaMignonSpecialita from '@/assets/images/equipment/eureka-mignon-specialita.png';
import nicheZero from '@/assets/images/equipment/niche-zero.png';
import baratzaSette270wi from '@/assets/images/equipment/baratza-sette-270wi.png';

export interface EspressoMachine {
  id: string;
  name: string;
  brand: string;
  model: string;
  type: 'manual' | 'semi-automatic' | 'automatic' | 'super-automatic';
  priceRange: 'budget' | 'mid-range' | 'premium' | 'prosumer';
  price: number; // in USD
  image?: string;
  rating: number; // out of 5
  description: string;
  
  // Specifications
  boilerType: 'single' | 'dual' | 'heat-exchanger' | 'thermoblock';
  pumpPressure: number; // in bars
  waterTankMl: number;
  portafilterSize: number; // in mm
  
  // Features
  features: string[];
  
  // Optimal settings
  brewTemperature: {
    celsius: number;
    fahrenheit: number;
    note?: string;
  };
  preInfusion?: {
    available: boolean;
    recommendedSeconds?: number;
  };
  
  // Recommended grind settings (generic scale 1-10, 1=finest)
  grindSetting: {
    min: number;
    max: number;
    sweet_spot: number;
    note: string;
  };
  
  // Tips
  tips: string[];
  
  // Maintenance
  maintenance: {
    backflush: boolean;
    backflushFrequency?: string;
    descaleFrequency: string;
    groupHeadClean: string;
  };
  
  // Best for
  bestFor: string[];
}

export interface CoffeeGrinder {
  id: string;
  name: string;
  brand: string;
  model: string;
  type: 'manual' | 'electric';
  burrType: 'flat' | 'conical';
  burrSize: number; // in mm
  priceRange: 'budget' | 'mid-range' | 'premium';
  price: number; // in USD
  image?: string;
  rating: number; // out of 5
  description: string;
  
  // Features
  features: string[];
  grindSettings: number | 'stepless';
  retention: 'low' | 'medium' | 'high';
  
  // Recommended for
  bestFor: string[];
  
  // Tips
  tips: string[];
}

// Real Espresso Machines Database
export const espressoMachines: EspressoMachine[] = [
  // Budget Category
  {
    id: 'breville-bambino-plus',
    name: 'Bambino Plus',
    brand: 'Breville',
    model: 'BES500BSS',
    type: 'semi-automatic',
    priceRange: 'budget',
    price: 372,
    rating: 4.8,
    description: 'Compact espresso machine with PID temperature control and automatic milk frothing. Fast 3-second heat-up time makes it perfect for small kitchens.',
    image: brevilleBambinoPlus,
    boilerType: 'thermoblock',
    pumpPressure: 15,
    waterTankMl: 1900,
    portafilterSize: 54,
    features: [
      'PID temperature control',
      'Automatic milk frothing',
      '3-second heat-up',
      'Compact design',
      'Excellent temperature consistency'
    ],
    brewTemperature: {
      celsius: 93,
      fahrenheit: 200,
      note: 'Non-changeable, optimized for most beans'
    },
    preInfusion: {
      available: true,
      recommendedSeconds: 7
    },
    grindSetting: {
      min: 3,
      max: 5,
      sweet_spot: 4,
      note: 'Fine espresso grind, adjust based on extraction time'
    },
    tips: [
      'Preheat the machine for 10 minutes before first shot',
      'Use fresh, quality beans for best results',
      'Aim for 25-30 second extraction time',
      'Clean the steam wand immediately after use'
    ],
    maintenance: {
      backflush: false,
      descaleFrequency: 'Every 2-3 months',
      groupHeadClean: 'Weekly wipe with damp cloth'
    },
    bestFor: ['Beginners', 'Small kitchens', 'Quick morning routine']
  },
  {
    id: 'gaggia-classic-pro',
    name: 'Classic Pro',
    brand: 'Gaggia',
    model: 'RI9380/46',
    type: 'semi-automatic',
    priceRange: 'budget',
    price: 452,
    rating: 4.5,
    description: 'Commercial-style 58mm portafilter with brass boiler. Highly moddable and beloved by enthusiasts for its durability and upgrade potential.',
    image: gaggiaClassicPro,
    boilerType: 'single',
    pumpPressure: 15,
    waterTankMl: 2100,
    portafilterSize: 58,
    features: [
      'Commercial 58mm portafilter',
      'Brass boiler',
      '3-way solenoid valve',
      'Highly moddable',
      'Professional steam wand'
    ],
    brewTemperature: {
      celsius: 95,
      fahrenheit: 203,
      note: 'Temperature surfing recommended'
    },
    preInfusion: {
      available: false
    },
    grindSetting: {
      min: 3,
      max: 5,
      sweet_spot: 4,
      note: 'Fine grind, requires good grinder'
    },
    tips: [
      'Learn temperature surfing technique',
      'Consider PID mod for better temperature control',
      'Use 18g dose for double shot',
      'Backflush regularly to maintain performance'
    ],
    maintenance: {
      backflush: true,
      backflushFrequency: 'Weekly',
      descaleFrequency: 'Every 2-3 months',
      groupHeadClean: 'Daily after use'
    },
    bestFor: ['Enthusiasts', 'Tinkerers', 'Long-term investment']
  },
  {
    id: 'delonghi-stilosa',
    name: 'Stilosa',
    brand: 'DeLonghi',
    model: 'EC260BK',
    type: 'manual',
    priceRange: 'budget',
    price: 78,
    rating: 3.8,
    description: 'Ultra-budget espresso machine with manual milk frother. Perfect for absolute beginners wanting to try espresso without breaking the bank.',
    image: delonghiStilosa,
    boilerType: 'thermoblock',
    pumpPressure: 15,
    waterTankMl: 1000,
    portafilterSize: 51,
    features: [
      'Ultra-affordable',
      'Manual milk frother',
      'Compact footprint',
      'Simple operation'
    ],
    brewTemperature: {
      celsius: 90,
      fahrenheit: 194,
      note: 'Basic temperature control'
    },
    preInfusion: {
      available: false
    },
    grindSetting: {
      min: 4,
      max: 6,
      sweet_spot: 5,
      note: 'Medium-fine grind works best'
    },
    tips: [
      'Use pressurized basket for easier extraction',
      'Preheat cups for better temperature',
      'Practice milk frothing technique',
      'Manage expectations - this is entry-level'
    ],
    maintenance: {
      backflush: false,
      descaleFrequency: 'Every 2 months',
      groupHeadClean: 'Weekly'
    },
    bestFor: ['Absolute beginners', 'Tight budgets', 'Testing the waters']
  },
  
  // Mid-Range Category
  {
    id: 'breville-barista-express-impress',
    name: 'Barista Express Impress',
    brand: 'Breville',
    model: 'BES876BSS',
    type: 'semi-automatic',
    priceRange: 'mid-range',
    price: 581,
    rating: 4.9,
    description: 'All-in-one solution with integrated conical burr grinder and assisted tamping system. PID temperature control and automatic milk texturing make it perfect for home baristas.',
    image: brevilleExpressImpress,
    boilerType: 'thermoblock',
    pumpPressure: 15,
    waterTankMl: 2000,
    portafilterSize: 54,
    features: [
      'Integrated conical burr grinder',
      'Assisted tamping system',
      'PID temperature control',
      'Automatic milk texturing',
      'Dose control grinding'
    ],
    brewTemperature: {
      celsius: 93,
      fahrenheit: 200,
      note: 'Adjustable in 2°C increments'
    },
    preInfusion: {
      available: true,
      recommendedSeconds: 8
    },
    grindSetting: {
      min: 1,
      max: 25,
      sweet_spot: 8,
      note: 'Built-in grinder with 25 settings'
    },
    tips: [
      'Dial in grind size for your beans',
      'Use single-wall baskets for best results',
      'Clean grinder burrs monthly',
      'Purge grinder between changes'
    ],
    maintenance: {
      backflush: true,
      backflushFrequency: 'Weekly',
      descaleFrequency: 'Every 3 months',
      groupHeadClean: 'Daily'
    },
    bestFor: ['All-in-one seekers', 'Home baristas', 'Convenience lovers']
  },
  {
    id: 'breville-barista-pro',
    name: 'Barista Pro',
    brand: 'Breville',
    model: 'BES878BSS',
    type: 'semi-automatic',
    priceRange: 'mid-range',
    price: 651,
    rating: 4.6,
    description: 'Fast heat-up espresso machine with LCD display and integrated grinder. Perfect for those who value speed without sacrificing quality.',
    image: brevilleBaristaPro,
    boilerType: 'thermoblock',
    pumpPressure: 15,
    waterTankMl: 2000,
    portafilterSize: 54,
    features: [
      'Fast 30-second heat-up',
      'LCD display',
      'Integrated grinder',
      'Steam wand',
      'Digital temperature control'
    ],
    brewTemperature: {
      celsius: 93,
      fahrenheit: 200,
      note: 'PID controlled'
    },
    preInfusion: {
      available: true,
      recommendedSeconds: 7
    },
    grindSetting: {
      min: 1,
      max: 30,
      sweet_spot: 10,
      note: 'Built-in grinder with 30 settings'
    },
    tips: [
      'Use the LCD timer to track extraction',
      'Adjust grind size based on shot time',
      'Steam milk to 140-150°F for best texture',
      'Clean steam tip after each use'
    ],
    maintenance: {
      backflush: true,
      backflushFrequency: 'Weekly',
      descaleFrequency: 'Every 3 months',
      groupHeadClean: 'Daily'
    },
    bestFor: ['Speed-focused users', 'Tech enthusiasts', 'Busy mornings']
  },
  {
    id: 'rancilio-silvia',
    name: 'Silvia',
    brand: 'Rancilio',
    model: 'V6',
    type: 'semi-automatic',
    priceRange: 'mid-range',
    price: 995,
    rating: 4.7,
    description: 'Commercial-grade components with brass boiler. Excellent build quality and long-lasting durability make it a favorite among serious home baristas.',
    image: rancilioSilvia,
    boilerType: 'single',
    pumpPressure: 15,
    waterTankMl: 2500,
    portafilterSize: 58,
    features: [
      'Commercial-grade components',
      'Brass boiler',
      'Excellent build quality',
      'Manual control',
      'Long-lasting durability'
    ],
    brewTemperature: {
      celsius: 95,
      fahrenheit: 203,
      note: 'Temperature surfing required'
    },
    preInfusion: {
      available: false
    },
    grindSetting: {
      min: 3,
      max: 5,
      sweet_spot: 4,
      note: 'Fine espresso grind'
    },
    tips: [
      'Master temperature surfing',
      'Consider PID mod for consistency',
      'Use quality 58mm accessories',
      'Warm up for 20-30 minutes'
    ],
    maintenance: {
      backflush: true,
      backflushFrequency: 'Weekly',
      descaleFrequency: 'Every 3-4 months',
      groupHeadClean: 'Daily'
    },
    bestFor: ['Serious home baristas', 'Manual control lovers', 'Long-term investment']
  },
  {
    id: 'delonghi-specialista-touch',
    name: 'La Specialista Touch',
    brand: 'DeLonghi',
    model: 'EC9355M',
    type: 'semi-automatic',
    priceRange: 'mid-range',
    price: 892,
    rating: 4.4,
    description: 'Sensor grinding technology with active temperature control. Touchscreen interface and automatic milk frothing make it perfect for tech-savvy users.',
    image: delonghiSpecialistaTouch,
    boilerType: 'thermoblock',
    pumpPressure: 15,
    waterTankMl: 2000,
    portafilterSize: 51,
    features: [
      'Sensor grinding technology',
      'Active temperature control',
      'Automatic milk frothing',
      'Touchscreen interface',
      'Built-in grinder'
    ],
    brewTemperature: {
      celsius: 92,
      fahrenheit: 198,
      note: 'Active temperature control'
    },
    preInfusion: {
      available: true,
      recommendedSeconds: 6
    },
    grindSetting: {
      min: 1,
      max: 8,
      sweet_spot: 4,
      note: 'Sensor grinding with 8 settings'
    },
    tips: [
      'Use the sensor grinding feature',
      'Customize milk texture via touchscreen',
      'Clean milk system after each use',
      'Experiment with temperature settings'
    ],
    maintenance: {
      backflush: true,
      backflushFrequency: 'Weekly',
      descaleFrequency: 'Every 2 months',
      groupHeadClean: 'Daily'
    },
    bestFor: ['Tech-savvy users', 'Automation lovers', 'Milk drink enthusiasts']
  },
  
  // Premium Category
  {
    id: 'lelit-marax',
    name: 'MaraX',
    brand: 'Lelit',
    model: 'PL62X',
    type: 'semi-automatic',
    priceRange: 'premium',
    price: 1700,
    rating: 4.9,
    description: 'Italian-made heat exchanger machine with temperature configuration button. Insulated steam wand and PID control deliver commercial-quality results at home.',
    image: lelitMarax,
    boilerType: 'heat-exchanger',
    pumpPressure: 9,
    waterTankMl: 2500,
    portafilterSize: 58,
    features: [
      'Italian-made',
      'Temperature configuration button',
      'Insulated steam wand',
      'PID control',
      'E61 group head',
      'Back-to-back shot capability'
    ],
    brewTemperature: {
      celsius: 93,
      fahrenheit: 200,
      note: 'Three temperature modes for different roasts'
    },
    preInfusion: {
      available: true,
      recommendedSeconds: 10
    },
    grindSetting: {
      min: 2,
      max: 4,
      sweet_spot: 3,
      note: 'Fine espresso grind for E61'
    },
    tips: [
      'Use temperature mode 1 for light roasts',
      'Mode 2 for medium, Mode 3 for dark',
      'Flush group head before pulling shot',
      'Steam wand stays cool to touch'
    ],
    maintenance: {
      backflush: true,
      backflushFrequency: 'Daily',
      descaleFrequency: 'Every 6 months',
      groupHeadClean: 'Daily'
    },
    bestFor: ['Enthusiasts', 'Commercial quality seekers', 'Multiple drinks per session']
  },
  {
    id: 'breville-oracle-jet',
    name: 'Oracle Jet',
    brand: 'Breville',
    model: 'BES990BSS',
    type: 'super-automatic',
    priceRange: 'premium',
    price: 1820,
    rating: 4.8,
    description: 'Super-automatic with Baratza burrs, automatic grinding, dosing, tamping, and milk steaming. Touchscreen interface with shot timing alerts makes it the ultimate convenience machine.',
    image: brevilleOracleJet,
    boilerType: 'dual',
    pumpPressure: 15,
    waterTankMl: 2500,
    portafilterSize: 58,
    features: [
      'Fully automatic grinding (Baratza burrs)',
      'Automatic portioning',
      'Automatic tamping',
      'Touchscreen',
      'Automatic milk steaming',
      'Shot timing alerts',
      'Wheels for mobility',
      'Includes knockbox'
    ],
    brewTemperature: {
      celsius: 93,
      fahrenheit: 200,
      note: 'Fully automatic temperature control'
    },
    preInfusion: {
      available: true,
      recommendedSeconds: 8
    },
    grindSetting: {
      min: 1,
      max: 45,
      sweet_spot: 15,
      note: 'Automatic grind adjustment based on shot time'
    },
    tips: [
      'Let machine guide grind adjustments',
      'Customize milk foam preferences',
      'Use wheels to move for cleaning',
      'Perfect for beginners and experts alike'
    ],
    maintenance: {
      backflush: true,
      backflushFrequency: 'Automatic reminder',
      descaleFrequency: 'Automatic reminder',
      groupHeadClean: 'Automatic cleaning cycle'
    },
    bestFor: ['Convenience seekers', 'Beginners wanting automation', 'Busy households']
  },
  {
    id: 'breville-oracle-dual-boiler',
    name: 'Oracle Dual Boiler',
    brand: 'Breville',
    model: 'BES980XL',
    type: 'super-automatic',
    priceRange: 'prosumer',
    price: 3000,
    rating: 4.9,
    description: 'Dual stainless steel boilers with PID control. Automatic grinding, dosing, tamping, and microfoam milk texturing deliver ultimate convenience with professional results.',
    image: brevilleOracleDualBoiler,
    boilerType: 'dual',
    pumpPressure: 15,
    waterTankMl: 2500,
    portafilterSize: 58,
    features: [
      'Dual stainless steel boilers',
      'PID control',
      'Automatic grinding, dosing, tamping',
      'Microfoam milk texturing',
      'LCD display',
      'Programmable shot volumes'
    ],
    brewTemperature: {
      celsius: 93,
      fahrenheit: 200,
      note: 'Dual boiler allows simultaneous brewing and steaming'
    },
    preInfusion: {
      available: true,
      recommendedSeconds: 10
    },
    grindSetting: {
      min: 1,
      max: 45,
      sweet_spot: 18,
      note: 'Integrated grinder with conical burrs'
    },
    tips: [
      'Program your favorite drink profiles',
      'Use dual boiler for back-to-back drinks',
      'Automatic milk texturing is foolproof',
      'Perfect for entertaining guests'
    ],
    maintenance: {
      backflush: true,
      backflushFrequency: 'Automatic reminder',
      descaleFrequency: 'Automatic reminder',
      groupHeadClean: 'Automatic cleaning cycle'
    },
    bestFor: ['Ultimate convenience', 'Professional results', 'High-volume households']
  }
];

// Real Coffee Grinders Database
export const coffeeGrinders: CoffeeGrinder[] = [
  // Budget Category
  {
    id: 'baratza-encore-esp',
    name: 'Encore ESP',
    brand: 'Baratza',
    model: 'Encore ESP',
    type: 'electric',
    burrType: 'conical',
    burrSize: 40,
    priceRange: 'budget',
    price: 170,
    rating: 4.5,
    description: 'Entry-level espresso grinder with 40mm conical burrs. 16 grind settings optimized for espresso make it perfect for beginners.',
    image: baratzaEncoreEsp,
    features: [
      '40mm conical burrs',
      '16 grind settings',
      'Optimized for espresso',
      'Easy to use',
      'Affordable'
    ],
    grindSettings: 16,
    retention: 'low',
    bestFor: ['Beginners', 'Budget-conscious', 'First espresso grinder'],
    tips: [
      'Start at setting 8 and adjust',
      'Purge 1-2g between changes',
      'Clean burrs every 2 months',
      'Use for espresso only'
    ]
  },
  
  // Mid-Range Category
  {
    id: 'baratza-sette-270',
    name: 'Sette 270',
    brand: 'Baratza',
    model: 'Sette 270',
    type: 'electric',
    burrType: 'conical',
    burrSize: 40,
    priceRange: 'mid-range',
    price: 449,
    rating: 4.7,
    description: 'Espresso-focused grinder with 270 grind settings and low retention. Perfect for dialing in espresso with precision.',
    image: baratzaSette270,
    features: [
      '40mm conical burrs',
      '270 grind settings',
      'Low retention design',
      'Macro/micro adjustment',
      'Fast grinding'
    ],
    grindSettings: 270,
    retention: 'low',
    bestFor: ['Espresso enthusiasts', 'Precision seekers', 'Home baristas'],
    tips: [
      'Use macro for big changes, micro for fine-tuning',
      'Grind directly into portafilter',
      'Clean regularly to maintain low retention',
      'Excellent for single-dosing'
    ]
  },
  {
    id: 'eureka-mignon-specialita',
    name: 'Mignon Specialita',
    brand: 'Eureka',
    model: 'Mignon Specialita',
    type: 'electric',
    burrType: 'flat',
    burrSize: 55,
    priceRange: 'mid-range',
    price: 499,
    rating: 4.8,
    description: 'Quiet flat burr grinder with 55mm burrs and stepless adjustment. Perfect for home baristas who value precision and low noise.',
    image: eurekaMignonSpecialita,
    features: [
      '55mm flat burrs',
      'Stepless adjustment',
      'Quiet operation',
      'Programmable dosing',
      'Low retention'
    ],
    grindSettings: 'stepless',
    retention: 'low',
    bestFor: ['Home baristas', 'Quiet operation seekers', 'Precision lovers'],
    tips: [
      'Program doses for consistency',
      'Stepless adjustment allows fine-tuning',
      'Very quiet compared to other grinders',
      'Clean burrs every 3 months'
    ]
  },
  
  // Premium Category
  {
    id: 'niche-zero',
    name: 'Niche Zero',
    brand: 'Niche',
    model: 'Niche Zero',
    type: 'electric',
    burrType: 'conical',
    burrSize: 63,
    priceRange: 'premium',
    price: 699,
    rating: 4.9,
    description: 'Single-dosing grinder with 63mm conical burrs and zero retention. Perfect for enthusiasts who want to taste different beans without waste.',
    image: nicheZero,
    features: [
      '63mm conical burrs',
      'Zero retention design',
      'Stepless adjustment',
      'Single-dosing workflow',
      'Beautiful design'
    ],
    grindSettings: 'stepless',
    retention: 'low',
    bestFor: ['Single-dosing enthusiasts', 'Bean rotators', 'Premium quality seekers'],
    tips: [
      'Weigh beans before grinding',
      'Perfect for trying different beans',
      'Stepless adjustment is very precise',
      'Clean burrs every 6 months'
    ]
  },
  {
    id: 'baratza-sette-270wi',
    name: 'Sette 270Wi',
    brand: 'Baratza',
    model: 'Sette 270Wi',
    type: 'electric',
    burrType: 'conical',
    burrSize: 40,
    priceRange: 'premium',
    price: 699,
    rating: 4.6,
    description: 'Precision grinder with built-in scale and programmable dosing. 270 grind settings and weight-based dosing deliver ultimate consistency.',
    image: baratzaSette270wi,
    features: [
      '40mm conical burrs',
      'Built-in scale',
      'Programmable dosing',
      '270 grind settings',
      'Weight-based dosing'
    ],
    grindSettings: 270,
    retention: 'low',
    bestFor: ['Precision seekers', 'Consistency lovers', 'Tech enthusiasts'],
    tips: [
      'Program weight-based doses',
      'Scale ensures consistency',
      'Perfect for dialing in recipes',
      'Clean scale platform regularly'
    ]
  }
];


// Helper functions
export function getMachineById(id: string): EspressoMachine | undefined {
  return espressoMachines.find(m => m.id === id);
}

export function getGrinderById(id: string): CoffeeGrinder | undefined {
  return coffeeGrinders.find(g => g.id === id);
}
