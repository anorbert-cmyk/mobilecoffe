export interface EspressoMachine {
  id: string;
  name: string;
  brand: string;
  type: 'manual' | 'semi-automatic' | 'automatic' | 'super-automatic';
  priceRange: 'budget' | 'mid-range' | 'premium' | 'prosumer';
  image?: string;
  
  // Specifications
  boilerType: 'single' | 'dual' | 'heat-exchanger' | 'thermoblock';
  pumpPressure: number; // in bars
  waterTankMl: number;
  
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
}

export interface CoffeeGrinder {
  id: string;
  name: string;
  brand: string;
  type: 'manual' | 'electric';
  burrType: 'flat' | 'conical';
  burrSize: number; // in mm
  priceRange: 'budget' | 'mid-range' | 'premium' | 'prosumer';
  
  // Grind settings for espresso
  espressoRange: {
    min: number;
    max: number;
    startingPoint: number;
    note: string;
  };
  
  // Settings for other brew methods
  filterRange?: {
    min: number;
    max: number;
  };
  
  tips: string[];
}

export const espressoMachines: EspressoMachine[] = [
  // Budget Machines
  {
    id: 'delonghi-dedica',
    name: 'Dedica EC685',
    brand: 'De\'Longhi',
    type: 'semi-automatic',
    priceRange: 'budget',
    boilerType: 'thermoblock',
    pumpPressure: 15,
    waterTankMl: 1100,
    brewTemperature: {
      celsius: 92,
      fahrenheit: 198,
      note: 'Fixed temperature, may run slightly hot'
    },
    grindSetting: {
      min: 1,
      max: 4,
      sweet_spot: 2,
      note: 'Requires very fine grind due to pressurized basket'
    },
    preInfusion: {
      available: false
    },
    tips: [
      'Use the unpressurized basket for better results',
      'Temperature surfing: flush before pulling shot',
      'Upgrade to a bottomless portafilter for better feedback',
      'Let machine warm up for 15-20 minutes'
    ],
    maintenance: {
      backflush: false,
      descaleFrequency: 'Every 2-3 months',
      groupHeadClean: 'Wipe after each use'
    }
  },
  {
    id: 'gaggia-classic-pro',
    name: 'Classic Pro',
    brand: 'Gaggia',
    type: 'semi-automatic',
    priceRange: 'mid-range',
    boilerType: 'single',
    pumpPressure: 15,
    waterTankMl: 2100,
    brewTemperature: {
      celsius: 93,
      fahrenheit: 200,
      note: 'Can be modded with PID for precise control'
    },
    grindSetting: {
      min: 1,
      max: 5,
      sweet_spot: 3,
      note: 'Use non-pressurized basket for best results'
    },
    preInfusion: {
      available: true,
      recommendedSeconds: 3
    },
    tips: [
      'Install OPV spring mod to reduce pressure to 9 bar',
      'PID mod highly recommended for temperature stability',
      'Use 18g dose in double basket',
      'Warm up time: 20-25 minutes for thermal stability'
    ],
    maintenance: {
      backflush: true,
      backflushFrequency: 'Weekly with water, monthly with detergent',
      descaleFrequency: 'Every 3-4 months',
      groupHeadClean: 'After each session'
    }
  },
  {
    id: 'breville-bambino-plus',
    name: 'Bambino Plus',
    brand: 'Breville',
    type: 'semi-automatic',
    priceRange: 'mid-range',
    boilerType: 'thermoblock',
    pumpPressure: 15,
    waterTankMl: 1900,
    brewTemperature: {
      celsius: 93,
      fahrenheit: 200,
      note: 'PID controlled, adjustable in settings'
    },
    grindSetting: {
      min: 1,
      max: 5,
      sweet_spot: 3,
      note: 'Works well with 54mm portafilter'
    },
    preInfusion: {
      available: true,
      recommendedSeconds: 5
    },
    tips: [
      'Auto-steam wand is great for beginners',
      '3-second heat-up time is industry-leading',
      'Use 18-19g dose for best extraction',
      'Automatic purge keeps group head clean'
    ],
    maintenance: {
      backflush: false,
      descaleFrequency: 'When prompted (based on water hardness)',
      groupHeadClean: 'Wipe after each use'
    }
  },
  {
    id: 'rancilio-silvia',
    name: 'Silvia',
    brand: 'Rancilio',
    type: 'semi-automatic',
    priceRange: 'mid-range',
    boilerType: 'single',
    pumpPressure: 15,
    waterTankMl: 2500,
    brewTemperature: {
      celsius: 96,
      fahrenheit: 205,
      note: 'Loses ~10°C between boiler and group. Set to 104°C/220°F'
    },
    grindSetting: {
      min: 1,
      max: 6,
      sweet_spot: 4,
      note: 'Commercial-style 58mm portafilter'
    },
    preInfusion: {
      available: false
    },
    tips: [
      'Temperature surfing is essential without PID',
      'Flush until brew light turns off, wait 20 sec, then pull',
      'PID mod transforms this machine',
      'Heavy brass group head provides excellent thermal stability once heated'
    ],
    maintenance: {
      backflush: true,
      backflushFrequency: 'Weekly',
      descaleFrequency: 'Every 2-3 months',
      groupHeadClean: 'After each session'
    }
  },
  {
    id: 'breville-barista-express',
    name: 'Barista Express',
    brand: 'Breville',
    type: 'semi-automatic',
    priceRange: 'mid-range',
    boilerType: 'thermoblock',
    pumpPressure: 15,
    waterTankMl: 2000,
    brewTemperature: {
      celsius: 93,
      fahrenheit: 200,
      note: 'PID controlled with adjustable temperature'
    },
    grindSetting: {
      min: 5,
      max: 12,
      sweet_spot: 8,
      note: 'Built-in grinder: inner burr 3-6, grind size 5-12'
    },
    preInfusion: {
      available: true,
      recommendedSeconds: 4
    },
    tips: [
      'Start with grind size 5, inner burr 6',
      'Use 18-19g dose for double shot',
      'Built-in grinder is decent but external grinder recommended for upgrade',
      'Clean grinder weekly to prevent stale coffee buildup'
    ],
    maintenance: {
      backflush: true,
      backflushFrequency: 'Monthly with cleaning tablet',
      descaleFrequency: 'When prompted',
      groupHeadClean: 'Wipe after each use'
    }
  },
  {
    id: 'lelit-anna-pid',
    name: 'Anna PL41TEM',
    brand: 'Lelit',
    type: 'semi-automatic',
    priceRange: 'mid-range',
    boilerType: 'single',
    pumpPressure: 15,
    waterTankMl: 2500,
    brewTemperature: {
      celsius: 94,
      fahrenheit: 201,
      note: 'Built-in PID for precise temperature control'
    },
    grindSetting: {
      min: 1,
      max: 5,
      sweet_spot: 3,
      note: '57mm portafilter, use IMS precision basket'
    },
    preInfusion: {
      available: true,
      recommendedSeconds: 3
    },
    tips: [
      'Built-in PID eliminates need for temperature surfing',
      'Manometer helps dial in pressure',
      'Great value for PID-equipped machine',
      'Use 16-17g dose for 57mm basket'
    ],
    maintenance: {
      backflush: true,
      backflushFrequency: 'Weekly',
      descaleFrequency: 'Every 3 months',
      groupHeadClean: 'After each session'
    }
  },
  // Premium/Prosumer
  {
    id: 'breville-dual-boiler',
    name: 'Dual Boiler BES920',
    brand: 'Breville',
    type: 'semi-automatic',
    priceRange: 'prosumer',
    boilerType: 'dual',
    pumpPressure: 15,
    waterTankMl: 2500,
    brewTemperature: {
      celsius: 93,
      fahrenheit: 200,
      note: 'Adjustable 86-96°C, PID controlled'
    },
    grindSetting: {
      min: 1,
      max: 5,
      sweet_spot: 3,
      note: '58mm commercial portafilter'
    },
    preInfusion: {
      available: true,
      recommendedSeconds: 6
    },
    tips: [
      'True dual boiler allows simultaneous brewing and steaming',
      'Shot timer built-in for consistency',
      'Adjustable pre-infusion pressure and time',
      'Over-pressure valve set to 9 bar from factory'
    ],
    maintenance: {
      backflush: true,
      backflushFrequency: 'Weekly',
      descaleFrequency: 'Every 3-4 months',
      groupHeadClean: 'After each session'
    }
  },
  {
    id: 'profitec-pro-300',
    name: 'Pro 300',
    brand: 'Profitec',
    type: 'semi-automatic',
    priceRange: 'prosumer',
    boilerType: 'dual',
    pumpPressure: 9,
    waterTankMl: 2800,
    brewTemperature: {
      celsius: 94,
      fahrenheit: 201,
      note: 'PID controlled, highly stable'
    },
    grindSetting: {
      min: 1,
      max: 5,
      sweet_spot: 3,
      note: 'E61 group head, 58mm portafilter'
    },
    preInfusion: {
      available: true,
      recommendedSeconds: 5
    },
    tips: [
      'E61 group head provides excellent temperature stability',
      'True 9 bar pressure from factory',
      'Allow 25-30 minutes warm-up for E61',
      'Flush group head before pulling shot'
    ],
    maintenance: {
      backflush: true,
      backflushFrequency: 'Weekly',
      descaleFrequency: 'Every 4-6 months',
      groupHeadClean: 'After each session, lubricate cam lever monthly'
    }
  }
];

