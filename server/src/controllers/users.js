const { db } = require('../database/init');

const getProfile = async (request, h) => {
  try {
    const userId = request.auth.credentials.id;
    
    const user = db.prepare('SELECT id, email, name, bio, preferences FROM users WHERE id = ?').get(userId);
    
    if (!user) {
      return h.response({ message: 'User tidak ditemukan' }).code(404);
    }
    
    // Parse preferences jika ada
    if (user.preferences) {
      user.preferences = JSON.parse(user.preferences);
    } else {
      user.preferences = [];
    }
    
    return h.response(user).code(200);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};

const updateProfile = async (request, h) => {
  try {
    const userId = request.auth.credentials.id;
    const { name, bio, preferences } = request.payload;
    
    // Validasi apakah user ada
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    
    if (!user) {
      return h.response({ message: 'User tidak ditemukan' }).code(404);
    }
    
    // Siapkan fields yang akan diupdate
    const updateFields = [];
    const params = [];
    
    if (name !== undefined) {
      updateFields.push('name = ?');
      params.push(name);
    }
    
    if (bio !== undefined) {
      updateFields.push('bio = ?');
      params.push(bio);
    }
    
    if (preferences !== undefined) {
      updateFields.push('preferences = ?');
      params.push(JSON.stringify(preferences));
    }
    
    // Jika tidak ada yang diupdate
    if (updateFields.length === 0) {
      return h.response({ message: 'Tidak ada data yang diupdate' }).code(400);
    }
    
    // Update user
    params.push(userId);
    const result = db.prepare(`
      UPDATE users 
      SET ${updateFields.join(', ')} 
      WHERE id = ?
    `).run(...params);
    
    if (result.changes > 0) {
      // Ambil data user yang sudah diupdate
      const updatedUser = db.prepare('SELECT id, email, name, bio, preferences FROM users WHERE id = ?').get(userId);
      
      // Parse preferences
      if (updatedUser.preferences) {
        updatedUser.preferences = JSON.parse(updatedUser.preferences);
      } else {
        updatedUser.preferences = [];
      }
      
      return h.response({ message: 'Profil berhasil diupdate', user: updatedUser }).code(200);
    } else {
      return h.response({ message: 'Tidak ada perubahan pada profil' }).code(304);
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};

const getUserBookmarks = async (request, h) => {
  try {
    const userId = request.auth.credentials.id;
    
    // Ambil bookmark tempat wisata
    const tourismBookmarks = db.prepare(`
      SELECT 
        b.id as bookmark_id,
        t.id, 
        t.name, 
        t.description, 
        t.latitude, 
        t.longitude, 
        t.address, 
        t.category, 
        t.image_url,
        'tourism_place' as type
      FROM bookmarks b
      JOIN tourism_places t ON b.tourism_place_id = t.id
      WHERE b.user_id = ? AND b.tourism_place_id IS NOT NULL
    `).all(userId);
    
    // Ambil bookmark event budaya
    const eventBookmarks = db.prepare(`
      SELECT 
        b.id as bookmark_id,
        e.id, 
        e.name, 
        e.description, 
        e.latitude, 
        e.longitude, 
        e.address, 
        e.start_date, 
        e.end_date, 
        e.image_url,
        'cultural_event' as type
      FROM bookmarks b
      JOIN cultural_events e ON b.cultural_event_id = e.id
      WHERE b.user_id = ? AND b.cultural_event_id IS NOT NULL
    `).all(userId);
    
    // Gabungkan hasil
    const bookmarks = [...tourismBookmarks, ...eventBookmarks];
    
    return h.response(bookmarks).code(200);
  } catch (error) {
    console.error('Error fetching user bookmarks:', error);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};

const getPersonalizedRecommendations = async (request, h) => {
  try {
    const userId = request.auth.credentials.id;
    
    // Ambil preferensi user
    const user = db.prepare('SELECT preferences FROM users WHERE id = ?').get(userId);
    
    if (!user) {
      return h.response({ message: 'User tidak ditemukan' }).code(404);
    }
    
    let userPreferences = [];
    if (user.preferences) {
      userPreferences = JSON.parse(user.preferences);
    }
    
    // Rekomendasi berdasarkan preferensi
    let recommendedTourismPlaces = [];
    
    if (userPreferences.length > 0) {
      // Buat query dinamis berdasarkan preferensi
      const placeholders = userPreferences.map(() => '?').join(',');
      const query = `
        SELECT * FROM tourism_places 
        WHERE category IN (${placeholders})
        LIMIT 5
      `;
      
      recommendedTourismPlaces = db.prepare(query).all(...userPreferences);
    } else {
      // Jika tidak ada preferensi, ambil tempat wisata secara acak
      recommendedTourismPlaces = db.prepare(`
        SELECT * FROM tourism_places ORDER BY RANDOM() LIMIT 5
      `).all();
    }
    
    // Ambil event yang akan datang
    const upcomingEvents = db.prepare(`
      SELECT * FROM cultural_events
      WHERE start_date > datetime('now')
      ORDER BY start_date ASC
      LIMIT 5
    `).all();
    
    // Ambil tempat wisata yang di-bookmark user
    const bookmarkedPlaceIds = db.prepare(`
      SELECT tourism_place_id FROM bookmarks
      WHERE user_id = ? AND tourism_place_id IS NOT NULL
    `).all(userId).map(item => item.tourism_place_id);
    
    // Rekomendasi berdasarkan bookmark (tempat wisata dengan kategori yang sama)
    let recommendedBasedOnBookmarks = [];
    
    if (bookmarkedPlaceIds.length > 0) {
      // Ambil kategori dari tempat yang di-bookmark
      const bookmarkedCategories = db.prepare(`
        SELECT DISTINCT category FROM tourism_places
        WHERE id IN (${bookmarkedPlaceIds.map(() => '?').join(',')})
      `).all(...bookmarkedPlaceIds).map(item => item.category);
      
      if (bookmarkedCategories.length > 0) {
        // Rekomendasi tempat wisata dengan kategori yang sama, tapi belum di-bookmark
        const query = `
          SELECT * FROM tourism_places
          WHERE category IN (${bookmarkedCategories.map(() => '?').join(',')})
          AND id NOT IN (${bookmarkedPlaceIds.length > 0 ? bookmarkedPlaceIds.map(() => '?').join(',') : '0'})
          LIMIT 5
        `;
        
        const params = [...bookmarkedCategories];
        if (bookmarkedPlaceIds.length > 0) {
          params.push(...bookmarkedPlaceIds);
        }
        
        recommendedBasedOnBookmarks = db.prepare(query).all(...params);
      }
    }
    
    return h.response({
      based_on_preferences: recommendedTourismPlaces,
      based_on_bookmarks: recommendedBasedOnBookmarks,
      upcoming_events: upcomingEvents
    }).code(200);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getUserBookmarks,
  getPersonalizedRecommendations
}; 