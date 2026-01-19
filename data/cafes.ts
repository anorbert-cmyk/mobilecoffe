// ============================================
// WORLD-CLASS DEMO CAFE DATA
// Rich, production-quality profiles
// ============================================

export interface MenuItem {
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  isVegan?: boolean;
  isPopular?: boolean;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export interface CafeEvent {
  id: string;
  name: string;
  date: Date;
  description: string;
  price: number;
  currency: string;
  imageUrl?: string;
  maxAttendees?: number;
}

export interface CafeJob {
  id: string;
  title: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salaryMin: number;
  salaryMax: number;
  description: string;
}

export interface CafeAmenities {
  wifi: boolean;
  dogFriendly: boolean;
  cardPayment: boolean;
  terrace: boolean;
  brunch: boolean;
  laptopFriendly: boolean;
  wheelchairAccessible: boolean;
  parking: boolean;
  reservations: boolean;
  takeaway: boolean;
  delivery: boolean;
  oatMilk: boolean;
  specialty: boolean;
}

export interface OpeningHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface ShopProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: 'beans' | 'equipment' | 'merch';
  weight?: string; // e.g. "250g"
}

export interface Cafe {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  priceLevel: number;
  address: string;
  neighborhood: string;
  image: string;
  isOpen: boolean;
  openingHours: OpeningHours;
  description: string;
  longDescription?: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  instagram?: string;
  specialties: string[];
  amenities: CafeAmenities;
  menu: MenuCategory[];
  shop?: ShopProduct[];
  events: CafeEvent[];
  jobs: CafeJob[];
}

// ============================================
// DEMO CAFES - Budapest Specialty Coffee
// ============================================

