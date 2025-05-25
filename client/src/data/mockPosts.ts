export interface CulturalPost {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
    avatar_url: string;
  };
  created_at: string;
  image_url?: string;
  likes: number;
  comments: number;
  tags: string[];
}

export const mockPosts: CulturalPost[] = [
  {
    id: 1,
    title: 'Pengalaman Menyaksikan Kesenian Reog Ponorogo',
    content: 'Hari ini saya berkesempatan menyaksikan pertunjukan Reog Ponorogo yang spektakuler. Warok dan Jathil menampilkan gerakan yang memukau, sementara Barongan dengan berat 50kg ditopang hanya dengan gigi! Sungguh pengalaman yang tak terlupakan.',
    author: {
      id: 1,
      name: 'Budi Santoso',
      avatar_url: 'https://placehold.co/100x100/3498db/FFFFFF?text=BS'
    },
    created_at: '2024-03-15T10:30:00Z',
    image_url: 'https://placehold.co/600x400/3498db/FFFFFF?text=Reog+Ponorogo',
    likes: 245,
    comments: 32,
    tags: ['reog', 'kesenian', 'ponorogo']
  },
  {
    id: 2,
    title: 'Tips Mengikuti Workshop Batik Tulis',
    content: 'Setelah mengikuti workshop batik tulis selama 3 hari, saya ingin berbagi beberapa tips untuk pemula: 1) Pilih motif sederhana untuk latihan, 2) Perhatikan tekanan canting saat mencanting, 3) Jangan terburu-buru dalam proses pewarnaan.',
    author: {
      id: 2,
      name: 'Siti Rahayu',
      avatar_url: 'https://placehold.co/100x100/e74c3c/FFFFFF?text=SR'
    },
    created_at: '2024-03-14T15:45:00Z',
    image_url: 'https://placehold.co/600x400/e74c3c/FFFFFF?text=Batik+Workshop',
    likes: 189,
    comments: 45,
    tags: ['batik', 'workshop', 'kerajinan']
  },
  {
    id: 3,
    title: 'Festival Budaya Bali yang Memukau',
    content: 'Festival Budaya Bali tahun ini menghadirkan berbagai pertunjukan menarik, dari tari kecak hingga parade ogoh-ogoh. Yang paling berkesan adalah kolaborasi musik tradisional dengan modern yang menghasilkan harmoni yang indah.',
    author: {
      id: 3,
      name: 'Made Wijaya',
      avatar_url: 'https://placehold.co/100x100/27ae60/FFFFFF?text=MW'
    },
    created_at: '2024-03-13T09:15:00Z',
    image_url: 'https://placehold.co/600x400/27ae60/FFFFFF?text=Festival+Bali',
    likes: 312,
    comments: 67,
    tags: ['bali', 'festival', 'budaya']
  },
  {
    id: 4,
    title: 'Mengenal Alat Musik Gamelan',
    content: 'Gamelan adalah ensembel musik tradisional Jawa yang terdiri dari berbagai alat musik seperti saron, bonang, gong, dan kendang. Setiap alat memiliki peran penting dalam menciptakan harmoni yang khas.',
    author: {
      id: 4,
      name: 'Joko Prasetyo',
      avatar_url: 'https://placehold.co/100x100/9b59b6/FFFFFF?text=JP'
    },
    created_at: '2024-03-12T14:20:00Z',
    image_url: 'https://placehold.co/600x400/9b59b6/FFFFFF?text=Gamelan',
    likes: 156,
    comments: 28,
    tags: ['gamelan', 'musik', 'tradisional']
  },
  {
    id: 5,
    title: 'Kuliner Tradisional Indonesia',
    content: 'Berbagai kuliner tradisional Indonesia memiliki nilai budaya yang tinggi. Dari rendang Padang hingga sate Maranggi, setiap hidangan memiliki cerita dan filosofi tersendiri.',
    author: {
      id: 5,
      name: 'Dewi Lestari',
      avatar_url: 'https://placehold.co/100x100/34495e/FFFFFF?text=DL'
    },
    created_at: '2024-03-11T11:10:00Z',
    image_url: 'https://placehold.co/600x400/34495e/FFFFFF?text=Kuliner',
    likes: 278,
    comments: 53,
    tags: ['kuliner', 'tradisional', 'budaya']
  }
]; 