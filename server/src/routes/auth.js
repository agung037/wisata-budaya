const Joi = require('@hapi/joi');
const { registerUser, loginUser } = require('../controllers/auth');

module.exports = [
  // Register route
  {
    method: 'POST',
    path: '/api/auth/register',
    handler: registerUser,
    options: {
      auth: false,
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().min(6).required(),
          name: Joi.string().required(),
          preferences: Joi.array().items(Joi.string()).optional()
        })
      }
    }
  },
  
  // Login route
  {
    method: 'POST',
    path: '/api/auth/login',
    handler: loginUser,
    options: {
      auth: false,
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().required()
        })
      }
    }
  }
]; 