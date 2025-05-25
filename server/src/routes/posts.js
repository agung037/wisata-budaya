const Joi = require('@hapi/joi');
const { 
  getAllPosts, 
  getPostById, 
  createPost, 
  updatePost, 
  deletePost,
  getPostComments,
  addComment,
  deleteComment
} = require('../controllers/posts');

module.exports = [
  // Get all posts
  {
    method: 'GET',
    path: '/api/posts',
    handler: getAllPosts,
    options: {
      auth: false
    }
  },
  
  // Get post by ID
  {
    method: 'GET',
    path: '/api/posts/{id}',
    handler: getPostById,
    options: {
      auth: false,
      validate: {
        params: Joi.object({
          id: Joi.number().integer().required()
        })
      }
    }
  },
  
  // Create new post
  {
    method: 'POST',
    path: '/api/posts',
    handler: createPost,
    options: {
      validate: {
        payload: Joi.object({
          title: Joi.string().required(),
          content: Joi.string().required(),
          image_url: Joi.string().optional(),
          tourism_place_id: Joi.number().integer().optional(),
          cultural_event_id: Joi.number().integer().optional()
        })
      }
    }
  },
  
  // Update post
  {
    method: 'PUT',
    path: '/api/posts/{id}',
    handler: updatePost,
    options: {
      validate: {
        params: Joi.object({
          id: Joi.number().integer().required()
        }),
        payload: Joi.object({
          title: Joi.string().optional(),
          content: Joi.string().optional(),
          image_url: Joi.string().optional()
        })
      }
    }
  },
  
  // Delete post
  {
    method: 'DELETE',
    path: '/api/posts/{id}',
    handler: deletePost,
    options: {
      validate: {
        params: Joi.object({
          id: Joi.number().integer().required()
        })
      }
    }
  },
  
  // Get comments for a post
  {
    method: 'GET',
    path: '/api/posts/{id}/comments',
    handler: getPostComments,
    options: {
      auth: false,
      validate: {
        params: Joi.object({
          id: Joi.number().integer().required()
        })
      }
    }
  },
  
  // Add comment to a post
  {
    method: 'POST',
    path: '/api/posts/{id}/comments',
    handler: addComment,
    options: {
      validate: {
        params: Joi.object({
          id: Joi.number().integer().required()
        }),
        payload: Joi.object({
          content: Joi.string().required()
        })
      }
    }
  },
  
  // Delete comment
  {
    method: 'DELETE',
    path: '/api/comments/{id}',
    handler: deleteComment,
    options: {
      validate: {
        params: Joi.object({
          id: Joi.number().integer().required()
        })
      }
    }
  }
]; 