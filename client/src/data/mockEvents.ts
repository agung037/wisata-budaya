export interface CulturalEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: 'seni' | 'tradisi' | 'festival' | 'workshop';
  image_url: string;
  organizer: string;
  price: number;
  isBookmarked?: boolean;
}

export const mockEvents: CulturalEvent[] = [
  {
    id: 1,
    title: 'Festival Wayang Kulit',
    description: 'Pertunjukan wayang kulit tradisional dengan dalang terkenal Ki Manteb Soedharsono.',
    date: '2024-04-15',
    time: '19:00',
    location: 'Gedung Kesenian Jakarta',
    category: 'seni',
    image_url: 'https://placehold.co/600x400/3498db/FFFFFF?text=Wayang+Kulit',
    organizer: 'Dinas Kebudayaan DKI Jakarta',
    price: 50000,
    isBookmarked: false
  },
  {
    id: 2,
    title: 'Workshop Batik Tulis',
    description: 'Belajar membuat batik tulis tradisional dengan pengrajin batik profesional.',
    date: '2024-04-20',
    time: '09:00',
    location: 'Museum Tekstil Jakarta',
    category: 'workshop',
    image_url: 'https://placehold.co/600x400/e74c3c/FFFFFF?text=Batik+Workshop',
    organizer: 'Museum Tekstil Jakarta',
    price: 150000,
    isBookmarked: false
  },
  {
    id: 3,
    title: 'Festival Budaya Betawi',
    description: 'Pertunjukan seni budaya Betawi, termasuk lenong, ondel-ondel, dan kuliner khas.',
    date: '2024-05-01',
    time: '10:00',
    location: 'Taman Mini Indonesia Indah',
    category: 'festival',
    image_url: 'https://placehold.co/600x400/27ae60/FFFFFF?text=Festival+Betawi',
    organizer: 'Pemerintah Provinsi DKI Jakarta',
    price: 75000,
    isBookmarked: false
  },
  {
    id: 4,
    title: 'Pertunjukan Tari Saman',
    description: 'Pertunjukan tari Saman dari Aceh oleh sanggar tari terkemuka.',
    date: '2024-04-25',
    time: '20:00',
    location: 'Teater Jakarta',
    category: 'seni',
    image_url: 'https://placehold.co/600x400/9b59b6/FFFFFF?text=Tari+Saman',
    organizer: 'Sanggar Tari Aceh',
    price: 100000,
    isBookmarked: false
  },
  {
    id: 5,
    title: 'Workshop Gamelan',
    description: 'Pengenalan dan pembelajaran alat musik gamelan untuk pemula.',
    date: '2024-05-05',
    time: '13:00',
    location: 'Sasana Gamelan Jakarta',
    category: 'workshop',
    image_url: 'https://placehold.co/600x400/34495e/FFFFFF?text=Workshop+Gamelan',
    organizer: 'Sasana Gamelan Jakarta',
    price: 200000,
    isBookmarked: false
  }
]; 