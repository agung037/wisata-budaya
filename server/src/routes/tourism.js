const Joi = require('@hapi/joi');
const { 
  getAllTourismPlaces, 
  getTourismPlaceById, 
  getNearbyTourismPlaces, 
  bookmarkTourismPlace,
  unbookmarkTourismPlace
} = require('../controllers/tourism');

module.exports = [
  // Get all tourism places
  {
    method: 'GET',
    path: '/api/tourism',
    handler: getAllTourismPlaces,
    options: {
      auth: false
    }
  },
  
  // Get tourism place by ID
  {
    method: 'GET',
    path: '/api/tourism/{id}',
    handler: getTourismPlaceById,
    options: {
      auth: false,
      validate: {
        params: Joi.object({
          id: Joi.number().integer().required()
        })
      }
    }
  },
  
  // Get nearby tourism places
  {
    method: 'GET',
    path: '/api/tourism/nearby',
    handler: getNearbyTourismPlaces,
    options: {
      validate: {
        query: Joi.object({
          latitude: Joi.number().required(),
          longitude: Joi.number().required(),
          radius: Joi.number().optional().default(10000) // Radius dalam meter, default 10km
        })
      }
    }
  },
  
  // Bookmark tourism place
  {
    method: 'POST',
    path: '/api/tourism/{id}/bookmark',
    handler: bookmarkTourismPlace,
    options: {
      validate: {
        params: Joi.object({
          id: Joi.number().integer().required()
        })
      }
    }
  },
  
  // Unbookmark tourism place
  {
    method: 'DELETE',
    path: '/api/tourism/{id}/bookmark',
    handler: unbookmarkTourismPlace,
    options: {
      validate: {
        params: Joi.object({
          id: Joi.number().integer().required()
        })
      }
    }
  }
]; 