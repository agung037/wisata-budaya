const Joi = require('@hapi/joi');
const { 
  getAllCulturalEvents, 
  getCulturalEventById, 
  getNearbyCulturalEvents, 
  getUpcomingCulturalEvents,
  bookmarkCulturalEvent,
  unbookmarkCulturalEvent
} = require('../controllers/events');

module.exports = [
  // Get all cultural events
  {
    method: 'GET',
    path: '/api/events',
    handler: getAllCulturalEvents,
    options: {
      auth: false
    }
  },
  
  // Get cultural event by ID
  {
    method: 'GET',
    path: '/api/events/{id}',
    handler: getCulturalEventById,
    options: {
      auth: false,
      validate: {
        params: Joi.object({
          id: Joi.number().integer().required()
        })
      }
    }
  },
  
  // Get nearby cultural events
  {
    method: 'GET',
    path: '/api/events/nearby',
    handler: getNearbyCulturalEvents,
    options: {
      auth: false,
      validate: {
        query: Joi.object({
          latitude: Joi.number().required(),
          longitude: Joi.number().required(),
          radius: Joi.number().optional().default(10000) // Radius dalam meter, default 10km
        })
      }
    }
  },
  
  // Get upcoming cultural events
  {
    method: 'GET',
    path: '/api/events/upcoming',
    handler: getUpcomingCulturalEvents,
    options: {
      auth: false
    }
  },
  
  // Bookmark cultural event
  {
    method: 'POST',
    path: '/api/events/{id}/bookmark',
    handler: bookmarkCulturalEvent,
    options: {
      validate: {
        params: Joi.object({
          id: Joi.number().integer().required()
        })
      }
    }
  },
  
  // Unbookmark cultural event
  {
    method: 'DELETE',
    path: '/api/events/{id}/bookmark',
    handler: unbookmarkCulturalEvent,
    options: {
      validate: {
        params: Joi.object({
          id: Joi.number().integer().required()
        })
      }
    }
  }
]; 