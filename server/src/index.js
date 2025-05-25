'use strict';

const Hapi = require('@hapi/hapi');
const path = require('path');
const { initDatabase } = require('./database/init');
const { seedDatabase } = require('./database/seed');
const { registerJwtMethods } = require('./auth/jwt');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const tourismRoutes = require('./routes/tourism');
const eventRoutes = require('./routes/events');
const postRoutes = require('./routes/posts');

const init = async () => {
  // Inisialisasi server
  const server = Hapi.server({
    port: 3001,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
        credentials: true
      }
    }
  });

  // Registrasi plugin
  await server.register([
    require('@hapi/inert'),
    require('@hapi/jwt')
  ]);

  // Register JWT helper methods
  registerJwtMethods(server);

  // Inisialisasi database
  initDatabase();
  
  // Seed database jika diperlukan (hanya untuk development)
  if (process.env.NODE_ENV !== 'production') {
    await seedDatabase();
  }

  // Strategi autentikasi JWT
  server.auth.strategy('jwt', 'jwt', {
    keys: 'rahasia-jwt-wisata-budaya', // Ganti dengan secret key yang lebih aman
    verify: {
      aud: false,
      iss: false,
      sub: false
    },
    validate: async (artifacts, request, h) => {
      return { isValid: true, credentials: artifacts.decoded.payload };
    }
  });
  
  server.auth.default('jwt');

  // Definisikan routes
  server.route([
    // Route statis untuk serving file
    {
      method: 'GET',
      path: '/uploads/{param*}',
      handler: {
        directory: {
          path: path.join(__dirname, '../uploads'),
          listing: false
        }
      },
      options: {
        auth: false
      }
    },
    
    // Health check route
    {
      method: 'GET',
      path: '/health',
      handler: () => ({ status: 'ok', timestamp: new Date().toISOString() }),
      options: {
        auth: false
      }
    },
    
    // Gabungkan semua routes
    ...authRoutes,
    ...userRoutes,
    ...tourismRoutes,
    ...eventRoutes,
    ...postRoutes
  ]);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init(); 