const bcrypt = require('bcrypt');
const { db } = require('../database/init');

const registerUser = async (request, h) => {
  const { email, password, name, preferences = [] } = request.payload;
  
  try {
    // Cek apakah email sudah terdaftar
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (existingUser) {
      return h.response({ message: 'Email sudah terdaftar' }).code(400);
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Simpan user baru
    const result = db.prepare(`
      INSERT INTO users (email, password, name, preferences)
      VALUES (?, ?, ?, ?)
    `).run(email, hashedPassword, name, JSON.stringify(preferences));
    
    if (result.changes > 0) {
      return h.response({ 
        message: 'Registrasi berhasil',
        user_id: result.lastInsertRowid
      }).code(201);
    } else {
      return h.response({ message: 'Gagal mendaftarkan user' }).code(500);
    }
  } catch (error) {
    console.error('Error registering user:', error);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};

const loginUser = async (request, h) => {
  const { email, password } = request.payload;
  
  try {
    // Cari user dengan email tersebut
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (!user) {
      return h.response({ message: 'Email atau password salah' }).code(401);
    }
    
    // Verifikasi password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return h.response({ message: 'Email atau password salah' }).code(401);
    }
    
    // Generate JWT token
    const token = h.request.server.methods.createToken({
      id: user.id,
      email: user.email,
      name: user.name
    });
    
    return h.response({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        preferences: JSON.parse(user.preferences || '[]')
      }
    }).code(200);
  } catch (error) {
    console.error('Error logging in:', error);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};

module.exports = {
  registerUser,
  loginUser
}; 