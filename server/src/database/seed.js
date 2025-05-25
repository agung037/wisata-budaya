const { db } = require('./init');
const bcrypt = require('bcrypt');

// Seed data untuk database
async function seedDatabase() {
  console.log('Seeding database...');

  // Seed user demo dengan password terenkripsi
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  try {
    // Tambahkan user demo jika belum ada
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get('user@example.com');
    
    if (!existingUser) {
      db.prepare(`
        INSERT INTO users (email, password, name, preferences)
        VALUES (?, ?, ?, ?)
      `).run('user@example.com', hashedPassword, 'Demo User', JSON.stringify(['budaya', 'sejarah', 'alam']));
      
      console.log('Demo user added');
    }

    // Hapus data lama untuk demo
    db.prepare('DELETE FROM tourism_places').run();
    db.prepare('DELETE FROM cultural_events').run();
    
    // Seed tempat wisata
    const tourismPlaces = [
      {
        name: 'Candi Borobudur',
        description: 'Candi Buddha terbesar di dunia yang dibangun pada abad ke-9. Candi ini memiliki relief yang menggambarkan ajaran Buddha dan kehidupan masa lalu Buddha.',
        latitude: -7.607874,
        longitude: 110.203751,
        address: 'Jl. Badrawati, Kw. Candi Borobudur, Borobudur, Magelang, Jawa Tengah',
        category: 'sejarah',
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Borobudur_Temple.jpg/800px-Borobudur_Temple.jpg'
      },
      {
        name: 'Taman Mini Indonesia Indah',
        description: 'Taman rekreasi yang menampilkan keberagaman budaya Indonesia dengan replika rumah adat dari seluruh provinsi Indonesia.',
        latitude: -6.302464,
        longitude: 106.895582,
        address: 'Jl. Taman Mini Indonesia Indah, Jakarta Timur',
        category: 'budaya',
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Taman_Mini_Indonesia_Indah.jpg/800px-Taman_Mini_Indonesia_Indah.jpg'
      },
      {
        name: 'Pantai Kuta',
        description: 'Pantai yang terkenal di Bali dengan pemandangan matahari terbenam yang indah dan ombak yang cocok untuk berselancar.',
        latitude: -8.718047,
        longitude: 115.166904,
        address: 'Pantai Kuta, Kuta, Badung, Bali',
        category: 'alam',
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Kuta_Beach_Bali.jpg/800px-Kuta_Beach_Bali.jpg'
      },
      {
        name: 'Kawah Ijen',
        description: 'Gunung berapi dengan fenomena api biru di malam hari dan danau asam terbesar di dunia.',
        latitude: -8.058194,
        longitude: 114.241302,
        address: 'Kawah Ijen, Banyuwangi, Jawa Timur',
        category: 'alam',
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Ijen_volcano.jpg/800px-Ijen_volcano.jpg'
      },
      {
        name: 'Keraton Yogyakarta',
        description: 'Istana resmi Kesultanan Ngayogyakarta Hadiningrat yang masih berfungsi dan menjadi pusat pelestarian budaya Jawa.',
        latitude: -7.805019,
        longitude: 110.364424,
        address: 'Jl. Rotowijayan Blok No. 1, Yogyakarta',
        category: 'budaya',
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Keraton_Yogyakarta.jpg/800px-Keraton_Yogyakarta.jpg'
      },
      {
        name: 'Lawang Sewu',
        description: 'Bangunan bersejarah bekas kantor pusat Perusahaan Kereta Api Hindia Belanda yang sekarang menjadi objek wisata.',
        latitude: -6.984322,
        longitude: 110.410606,
        address: 'Jl. Pemuda, Semarang, Jawa Tengah',
        category: 'sejarah',
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Lawang_Sewu.jpg/800px-Lawang_Sewu.jpg'
      }
    ];

    const insertTourismPlace = db.prepare(`
      INSERT INTO tourism_places (name, description, latitude, longitude, address, category, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const place of tourismPlaces) {
      insertTourismPlace.run(
        place.name,
        place.description,
        place.latitude,
        place.longitude,
        place.address,
        place.category,
        place.image_url
      );
    }

    console.log(`${tourismPlaces.length} tourism places added`);

    // Seed event budaya
    const now = new Date();
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
    
    const culturalEvents = [
      {
        name: 'Festival Rakyat Jogja',
        description: 'Festival seni dan budaya tahunan yang menampilkan berbagai pertunjukan tradisional Jawa.',
        latitude: -7.797068,
        longitude: 110.370529,
        address: 'Alun-alun Utara, Yogyakarta',
        start_date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 hari dari sekarang
        end_date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 hari dari sekarang
        image_url: 'https://example.com/festival-jogja.jpg'
      },
      {
        name: 'Bali Arts Festival',
        description: 'Festival seni dan budaya terbesar di Bali yang menampilkan tarian, musik, dan seni rupa tradisional.',
        latitude: -8.656240,
        longitude: 115.216126,
        address: 'Taman Budaya, Denpasar, Bali',
        start_date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 hari dari sekarang
        end_date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 hari dari sekarang
        image_url: 'https://example.com/bali-arts.jpg'
      },
      {
        name: 'Jakarta International Java Jazz Festival',
        description: 'Festival musik jazz internasional tahunan yang diadakan di Jakarta dengan menampilkan musisi lokal dan internasional.',
        latitude: -6.141090,
        longitude: 106.822376,
        address: 'JIExpo Kemayoran, Jakarta',
        start_date: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 hari dari sekarang
        end_date: new Date(now.getTime() + 23 * 24 * 60 * 60 * 1000).toISOString(), // 23 hari dari sekarang
        image_url: 'https://example.com/java-jazz.jpg'
      },
      {
        name: 'Pameran Seni Rupa Kontemporer',
        description: 'Pameran karya seni rupa kontemporer dari seniman Indonesia yang menggabungkan unsur tradisional dan modern.',
        latitude: -6.225588,
        longitude: 106.809972,
        address: 'Galeri Nasional Indonesia, Jakarta',
        start_date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 hari dari sekarang
        end_date: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 hari dari sekarang
        image_url: 'https://example.com/pameran-seni.jpg'
      },
      {
        name: 'Festival Cap Go Meh',
        description: 'Perayaan hari ke-15 dan terakhir dari tahun baru Imlek dengan pawai lampion dan pertunjukan barongsai.',
        latitude: -0.026330,
        longitude: 109.338016,
        address: 'Jl. Diponegoro, Pontianak, Kalimantan Barat',
        start_date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 hari dari sekarang
        end_date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 hari dari sekarang
        image_url: 'https://example.com/cap-go-meh.jpg'
      }
    ];

    const insertCulturalEvent = db.prepare(`
      INSERT INTO cultural_events (name, description, latitude, longitude, address, start_date, end_date, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const event of culturalEvents) {
      insertCulturalEvent.run(
        event.name,
        event.description,
        event.latitude,
        event.longitude,
        event.address,
        event.start_date,
        event.end_date,
        event.image_url
      );
    }

    console.log(`${culturalEvents.length} cultural events added`);
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

module.exports = { seedDatabase }; 