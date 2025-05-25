const Joi = require('@hapi/joi');
const { 
  getProfile, 
  updateProfile, 
  getUserBookmarks,
  getPersonalizedRecommendations
} = require('../controllers/users');

module.exports = [
  // Get user profile
  {
    method: 'GET',
    path: '/api/users/profile',
    handler: getProfile
  },
  
  // Update user profile
  {
    method: 'PUT',
    path: '/api/users/profile',
    handler: updateProfile,
    options: {
      validate: {
        payload: Joi.object({
          name: Joi.string().optional(),
          bio: Joi.string().optional(),
          preferences: Joi.array().items(Joi.string()).optional()
        })
      }
    }
  },
  
  // Get user bookmarks
  {
    method: 'GET',
    path: '/api/users/bookmarks',
    handler: getUserBookmarks
  },
  
  // Get personalized recommendations
  {
    method: 'GET',
    path: '/api/users/recommendations',
    handler: getPersonalizedRecommendations
  }
]; 