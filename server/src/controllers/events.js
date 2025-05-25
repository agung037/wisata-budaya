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

const getAllCulturalEvents = async (request, h) => {
  try {
    // Ambil semua event budaya
    const culturalEvents = db.prepare(`
      SELECT * FROM cultural_events
    `).all();
    
    return h.response(culturalEvents).code(200);
  } catch (error) {
    console.error('Error fetching cultural events:', error);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};

const getCulturalEventById = async (request, h) => {
  try {
    const { id } = request.params;
    
    // Ambil event budaya berdasarkan ID
    const culturalEvent = db.prepare(`
      SELECT * FROM cultural_events WHERE id = ?
    `).get(id);
    
    if (!culturalEvent) {
      return h.response({ message: 'Event budaya tidak ditemukan' }).code(404);
    }
    
    // Cek apakah user telah bookmark event ini
    let isBookmarked = false;
    
    if (request.auth.isAuthenticated) {
      const userId = request.auth.credentials.id;
      
      const bookmark = db.prepare(`
        SELECT * FROM bookmarks 
        WHERE user_id = ? AND cultural_event_id = ?
      `).get(userId, id);
      
      isBookmarked = !!bookmark;
    }
    
    return h.response({ ...culturalEvent, isBookmarked }).code(200);
  } catch (error) {
    console.error('Error fetching cultural event:', error);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};

const getNearbyCulturalEvents = async (request, h) => {
  try {
    const { latitude, longitude, radius = 10000 } = request.query;
    
    // Ambil semua event budaya
    const allCulturalEvents = db.prepare(`
      SELECT * FROM cultural_events
    `).all();
    
    // Filter berdasarkan radius
    const nearbyEvents = allCulturalEvents.filter(event => {
      const distance = calculateDistance(
        latitude, 
        longitude, 
        event.latitude, 
        event.longitude
      );
      
      return distance <= radius;
    });
    
    // Tambahkan jarak ke setiap event
    const eventsWithDistance = nearbyEvents.map(event => {
      const distance = calculateDistance(
        latitude, 
        longitude, 
        event.latitude, 
        event.longitude
      );
      
      return {
        ...event,
        distance: Math.round(distance)
      };
    });
    
    // Urutkan berdasarkan jarak terdekat
    eventsWithDistance.sort((a, b) => a.distance - b.distance);
    
    return h.response(eventsWithDistance).code(200);
  } catch (error) {
    console.error('Error fetching nearby cultural events:', error);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};

const getUpcomingCulturalEvents = async (request, h) => {
  try {
    const now = new Date().toISOString();
    
    // Ambil event yang akan datang
    const upcomingEvents = db.prepare(`
      SELECT * FROM cultural_events
      WHERE start_date > ?
      ORDER BY start_date ASC
    `).all(now);
    
    return h.response(upcomingEvents).code(200);
  } catch (error) {
    console.error('Error fetching upcoming cultural events:', error);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};

const bookmarkCulturalEvent = async (request, h) => {
  try {
    const { id } = request.params;
    const userId = request.auth.credentials.id;
    
    // Cek apakah event budaya ada
    const culturalEvent = db.prepare(`
      SELECT * FROM cultural_events WHERE id = ?
    `).get(id);
    
    if (!culturalEvent) {
      return h.response({ message: 'Event budaya tidak ditemukan' }).code(404);
    }
    
    // Cek apakah sudah di-bookmark
    const existingBookmark = db.prepare(`
      SELECT * FROM bookmarks 
      WHERE user_id = ? AND cultural_event_id = ?
    `).get(userId, id);
    
    if (existingBookmark) {
      return h.response({ message: 'Event budaya sudah di-bookmark' }).code(400);
    }
    
    // Tambahkan bookmark
    const result = db.prepare(`
      INSERT INTO bookmarks (user_id, cultural_event_id)
      VALUES (?, ?)
    `).run(userId, id);
    
    if (result.changes > 0) {
      return h.response({ 
        message: 'Event budaya berhasil di-bookmark',
        bookmark_id: result.lastInsertRowid
      }).code(201);
    } else {
      return h.response({ message: 'Gagal menambahkan bookmark' }).code(500);
    }
  } catch (error) {
    console.error('Error bookmarking cultural event:', error);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};

const unbookmarkCulturalEvent = async (request, h) => {
  try {
    const { id } = request.params;
    const userId = request.auth.credentials.id;
    
    // Cek apakah bookmark ada
    const bookmark = db.prepare(`
      SELECT * FROM bookmarks 
      WHERE user_id = ? AND cultural_event_id = ?
    `).get(userId, id);
    
    if (!bookmark) {
      return h.response({ message: 'Bookmark tidak ditemukan' }).code(404);
    }
    
    // Hapus bookmark
    const result = db.prepare(`
      DELETE FROM bookmarks 
      WHERE user_id = ? AND cultural_event_id = ?
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
  getAllCulturalEvents,
  getCulturalEventById,
  getNearbyCulturalEvents,
  getUpcomingCulturalEvents,
  bookmarkCulturalEvent,
  unbookmarkCulturalEvent
}; 