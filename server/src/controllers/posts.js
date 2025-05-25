const { db } = require('../database/init');

const getAllPosts = async (request, h) => {
  try {
    // Ambil semua post dengan informasi user dan lokasi
    const posts = db.prepare(`
      SELECT 
        p.id, 
        p.title, 
        p.content, 
        p.image_url, 
        p.created_at,
        u.id as user_id, 
        u.name as user_name,
        tp.id as tourism_place_id,
        tp.name as tourism_place_name,
        ce.id as cultural_event_id,
        ce.name as cultural_event_name
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN tourism_places tp ON p.tourism_place_id = tp.id
      LEFT JOIN cultural_events ce ON p.cultural_event_id = ce.id
      ORDER BY p.created_at DESC
    `).all();
    
    // Ambil jumlah komentar untuk setiap post
    const postsWithCommentCount = posts.map(post => {
      const commentCount = db.prepare(`
        SELECT COUNT(*) as count FROM comments WHERE post_id = ?
      `).get(post.id);
      
      return {
        ...post,
        comment_count: commentCount.count
      };
    });
    
    return h.response(postsWithCommentCount).code(200);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};

const getPostById = async (request, h) => {
  try {
    const { id } = request.params;
    
    // Ambil post dengan informasi user dan lokasi
    const post = db.prepare(`
      SELECT 
        p.id, 
        p.title, 
        p.content, 
        p.image_url, 
        p.created_at,
        u.id as user_id, 
        u.name as user_name,
        tp.id as tourism_place_id,
        tp.name as tourism_place_name,
        ce.id as cultural_event_id,
        ce.name as cultural_event_name
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN tourism_places tp ON p.tourism_place_id = tp.id
      LEFT JOIN cultural_events ce ON p.cultural_event_id = ce.id
      WHERE p.id = ?
    `).get(id);
    
    if (!post) {
      return h.response({ message: 'Post tidak ditemukan' }).code(404);
    }
    
    // Ambil komentar untuk post ini
    const comments = db.prepare(`
      SELECT 
        c.id, 
        c.content, 
        c.created_at,
        u.id as user_id, 
        u.name as user_name
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `).all(id);
    
    return h.response({ ...post, comments }).code(200);
  } catch (error) {
    console.error('Error fetching post:', error);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};

const createPost = async (request, h) => {
  try {
    const { title, content, image_url, tourism_place_id, cultural_event_id } = request.payload;
    const userId = request.auth.credentials.id;
    
    // Validasi tourism_place_id jika ada
    if (tourism_place_id) {
      const tourismPlace = db.prepare('SELECT * FROM tourism_places WHERE id = ?').get(tourism_place_id);
      
      if (!tourismPlace) {
        return h.response({ message: 'Tempat wisata tidak ditemukan' }).code(404);
      }
    }
    
    // Validasi cultural_event_id jika ada
    if (cultural_event_id) {
      const culturalEvent = db.prepare('SELECT * FROM cultural_events WHERE id = ?').get(cultural_event_id);
      
      if (!culturalEvent) {
        return h.response({ message: 'Event budaya tidak ditemukan' }).code(404);
      }
    }
    
    // Tambahkan post baru
    const result = db.prepare(`
      INSERT INTO posts (user_id, title, content, image_url, tourism_place_id, cultural_event_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(userId, title, content, image_url, tourism_place_id, cultural_event_id);
    
    if (result.changes > 0) {
      // Ambil post yang baru dibuat
      const newPost = db.prepare(`
        SELECT 
          p.id, 
          p.title, 
          p.content, 
          p.image_url, 
          p.created_at,
          u.id as user_id, 
          u.name as user_name,
          tp.id as tourism_place_id,
          tp.name as tourism_place_name,
          ce.id as cultural_event_id,
          ce.name as cultural_event_name
        FROM posts p
        JOIN users u ON p.user_id = u.id
        LEFT JOIN tourism_places tp ON p.tourism_place_id = tp.id
        LEFT JOIN cultural_events ce ON p.cultural_event_id = ce.id
        WHERE p.id = ?
      `).get(result.lastInsertRowid);
      
      return h.response({ 
        message: 'Post berhasil dibuat',
        post: newPost
      }).code(201);
    } else {
      return h.response({ message: 'Gagal membuat post' }).code(500);
    }
  } catch (error) {
    console.error('Error creating post:', error);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};

const updatePost = async (request, h) => {
  try {
    const { id } = request.params;
    const { title, content, image_url } = request.payload;
    const userId = request.auth.credentials.id;
    
    // Cek apakah post ada dan milik user ini
    const post = db.prepare(`
      SELECT * FROM posts WHERE id = ?
    `).get(id);
    
    if (!post) {
      return h.response({ message: 'Post tidak ditemukan' }).code(404);
    }
    
    if (post.user_id !== userId) {
      return h.response({ message: 'Anda tidak memiliki izin untuk mengedit post ini' }).code(403);
    }
    
    // Siapkan fields yang akan diupdate
    const updateFields = [];
    const params = [];
    
    if (title !== undefined) {
      updateFields.push('title = ?');
      params.push(title);
    }
    
    if (content !== undefined) {
      updateFields.push('content = ?');
      params.push(content);
    }
    
    if (image_url !== undefined) {
      updateFields.push('image_url = ?');
      params.push(image_url);
    }
    
    // Jika tidak ada yang diupdate
    if (updateFields.length === 0) {
      return h.response({ message: 'Tidak ada data yang diupdate' }).code(400);
    }
    
    // Update post
    params.push(id);
    const result = db.prepare(`
      UPDATE posts 
      SET ${updateFields.join(', ')} 
      WHERE id = ?
    `).run(...params);
    
    if (result.changes > 0) {
      // Ambil post yang sudah diupdate
      const updatedPost = db.prepare(`
        SELECT 
          p.id, 
          p.title, 
          p.content, 
          p.image_url, 
          p.created_at,
          u.id as user_id, 
          u.name as user_name,
          tp.id as tourism_place_id,
          tp.name as tourism_place_name,
          ce.id as cultural_event_id,
          ce.name as cultural_event_name
        FROM posts p
        JOIN users u ON p.user_id = u.id
        LEFT JOIN tourism_places tp ON p.tourism_place_id = tp.id
        LEFT JOIN cultural_events ce ON p.cultural_event_id = ce.id
        WHERE p.id = ?
      `).get(id);
      
      return h.response({ 
        message: 'Post berhasil diupdate',
        post: updatedPost
      }).code(200);
    } else {
      return h.response({ message: 'Tidak ada perubahan pada post' }).code(304);
    }
  } catch (error) {
    console.error('Error updating post:', error);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};

const deletePost = async (request, h) => {
  try {
    const { id } = request.params;
    const userId = request.auth.credentials.id;
    
    // Cek apakah post ada dan milik user ini
    const post = db.prepare(`
      SELECT * FROM posts WHERE id = ?
    `).get(id);
    
    if (!post) {
      return h.response({ message: 'Post tidak ditemukan' }).code(404);
    }
    
    if (post.user_id !== userId) {
      return h.response({ message: 'Anda tidak memiliki izin untuk menghapus post ini' }).code(403);
    }
    
    // Hapus komentar terkait terlebih dahulu
    db.prepare(`
      DELETE FROM comments WHERE post_id = ?
    `).run(id);
    
    // Hapus post
    const result = db.prepare(`
      DELETE FROM posts WHERE id = ?
    `).run(id);
    
    if (result.changes > 0) {
      return h.response({ message: 'Post berhasil dihapus' }).code(200);
    } else {
      return h.response({ message: 'Gagal menghapus post' }).code(500);
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};

const getPostComments = async (request, h) => {
  try {
    const { id } = request.params;
    
    // Cek apakah post ada
    const post = db.prepare(`
      SELECT * FROM posts WHERE id = ?
    `).get(id);
    
    if (!post) {
      return h.response({ message: 'Post tidak ditemukan' }).code(404);
    }
    
    // Ambil komentar untuk post ini
    const comments = db.prepare(`
      SELECT 
        c.id, 
        c.content, 
        c.created_at,
        u.id as user_id, 
        u.name as user_name
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `).all(id);
    
    return h.response(comments).code(200);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};

const addComment = async (request, h) => {
  try {
    const { id } = request.params;
    const { content } = request.payload;
    const userId = request.auth.credentials.id;
    
    // Cek apakah post ada
    const post = db.prepare(`
      SELECT * FROM posts WHERE id = ?
    `).get(id);
    
    if (!post) {
      return h.response({ message: 'Post tidak ditemukan' }).code(404);
    }
    
    // Tambahkan komentar
    const result = db.prepare(`
      INSERT INTO comments (user_id, post_id, content)
      VALUES (?, ?, ?)
    `).run(userId, id, content);
    
    if (result.changes > 0) {
      // Ambil komentar yang baru dibuat
      const newComment = db.prepare(`
        SELECT 
          c.id, 
          c.content, 
          c.created_at,
          u.id as user_id, 
          u.name as user_name
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.id = ?
      `).get(result.lastInsertRowid);
      
      return h.response({ 
        message: 'Komentar berhasil ditambahkan',
        comment: newComment
      }).code(201);
    } else {
      return h.response({ message: 'Gagal menambahkan komentar' }).code(500);
    }
  } catch (error) {
    console.error('Error adding comment:', error);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};

const deleteComment = async (request, h) => {
  try {
    const { id } = request.params;
    const userId = request.auth.credentials.id;
    
    // Cek apakah komentar ada dan milik user ini
    const comment = db.prepare(`
      SELECT * FROM comments WHERE id = ?
    `).get(id);
    
    if (!comment) {
      return h.response({ message: 'Komentar tidak ditemukan' }).code(404);
    }
    
    if (comment.user_id !== userId) {
      return h.response({ message: 'Anda tidak memiliki izin untuk menghapus komentar ini' }).code(403);
    }
    
    // Hapus komentar
    const result = db.prepare(`
      DELETE FROM comments WHERE id = ?
    `).run(id);
    
    if (result.changes > 0) {
      return h.response({ message: 'Komentar berhasil dihapus' }).code(200);
    } else {
      return h.response({ message: 'Gagal menghapus komentar' }).code(500);
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostComments,
  addComment,
  deleteComment
}; 