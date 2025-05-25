export interface TourismPlace {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  category: 'budaya' | 'sejarah' | 'alam';
  image_url?: string;
  address: string;
  distance?: number;
  isBookmarked?: boolean;
}

export const mockPlaces: TourismPlace[] = [
  {
    id: 1,
    name: 'Candi Borobudur',
    description: 'Candi Buddha terbesar di dunia yang dibangun pada abad ke-9.',
    latitude: -7.6079,
    longitude: 110.2038,
    category: 'sejarah',
    image_url: 'https://placehold.co/600x400/3498db/FFFFFF?text=Candi+Borobudur',
    address: 'Magelang, Jawa Tengah',
    isBookmarked: false
  },
  {
    id: 2,
    name: 'Keraton Yogyakarta',
    description: 'Istana resmi Kesultanan Ngayogyakarta Hadiningrat yang masih berfungsi.',
    latitude: -7.8054,
    longitude: 110.3645,
    category: 'budaya',
    image_url: 'https://placehold.co/600x400/e74c3c/FFFFFF?text=Keraton+Yogyakarta',
    address: 'Yogyakarta',
    isBookmarked: false
  },
  {
    id: 3,
    name: 'Pantai Kuta',
    description: 'Pantai yang terkenal di Bali dengan pemandangan matahari terbenam yang indah.',
    latitude: -8.7222,
    longitude: 115.1725,
    category: 'alam',
    image_url: 'https://placehold.co/600x400/27ae60/FFFFFF?text=Pantai+Kuta',
    address: 'Bali',
    isBookmarked: false
  },
  {
    id: 4,
    name: 'Taman Mini Indonesia Indah',
    description: 'Taman rekreasi yang menampilkan keanekaragaman budaya Indonesia.',
    latitude: -6.3024,
    longitude: 106.8955,
    category: 'budaya',
    image_url: 'https://placehold.co/600x400/9b59b6/FFFFFF?text=TMII',
    address: 'Jakarta Timur',
    isBookmarked: false
  },
  {
    id: 5,
    name: 'Museum Nasional',
    description: 'Museum arkeologi, sejarah, etnografi, dan geografi Indonesia.',
    latitude: -6.1764,
    longitude: 106.8227,
    category: 'sejarah',
    image_url: 'https://placehold.co/600x400/34495e/FFFFFF?text=Museum+Nasional',
    address: 'Jakarta Pusat',
    isBookmarked: false
  }
]; 