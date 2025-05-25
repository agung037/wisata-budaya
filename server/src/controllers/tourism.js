const { db } = require('../database/init');

// Helper function untuk menghitung jarak antara dua koordinat (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Radius bumi dalam meter
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}

const getAllTourismPlaces = async (request, h) => {
  try {
    // Ambil semua tempat wisata
    const tourismPlaces = db.prepare(`
      SELECT * FROM tourism_places
    `).all();
    
    return h.response(tourismPlaces).code(200);
  } catch (error) {
    console.error('Error fetching tourism places:', error);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};

const getTourismPlaceById = async (request, h) => {
  try {
    const { id } = request.params;
    
    // Ambil tempat wisata berdasarkan ID
    const tourismPlace = db.prepare(`
      SELECT * FROM tourism_places WHERE id = ?
    `).get(id);
    
    if (!tourismPlace) {
      return h.response({ message: 'Tempat wisata tidak ditemukan' }).code(404);
    }
    
    // Cek apakah user telah bookmark tempat ini
    let isBookmarked = false;
    
    if (request.auth.isAuthenticated) {
      const userId = request.auth.credentials.id;
      
      const bookmark = db.prepare(`
        SELECT * FROM bookmarks 
        WHERE user_id = ? AND tourism_place_id = ?
      `).get(userId, id);
      
      isBookmarked = !!bookmark;
    }
    
    return h.response({ ...tourismPlace, isBookmarked }).code(200);
  } catch (error) {
    console.error('Error fetching tourism place:', error);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};

const getNearbyTourismPlaces = async (request, h) => {
  try {
    const { latitude, longitude, radius = 10000 } = request.query;
    
    // Ambil semua tempat wisata
    const allTourismPlaces = db.prepare(`
      SELECT * FROM tourism_places
    `).all();
    
    // Filter berdasarkan radius
    const nearbyPlaces = allTourismPlaces.filter(place => {
      const distance = calculateDistance(
        latitude, 
        longitude, 
        place.latitude, 
        place.longitude
      );
      
      return distance <= radius;
    });
    
    // Tambahkan jarak ke setiap tempat wisata
    const placesWithDistance = nearbyPlaces.map(place => {
      const distance = calculateDistance(
        latitude, 
        longitude, 
        place.latitude, 
        place.longitude
      );
      
      return {
        ...place,
        distance: Math.round(distance)
      };
    });
    
    // Urutkan berdasarkan jarak terdekat
    placesWithDistance.sort((a, b) => a.distance - b.distance);
    
    return h.response(placesWithDistance).code(200);
  } catch (error) {
    console.error('Error fetching nearby tourism places:', error);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};

const bookmarkTourismPlace = async (request, h) => {
  try {
    const { id } = request.params;
    const userId = request.auth.credentials.id;
    
    // Cek apakah tempat wisata ada
    const tourismPlace = db.prepare(`
      SELECT * FROM tourism_places WHERE id = ?
    `).get(id);
    
    if (!tourismPlace) {
      return h.response({ message: 'Tempat wisata tidak ditemukan' }).code(404);
    }
    
    // Cek apakah sudah di-bookmark
    const existingBookmark = db.prepare(`
      SELECT * FROM bookmarks 
      WHERE user_id = ? AND tourism_place_id = ?
    `).get(userId, id);
    
    if (existingBookmark) {
      return h.response({ message: 'Tempat wisata sudah di-bookmark' }).code(400);
    }
    
    // Tambahkan bookmark
    const result = db.prepare(`
      INSERT INTO bookmarks (user_id, tourism_place_id)
      VALUES (?, ?)
    `).run(userId, id);
    
    if (result.changes > 0) {
      return h.response({ 
        message: 'Tempat wisata berhasil di-bookmark',
        bookmark_id: result.lastInsertRowid
      }).code(201);
    } else {
      return h.response({ message: 'Gagal menambahkan bookmark' }).code(500);
    }
  } catch (error) {
    console.error('Error bookmarking tourism place:', error);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};

const unbookmarkTourismPlace = async (request, h) => {
  try {
    const { id } = request.params;
    const userId = request.auth.credentials.id;
    
    // Cek apakah bookmark ada
    const bookmark = db.prepare(`
      SELECT * FROM bookmarks 
      WHERE user_id = ? AND tourism_place_id = ?
    `).get(userId, id);
    
    if (!bookmark) {
      return h.response({ message: 'Bookmark tidak ditemukan' }).code(404);
    }
    
    // Hapus bookmark
    const result = db.prepare(`
      DELETE FROM bookmarks 
      WHERE user_id = ? AND tourism_place_id = ?
    `).run(userId, id);
    
    if (result.changes > 0) {
      return h.response({ message: 'Bookmark berhasil dihapus' }).code(200);
    } else {
      return h.response({ message: 'Gagal menghapus bookmark' }).code(500);
    }
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};

module.exports = {
  getAllTourismPlaces,
  getTourismPlaceById,
  getNearbyTourismPlaces,
  bookmarkTourismPlace,
  unbookmarkTourismPlace
}; 