export const coffeeGrinders: CoffeeGrinder[] = [
  // Manual Grinders
  {
    id: '1zpresso-jx-pro',
    name: 'JX-Pro',
    brand: '1Zpresso',
    type: 'manual',
    burrType: 'conical',
    burrSize: 48,
    priceRange: 'mid-range',
    espressoRange: {
      min: 12,
      max: 18,
      startingPoint: 15,
      note: 'Each click = 12.5 microns. Start at 1.5.0 (15 clicks)'
    },
    filterRange: {
      min: 24,
      max: 36
    },
    tips: [
      'Excellent value for espresso grinding',
      'Consistent grind quality rivals electric grinders',
      'Clean burrs every 2-3 weeks',
      'Zero point may shift - recalibrate monthly'
    ]
  },
  {
    id: 'comandante-c40',
    name: 'C40 MK4',
    brand: 'Comandante',
    type: 'manual',
    burrType: 'conical',
    burrSize: 39,
    priceRange: 'premium',
    espressoRange: {
      min: 8,
      max: 14,
      startingPoint: 10,
      note: 'Each click = 30 microns. Need Red Clix for espresso'
    },
    filterRange: {
      min: 20,
      max: 32
    },
    tips: [
      'Red Clix accessory essential for espresso',
      'Legendary build quality and consistency',
      'Better suited for filter, but capable for espresso',
      'Clean with included brush after each use'
    ]
  },
  {
    id: 'timemore-chestnut-c3',
    name: 'Chestnut C3',
    brand: 'Timemore',
    type: 'manual',
    burrType: 'conical',
    burrSize: 38,
    priceRange: 'budget',
    espressoRange: {
      min: 8,
      max: 14,
      startingPoint: 10,
      note: 'Each click = 22 microns. Good entry-level option'
    },
    filterRange: {
      min: 18,
      max: 28
    },
    tips: [
      'Great budget option for beginners',
      'May struggle with very light roasts',
      'Upgrade to S2C burrs for better espresso',
      'Calibrate zero point before first use'
    ]
  },
  // Electric Grinders
  {
    id: 'baratza-sette-270',
    name: 'Sette 270',
    brand: 'Baratza',
    type: 'electric',
    burrType: 'conical',
    burrSize: 40,
    priceRange: 'mid-range',
    espressoRange: {
      min: 5,
      max: 15,
      startingPoint: 9,
      note: 'Macro 1-9, Micro A-S. Start at 9E for medium roast'
    },
    filterRange: {
      min: 20,
      max: 31
    },
    tips: [
      'Excellent grind speed and low retention',
      'Stepless micro adjustment for fine-tuning',
      'Gearbox may need replacement after 2-3 years',
      'Great for medium to dark roasts'
    ]
  },
  {
    id: 'eureka-mignon-specialita',
    name: 'Mignon Specialita',
    brand: 'Eureka',
    type: 'electric',
    burrType: 'flat',
    burrSize: 55,
    priceRange: 'mid-range',
    espressoRange: {
      min: 1,
      max: 3,
      startingPoint: 2,
      note: 'Stepless adjustment. Mark your sweet spot with tape'
    },
    tips: [
      'Quiet operation with anti-clump technology',
      'Flat burrs produce excellent clarity',
      'Very low retention (<0.5g)',
      'Touch screen timer for precise dosing'
    ]
  },
  {
    id: 'niche-zero',
    name: 'Zero',
    brand: 'Niche',
    type: 'electric',
    burrType: 'conical',
    burrSize: 63,
    priceRange: 'premium',
    espressoRange: {
      min: 10,
      max: 20,
      startingPoint: 15,
      note: 'Stepless 0-50 scale. Espresso typically 10-20'
    },
    filterRange: {
      min: 30,
      max: 50
    },
    tips: [
      'Single-dose design with near-zero retention',
      'Easy to switch between espresso and filter',
      'Large 63mm conical burrs for excellent flavor',
      'Clean weekly with included brush'
    ]
  },
  {
    id: 'df64',
    name: 'DF64',
    brand: 'Turin',
    type: 'electric',
    burrType: 'flat',
    burrSize: 64,
    priceRange: 'mid-range',
    espressoRange: {
      min: 10,
      max: 25,
      startingPoint: 18,
      note: 'Stepless. Mark position for different coffees'
    },
    filterRange: {
      min: 35,
      max: 55
    },
    tips: [
      'Excellent value single-dose grinder',
      'Upgrade to SSP burrs for even better results',
      'Add RDT (Ross Droplet Technique) to reduce static',
      'Bellows help clear retention'
    ]
  },
  {
    id: 'breville-smart-grinder-pro',
    name: 'Smart Grinder Pro',
    brand: 'Breville',
    type: 'electric',
    burrType: 'conical',
    burrSize: 40,
    priceRange: 'budget',
    espressoRange: {
      min: 5,
      max: 15,
      startingPoint: 8,
      note: '60 settings total. Espresso range typically 5-15'
    },
    filterRange: {
      min: 25,
      max: 45
    },
    tips: [
      'Great entry-level electric grinder',
      'Digital timer for consistent dosing',
      'Upper burr adjustment for fine-tuning',
      'Clean hopper and burrs monthly'
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

export function getMachinesByBrand(brand: string): EspressoMachine[] {
  return espressoMachines.filter(m => m.brand.toLowerCase() === brand.toLowerCase());
}

export function getGrindersByBrand(brand: string): CoffeeGrinder[] {
  return coffeeGrinders.filter(g => g.brand.toLowerCase() === brand.toLowerCase());
}

export function getMachinesByPriceRange(range: EspressoMachine['priceRange']): EspressoMachine[] {
  return espressoMachines.filter(m => m.priceRange === range);
}

export function searchMachines(query: string): EspressoMachine[] {
  const q = query.toLowerCase();
  return espressoMachines.filter(m => 
    m.name.toLowerCase().includes(q) || 
    m.brand.toLowerCase().includes(q)
  );
}

export function searchGrinders(query: string): CoffeeGrinder[] {
  const q = query.toLowerCase();
  return coffeeGrinders.filter(g => 
    g.name.toLowerCase().includes(q) || 
    g.brand.toLowerCase().includes(q)
  );
}

// Get recommended grinder settings for a machine
export function getRecommendedGrindSettings(
  machineId: string, 
  grinderId: string
): { setting: string; notes: string } | null {
  const machine = getMachineById(machineId);
  const grinder = getGrinderById(grinderId);
  
  if (!machine || !grinder) return null;
  
  return {
    setting: `Start at ${grinder.espressoRange.startingPoint}`,
    notes: `${grinder.espressoRange.note}. Adjust based on ${machine.grindSetting.note}`
  };
}