export const demoCafes: Cafe[] = [
  {
    id: 'espresso-embassy',
    name: 'Espresso Embassy',
    rating: 4.8,
    reviewCount: 1247,
    priceLevel: 2,
    shop: [
      {
        id: 'ethiopia-yirgacheffe',
        name: 'Ethiopia Yirgacheffe',
        price: 4900,
        description: 'Floral and citrusy notes with a tea-like body. Light roast, perfect for filter coffee.',
        imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80', // Fallback, will use asset in UI
        category: 'beans',
        weight: '250g'
      },
      {
        id: 'colombia-huila',
        name: 'Colombia Huila',
        price: 4500,
        description: 'Caramel sweetness with hints of red apple and chocolate. Medium roast, great for espresso.',
        imageUrl: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=800&q=80',
        category: 'beans',
        weight: '250g'
      },
      {
        id: 'hario-v60',
        name: 'Hario V60 Kit',
        price: 8900,
        description: 'Everything you need to start brewing pour-over coffee at home. Includes dripper, server, and filters.',
        imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80',
        category: 'equipment'
      }
    ],
    address: 'Arany János u. 15',
    neighborhood: 'District V',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
    isOpen: true,
    openingHours: {
      monday: '07:00 - 19:00',
      tuesday: '07:00 - 19:00',
      wednesday: '07:00 - 19:00',
      thursday: '07:00 - 19:00',
      friday: '07:00 - 19:00',
      saturday: '08:00 - 18:00',
      sunday: '08:00 - 16:00',
    },
    description: 'Award-winning specialty coffee in the heart of Budapest.',
    longDescription: 'Espresso Embassy is a cornerstone of Budapest\'s third-wave coffee scene. Founded in 2013, we\'ve been serving meticulously crafted espresso drinks using beans from the world\'s best micro-roasters. Our baristas are champions – literally. We\'ve won multiple Hungarian Barista Championships and pride ourselves on pushing the boundaries of what coffee can be. Whether you\'re a coffee connoisseur or just discovering specialty coffee, you\'ll find something extraordinary here.',
    latitude: 47.5025,
    longitude: 19.0512,
    phone: '+36 1 123 4567',
    website: 'https://espressoembassy.hu',
    instagram: '@espressoembassy',
    specialties: ['Single Origin Espresso', 'Flat White', 'Cold Brew', 'Competition Coffee'],
    amenities: {
      wifi: true,
      dogFriendly: false,
      cardPayment: true,
      terrace: true,
      brunch: false,
      laptopFriendly: true,
      wheelchairAccessible: true,
      parking: false,
      reservations: false,
      takeaway: true,
      delivery: false,
      oatMilk: true,
      specialty: true,
    },
    menu: [
      {
        name: 'Espresso Drinks',
        items: [
          { name: 'Espresso', price: 590, description: 'Double shot, 18g in, 36g out', isPopular: true },
          { name: 'Flat White', price: 890, description: 'Double ristretto with velvety steamed milk', isPopular: true },
          { name: 'Cortado', price: 690, description: 'Equal parts espresso and steamed milk' },
          { name: 'Cappuccino', price: 790, description: 'Classic Italian ratio with microfoam' },
          { name: 'Latte', price: 890, description: 'Smooth and milky with latte art' },
        ]
      },
      {
        name: 'Filter & Cold',
        items: [
          { name: 'V60 Pour Over', price: 990, description: 'Single origin, brewed to order', isPopular: true },
          { name: 'Cold Brew', price: 890, description: '16-hour cold extraction' },
          { name: 'Iced Latte', price: 990, description: 'Espresso over ice with cold milk' },
        ]
      },
      {
        name: 'Non-Coffee',
        items: [
          { name: 'Matcha Latte', price: 890, description: 'Ceremonial grade Uji matcha', isVegan: true },
          { name: 'Hot Chocolate', price: 790, description: '70% Valrhona chocolate' },
          { name: 'Chai Latte', price: 790, description: 'House-made spice blend' },
        ]
      }
    ],
    events: [
      {
        id: 'ee-1',
        name: 'Latte Art Basics',
        date: new Date('2026-02-15T10:00:00'),
        description: 'Learn the fundamentals of latte art from our champion baristas. Hearts, tulips, and rosettas – we\'ll cover it all. Includes all materials and 6 practice drinks.',
        price: 15000,
        currency: 'HUF',
        imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=800',
        maxAttendees: 8,
      },
      {
        id: 'ee-2',
        name: 'Cupping Session: Ethiopia',
        date: new Date('2026-02-22T14:00:00'),
        description: 'Explore the diverse flavors of Ethiopian coffee through professional cupping. We\'ll taste 5 different lots from Yirgacheffe, Sidamo, and Guji.',
        price: 8000,
        currency: 'HUF',
        maxAttendees: 12,
      }
    ],
    jobs: [
      {
        id: 'ee-j1',
        title: 'Senior Barista',
        type: 'full-time',
        salaryMin: 350000,
        salaryMax: 450000,
        description: 'Looking for an experienced barista with 2+ years in specialty coffee. Must have excellent latte art skills and passion for customer service. Competition experience is a plus.',
      }
    ],
  },
  {
    id: 'fekete',
    name: 'Fekete',
    rating: 4.7,
    reviewCount: 892,
    priceLevel: 2,
    address: 'Kazinczy u. 10',
    neighborhood: 'District VII (Jewish Quarter)',
    image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80',
    isOpen: true,
    openingHours: {
      monday: '08:00 - 20:00',
      tuesday: '08:00 - 20:00',
      wednesday: '08:00 - 20:00',
      thursday: '08:00 - 20:00',
      friday: '08:00 - 22:00',
      saturday: '09:00 - 22:00',
      sunday: '09:00 - 18:00',
    },
    description: 'Minimalist design meets exceptional coffee and all-day brunch.',
    longDescription: 'Fekete (meaning "Black" in Hungarian) is where Scandinavian minimalism meets Budapest\'s vibrant cafe culture. Our space is a canvas of clean lines, natural light, and the aroma of freshly roasted coffee. We\'re famous for our weekend brunch – think fluffy pancakes, perfectly poached eggs, and the crispiest bacon in town. Digital nomads love us for our fast WiFi and power outlets at every table.',
    latitude: 47.4989,
    longitude: 19.0612,
    phone: '+36 1 234 5678',
    website: 'https://fekete.co',
    instagram: '@fekete_bp',
    specialties: ['Brunch', 'Avocado Toast', 'Specialty Coffee', 'Natural Wine'],
    amenities: {
      wifi: true,
      dogFriendly: true,
      cardPayment: true,
      terrace: true,
      brunch: true,
      laptopFriendly: true,
      wheelchairAccessible: true,
      parking: false,
      reservations: true,
      takeaway: true,
      delivery: true,
      oatMilk: true,
      specialty: true,
    },
    menu: [
      {
        name: 'All-Day Brunch',
        items: [
          { name: 'Avocado Toast', price: 2490, description: 'Sourdough, smashed avo, poached eggs, chili flakes', isPopular: true, isVegan: false },
          { name: 'Eggs Benedict', price: 2890, description: 'English muffin, ham, hollandaise', isPopular: true },
          { name: 'Acai Bowl', price: 2290, description: 'Frozen acai, granola, banana, berries', isVegan: true },
          { name: 'Fluffy Pancakes', price: 1990, description: 'Stack of 3 with maple syrup and berries' },
          { name: 'Shakshuka', price: 2190, description: 'Eggs poached in spiced tomato sauce, feta, pita' },
        ]
      },
      {
        name: 'Coffee',
        items: [
          { name: 'Espresso', price: 490, isPopular: true },
          { name: 'Flat White', price: 790 },
          { name: 'Oat Latte', price: 890, isVegan: true, isPopular: true },
          { name: 'Matcha Latte', price: 890, isVegan: true },
          { name: 'Cold Brew', price: 790 },
        ]
      },
      {
        name: 'Fresh Juices',
        items: [
          { name: 'Green Detox', price: 1290, description: 'Spinach, apple, ginger, lemon', isVegan: true },
          { name: 'Orange Carrot', price: 990, isVegan: true },
          { name: 'Beetroot Power', price: 1190, isVegan: true },
        ]
      }
    ],
    events: [
      {
        id: 'fk-1',
        name: 'Sunday Jazz Brunch',
        date: new Date('2026-02-23T11:00:00'),
        description: 'Live jazz trio every Sunday. No cover charge – just come for the vibes, bottomless coffee, and our famous pancakes.',
        price: 0,
        currency: 'HUF',
      }
    ],
    jobs: [
      {
        id: 'fk-j1',
        title: 'Brunch Cook',
        type: 'full-time',
        salaryMin: 280000,
        salaryMax: 350000,
        description: 'We need a passionate cook who can nail eggs every time. Experience in cafe kitchens preferred. Weekend availability required.',
      },
      {
        id: 'fk-j2',
        title: 'Part-time Barista',
        type: 'part-time',
        salaryMin: 1800,
        salaryMax: 2200,
        description: 'Weekend shifts available. We\'ll train you on our equipment – just bring enthusiasm and a friendly smile. Hourly rate.',
      }
    ],
  },
  {
    id: 'kontakt',
    name: 'Kontakt Specialty Coffee',
    rating: 4.9,
    reviewCount: 634,
    priceLevel: 3,
    address: 'Paulay Ede u. 45',
    neighborhood: 'District VI (Theatre District)',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
    isOpen: true,
    openingHours: {
      monday: '07:30 - 18:00',
      tuesday: '07:30 - 18:00',
      wednesday: '07:30 - 18:00',
      thursday: '07:30 - 18:00',
      friday: '07:30 - 18:00',
      saturday: '09:00 - 16:00',
      sunday: 'Closed',
    },
    description: 'Micro-roastery and tasting room. We roast on-site.',
    longDescription: 'Kontakt is Budapest\'s premier micro-roastery experience. Our 5kg Giesen roaster sits in full view, filling the space with the intoxicating aroma of freshly roasted beans. We source directly from farms in Ethiopia, Colombia, and Guatemala, paying premium prices for exceptional lots. Every coffee tells a story – and we love sharing it. Join our weekly cupping sessions to discover new origins.',
    latitude: 47.5045,
    longitude: 19.0632,
    phone: '+36 30 555 1234',
    website: 'https://kontaktcoffee.hu',
    instagram: '@kontaktcoffee',
    specialties: ['House Roast', 'Single Origin', 'Coffee Education', 'Beans for Sale'],
    amenities: {
      wifi: false,
      dogFriendly: false,
      cardPayment: true,
      terrace: false,
      brunch: false,
      laptopFriendly: false,
      wheelchairAccessible: false,
      parking: false,
      reservations: true,
      takeaway: true,
      delivery: false,
      oatMilk: true,
      specialty: true,
    },
    menu: [
      {
        name: 'Espresso Bar',
        items: [
          { name: 'Espresso (House Blend)', price: 590 },
          { name: 'Espresso (Single Origin)', price: 790, isPopular: true },
          { name: 'Cappuccino', price: 790 },
          { name: 'Flat White', price: 890, isPopular: true },
        ]
      },
      {
        name: 'Brew Bar',
        items: [
          { name: 'V60', price: 990, description: 'Choose from 3 single origins' },
          { name: 'AeroPress', price: 890 },
          { name: 'Chemex (2 cups)', price: 1490, isPopular: true },
          { name: 'Cold Drip', price: 1190, description: '8-hour slow drip' },
        ]
      },
      {
        name: 'Retail',
        items: [
          { name: 'House Blend (250g)', price: 3900 },
          { name: 'Single Origin (250g)', price: 4900 },
          { name: 'Filter Roast (250g)', price: 4500 },
        ]
      }
    ],
    events: [
      {
        id: 'kt-1',
        name: 'Roastery Tour + Cupping',
        date: new Date('2026-02-08T11:00:00'),
        description: 'Go behind the scenes of our roasting operation. Learn about green coffee sourcing, roast profiles, and taste the difference yourself. Ends with a cupping of 4 coffees.',
        price: 6000,
        currency: 'HUF',
        maxAttendees: 6,
      },
      {
        id: 'kt-2',
        name: 'Home Brewing Masterclass',
        date: new Date('2026-03-01T10:00:00'),
        description: 'Master the V60, AeroPress, and French Press. Leave with the skills to brew cafe-quality coffee at home. Includes 250g bag of beans.',
        price: 12000,
        currency: 'HUF',
        maxAttendees: 8,
      }
    ],
    jobs: [],
  },
  {
    id: 'my-little-melbourne',
    name: 'My Little Melbourne',
    rating: 4.6,
    reviewCount: 1523,
    priceLevel: 2,
    address: 'Madách Imre út 3',
    neighborhood: 'District VII',
    image: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80',
    isOpen: true,
    openingHours: {
      monday: '07:00 - 21:00',
      tuesday: '07:00 - 21:00',
      wednesday: '07:00 - 21:00',
      thursday: '07:00 - 21:00',
      friday: '07:00 - 22:00',
      saturday: '08:00 - 22:00',
      sunday: '08:00 - 20:00',
    },
    description: 'Australian-style brunch cafe with Melbourne coffee culture.',
    longDescription: 'A little piece of Melbourne in the heart of Budapest. We brought Australian coffee culture to Hungary back in 2014 and haven\'t looked back. Our baristas are trained in Melbourne techniques, our beans are roasted locally to Aussie specs, and our brunch menu is straight from Brunswick Street. Dog-friendly, kid-friendly, and definitely laptop-friendly.',
    latitude: 47.4999,
    longitude: 19.0582,
    phone: '+36 1 345 6789',
    website: 'https://mylittlemelbourne.hu',
    instagram: '@mylittlemelbourne_bp',
    specialties: ['Flat White', 'Eggs Benedict', 'Banana Bread', 'Aussie Vibes'],
    amenities: {
      wifi: true,
      dogFriendly: true,
      cardPayment: true,
      terrace: true,
      brunch: true,
      laptopFriendly: true,
      wheelchairAccessible: true,
      parking: false,
      reservations: true,
      takeaway: true,
      delivery: true,
      oatMilk: true,
      specialty: true,
    },
    menu: [
      {
        name: 'Brekkie',
        items: [
          { name: 'Big Aussie', price: 3290, description: 'Eggs, bacon, sausage, beans, mushrooms, toast', isPopular: true },
          { name: 'Smashed Avo', price: 2290, description: 'Sourdough, feta, dukkah, poached eggs', isPopular: true },
          { name: 'Banana Bread', price: 1290, description: 'House-made with mascarpone and berries' },
          { name: 'Granola Bowl', price: 1690, description: 'Greek yogurt, honey, seasonal fruit', isVegan: false },
        ]
      },
      {
        name: 'Coffee & Drinks',
        items: [
          { name: 'Flat White', price: 790, isPopular: true },
          { name: 'Long Black', price: 590 },
          { name: 'Magic', price: 790, description: 'Double ristretto, less milk than flat white' },
          { name: 'Iced Long Black', price: 690 },
          { name: 'Fresh OJ', price: 890 },
        ]
      }
    ],
    events: [],
    jobs: [
      {
        id: 'mlm-j1',
        title: 'All-Rounder',
        type: 'full-time',
        salaryMin: 300000,
        salaryMax: 380000,
        description: 'Can you make coffee AND cook eggs? We need a versatile team member who can float between cafe and kitchen. Training provided.',
      }
    ],
  },
  {
    id: 'madal',
    name: 'Madal Café',
    rating: 4.5,
    reviewCount: 756,
    priceLevel: 2,
    address: 'Hollán Ernő u. 3',
    neighborhood: 'District XIII',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    isOpen: false,
    openingHours: {
      monday: '08:00 - 18:00',
      tuesday: '08:00 - 18:00',
      wednesday: '08:00 - 18:00',
      thursday: '08:00 - 18:00',
      friday: '08:00 - 18:00',
      saturday: '09:00 - 16:00',
      sunday: 'Closed',
    },
    description: 'Peaceful cafe focused on mindfulness and plant-based options.',
    longDescription: 'Madal is an oasis of calm in a busy city. Inspired by meditation and mindfulness, our space is designed for quiet contemplation, deep work, or simply enjoying a moment of peace. We specialize in vegan and raw desserts, organic teas, and of course, exceptional coffee. No rushing, no loud music – just quality time with yourself or a loved one.',
    latitude: 47.5125,
    longitude: 19.0452,
    phone: '+36 70 123 4567',
    instagram: '@madalcafe',
    specialties: ['Vegan Cakes', 'Meditation Space', 'Organic Tea', 'Quiet Atmosphere'],
    amenities: {
      wifi: true,
      dogFriendly: false,
      cardPayment: true,
      terrace: false,
      brunch: false,
      laptopFriendly: true,
      wheelchairAccessible: false,
      parking: true,
      reservations: false,
      takeaway: true,
      delivery: false,
      oatMilk: true,
      specialty: true,
    },
    menu: [
      {
        name: 'Coffee',
        items: [
          { name: 'V60 Pour Over', price: 890, isPopular: true },
          { name: 'Oat Latte', price: 890, isVegan: true },
          { name: 'Matcha Latte', price: 990, isVegan: true, isPopular: true },
          { name: 'Golden Latte', price: 990, description: 'Turmeric, ginger, oat milk', isVegan: true },
        ]
      },
      {
        name: 'Vegan Treats',
        items: [
          { name: 'Raw Cheesecake', price: 1490, description: 'Cashew-based, seasonal fruit', isVegan: true, isPopular: true },
          { name: 'Brownie', price: 890, description: 'Gluten-free, tahini drizzle', isVegan: true },
          { name: 'Energy Balls (3pc)', price: 690, description: 'Date, oat, cacao', isVegan: true },
        ]
      },
      {
        name: 'Organic Teas',
        items: [
          { name: 'Sencha', price: 690, isVegan: true },
          { name: 'Chamomile', price: 590, isVegan: true },
          { name: 'Chai (Homemade)', price: 790, description: 'Spiced with oat milk', isVegan: true },
        ]
      }
    ],
    events: [],
    jobs: [],
  },
  {
    id: 'tamp-pull',
    name: 'Tamp & Pull',
    rating: 4.8,
    reviewCount: 445,
    priceLevel: 3,
    address: 'Czuczor u. 3',
    neighborhood: 'District V',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80',
    isOpen: true,
    openingHours: {
      monday: '07:00 - 17:00',
      tuesday: '07:00 - 17:00',
      wednesday: '07:00 - 17:00',
      thursday: '07:00 - 17:00',
      friday: '07:00 - 17:00',
      saturday: '08:00 - 14:00',
      sunday: 'Closed',
    },
    description: 'No-frills espresso bar focused purely on coffee excellence.',
    longDescription: 'Tamp & Pull is for purists. No WiFi, no laptops, no food menu – just coffee, executed perfectly. Our standing bar encourages quick visits and focused appreciation. We rotate single origins weekly and our baristas can tell you everything about the farm, processing, and roast profile. If you care about coffee, this is your temple.',
    latitude: 47.5065,
    longitude: 19.0492,
    instagram: '@tampandpull',
    specialties: ['Espresso', 'Cortado', 'Single Origin', 'Standing Bar'],
    amenities: {
      wifi: false,
      dogFriendly: false,
      cardPayment: true,
      terrace: false,
      brunch: false,
      laptopFriendly: false,
      wheelchairAccessible: false,
      parking: false,
      reservations: false,
      takeaway: true,
      delivery: false,
      oatMilk: true,
      specialty: true,
    },
    menu: [
      {
        name: 'Espresso Bar',
        items: [
          { name: 'Espresso', price: 490, isPopular: true },
          { name: 'Doppio', price: 690 },
          { name: 'Cortado', price: 590, isPopular: true },
          { name: 'Macchiato', price: 490 },
          { name: 'Flat White', price: 790 },
        ]
      },
      {
        name: 'Single Origins (Rotating)',
        items: [
          { name: 'Origin of the Week', price: 690, description: 'Ask barista for details', isPopular: true },
          { name: 'V60 (Single Origin)', price: 990 },
        ]
      }
    ],
    events: [],
    jobs: [],
  },
  {
    id: 'mantra',
    name: 'Mantra Specialty Coffee',
    rating: 4.7,
    reviewCount: 328,
    priceLevel: 2,
    address: 'Wesselényi u. 36',
    neighborhood: 'District VII',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
    isOpen: true,
    openingHours: {
      monday: '08:00 - 19:00',
      tuesday: '08:00 - 19:00',
      wednesday: '08:00 - 19:00',
      thursday: '08:00 - 19:00',
      friday: '08:00 - 20:00',
      saturday: '09:00 - 20:00',
      sunday: '09:00 - 18:00',
    },
    description: 'Modern specialty coffee shop. Digital nomad paradise.',
    longDescription: 'Mantra is where productivity meets great coffee. We\'ve designed every detail for remote workers: standing desks, comfortable seating, blazing fast WiFi (100Mbps), and power outlets everywhere. Our house blend is roasted for all-day drinking – smooth enough for your 5th cup. Meeting rooms available by the hour.',
    latitude: 47.4975,
    longitude: 19.0652,
    phone: '+36 1 456 7890',
    website: 'https://mantracoffee.hu',
    instagram: '@mantracoffee_bp',
    specialties: ['Batch Brew', 'Cold Brew', 'Coworking Vibes', 'Fast WiFi'],
    amenities: {
      wifi: true,
      dogFriendly: true,
      cardPayment: true,
      terrace: false,
      brunch: false,
      laptopFriendly: true,
      wheelchairAccessible: true,
      parking: false,
      reservations: true,
      takeaway: true,
      delivery: false,
      oatMilk: true,
      specialty: true,
    },
    menu: [
      {
        name: 'Coffee',
        items: [
          { name: 'Batch Brew', price: 490, description: 'Unlimited refills for 2 hours', isPopular: true },
          { name: 'Espresso', price: 490 },
          { name: 'Oat Latte', price: 790, isVegan: true, isPopular: true },
          { name: 'Cold Brew', price: 690 },
          { name: 'Affogato', price: 890, description: 'Espresso over vanilla gelato' },
        ]
      },
      {
        name: 'Light Bites',
        items: [
          { name: 'Croissant', price: 590 },
          { name: 'Energy Bar', price: 490, isVegan: true },
          { name: 'Yogurt Parfait', price: 890 },
        ]
      }
    ],
    events: [
      {
        id: 'mn-1',
        name: 'Freelancer Meetup',
        date: new Date('2026-02-28T18:00:00'),
        description: 'Monthly networking event for freelancers and remote workers. Free coffee, good conversations, and maybe your next collaboration.',
        price: 0,
        currency: 'HUF',
      }
    ],
    jobs: [],
  },
  {
    id: 'kelet',
    name: 'Kelet Café',
    rating: 4.4,
    reviewCount: 567,
    priceLevel: 2,
    address: 'Bartók Béla út 29',
    neighborhood: 'District XI (Buda)',
    image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80',
    isOpen: true,
    openingHours: {
      monday: '09:00 - 22:00',
      tuesday: '09:00 - 22:00',
      wednesday: '09:00 - 22:00',
      thursday: '09:00 - 22:00',
      friday: '09:00 - 00:00',
      saturday: '10:00 - 00:00',
      sunday: '10:00 - 21:00',
    },
    description: 'All-day cafe and bistro on the Buda side with natural wine.',
    longDescription: 'Kelet ("East" in Hungarian) brings together specialty coffee, natural wine, and simple but delicious food. We\'re a neighborhood spot where locals come for morning coffee, afternoon cake, and evening glasses of funky orange wine. Our terrace is legendary in summer – grab a seat, order some cheese, and watch the Buda sunset.',
    latitude: 47.4785,
    longitude: 19.0412,
    phone: '+36 20 987 6543',
    website: 'https://keletcafe.hu',
    instagram: '@keletcafe',
    specialties: ['Natural Wine', 'Brunch', 'Terrace', 'Cheese Plates'],
    amenities: {
      wifi: true,
      dogFriendly: true,
      cardPayment: true,
      terrace: true,
      brunch: true,
      laptopFriendly: false,
      wheelchairAccessible: true,
      parking: true,
      reservations: true,
      takeaway: true,
      delivery: false,
      oatMilk: true,
      specialty: true,
    },
    menu: [
      {
        name: 'Day Menu',
        items: [
          { name: 'Eggs Your Way', price: 1890, description: 'Scrambled, poached, or fried. With toast.' },
          { name: 'Cheese Plate', price: 2490, description: 'Hungarian and French cheeses, honey, walnuts', isPopular: true },
          { name: 'Soup of the Day', price: 1290 },
          { name: 'Club Sandwich', price: 2190 },
        ]
      },
      {
        name: 'Coffee & Tea',
        items: [
          { name: 'Espresso', price: 490 },
          { name: 'Latte', price: 690 },
          { name: 'Lungo', price: 590 },
          { name: 'Teapot (500ml)', price: 890 },
        ]
      },
      {
        name: 'Natural Wines',
        items: [
          { name: 'Orange Wine (glass)', price: 1490, description: 'Rotating selection' },
          { name: 'Red (glass)', price: 1290 },
          { name: 'White (glass)', price: 1190 },
        ]
      }
    ],
    events: [],
    jobs: [
      {
        id: 'kl-j1',
        title: 'Evening Server',
        type: 'part-time',
        salaryMin: 2000,
        salaryMax: 2500,
        description: 'Thu-Sat evenings, wine service experience preferred. Must be 18+. Hourly rate + tips.',
      }
    ],
  },
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const formatDistance = (km: number): string => {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
};

export const getCafeById = (id: string): Cafe | undefined => {
  return demoCafes.find(cafe => cafe.id === id);
};

export const sortCafesByDistance = (
  cafes: Cafe[],
  userLat: number,
  userLon: number
): (Cafe & { distance: number })[] => {
  return cafes
    .map(cafe => ({
      ...cafe,
      distance: calculateDistance(userLat, userLon, cafe.latitude, cafe.longitude),
    }))
    .sort((a, b) => a.distance - b.distance);
};

// Get current day's opening hours
export const getTodayHours = (hours: OpeningHours): string => {
  const days: (keyof OpeningHours)[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = new Date().getDay();
  return hours[days[today]];
};

// Count active amenities
export const countAmenities = (amenities: CafeAmenities): number => {
  return Object.values(amenities).filter(Boolean).length;
};
