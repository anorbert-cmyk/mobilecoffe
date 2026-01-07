export interface CafeFeature {
  id: string;
  label: string;
  icon: string;
}

export interface Cafe {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  priceLevel: number; // 1-4
  address: string;
  neighborhood: string;
  image: string;
  isOpen: boolean;
  openingHours: string;
  features: string[];
  description: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  specialties: string[];
}

// Production-like demo data with realistic Budapest specialty coffee shops
export const demoCafes: Cafe[] = [
  {
    id: 'espresso-embassy',
    name: 'Espresso Embassy',
    rating: 4.8,
    reviewCount: 1247,
    priceLevel: 2,
    address: 'Arany János u. 15',
    neighborhood: 'District V',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
    isOpen: true,
    openingHours: '7:00 AM - 7:00 PM',
    features: ['WiFi', 'Card Payment', 'Laptop Friendly', 'Outdoor Seating'],
    description: 'Award-winning specialty coffee in the heart of Budapest. Known for their perfectly pulled espresso and cozy atmosphere.',
    latitude: 47.5025,
    longitude: 19.0512,
    phone: '+36 1 123 4567',
    website: 'https://espressoembassy.hu',
    specialties: ['Single Origin Espresso', 'Flat White', 'Cold Brew'],
  },
  {
    id: 'fekete',
    name: 'Fekete',
    rating: 4.7,
    reviewCount: 892,
    priceLevel: 2,
    address: 'Kazinczy u. 10',
    neighborhood: 'District VII',
    image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80',
    isOpen: true,
    openingHours: '8:00 AM - 8:00 PM',
    features: ['WiFi', 'Card Payment', 'Breakfast', 'Vegan Options'],
    description: 'Minimalist design meets exceptional coffee. A favorite among locals and digital nomads alike.',
    latitude: 47.4989,
    longitude: 19.0612,
    phone: '+36 1 234 5678',
    website: 'https://fekete.co',
    specialties: ['Pour Over', 'Avocado Toast', 'Matcha Latte'],
  },
  {
    id: 'kontakt',
    name: 'Kontakt Specialty Coffee',
    rating: 4.9,
    reviewCount: 634,
    priceLevel: 3,
    address: 'Paulay Ede u. 45',
    neighborhood: 'District VI',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
    isOpen: true,
    openingHours: '7:30 AM - 6:00 PM',
    features: ['Card Payment', 'Beans for Sale', 'Brewing Classes'],
    description: 'Micro-roastery and coffee bar. They roast their own beans on-site and offer brewing workshops.',
    latitude: 47.5045,
    longitude: 19.0632,
    specialties: ['House Roast', 'AeroPress', 'Coffee Tasting'],
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
    openingHours: '7:00 AM - 9:00 PM',
    features: ['WiFi', 'Card Payment', 'Breakfast', 'Accessible', 'Pet Friendly'],
    description: 'Australian-style brunch cafe with Melbourne coffee culture. Great for weekend breakfast.',
    latitude: 47.4999,
    longitude: 19.0582,
    phone: '+36 1 345 6789',
    website: 'https://mylittlemelbourne.hu',
    specialties: ['Flat White', 'Eggs Benedict', 'Banana Bread'],
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
    openingHours: '8:00 AM - 6:00 PM',
    features: ['WiFi', 'Vegan Options', 'Quiet Atmosphere'],
    description: 'Peaceful cafe with a focus on mindfulness. Perfect for reading or quiet work sessions.',
    latitude: 47.5125,
    longitude: 19.0452,
    specialties: ['V60 Pour Over', 'Vegan Cakes', 'Chai Latte'],
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
    openingHours: '7:00 AM - 5:00 PM',
    features: ['Card Payment', 'Beans for Sale', 'Standing Bar'],
    description: 'No-frills espresso bar focused purely on coffee excellence. Quick service, exceptional quality.',
    latitude: 47.5065,
    longitude: 19.0492,
    specialties: ['Espresso', 'Cortado', 'Single Origin'],
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
    openingHours: '8:00 AM - 7:00 PM',
    features: ['WiFi', 'Card Payment', 'Laptop Friendly', 'Power Outlets'],
    description: 'Modern specialty coffee shop with excellent work-friendly environment. Fast WiFi guaranteed.',
    latitude: 47.4975,
    longitude: 19.0652,
    phone: '+36 1 456 7890',
    specialties: ['Batch Brew', 'Cold Brew', 'Oat Milk Latte'],
  },
  {
    id: 'kelet',
    name: 'Kelet Café',
    rating: 4.4,
    reviewCount: 567,
    priceLevel: 2,
    address: 'Bartók Béla út 29',
    neighborhood: 'District XI',
    image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80',
    isOpen: true,
    openingHours: '9:00 AM - 10:00 PM',
    features: ['WiFi', 'Card Payment', 'Breakfast', 'Lunch', 'Wine'],
    description: 'All-day cafe and bistro on the Buda side. Great for brunch or evening drinks.',
    latitude: 47.4785,
    longitude: 19.0412,
    website: 'https://keletcafe.hu',
    specialties: ['Brunch', 'Natural Wine', 'Specialty Coffee'],
  },
];

// Utility function to calculate distance (simplified for demo)
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
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

// Sort cafes by distance from user location
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
