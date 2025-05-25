import axios from 'axios';
import { User, TourismPlace, CulturalEvent, Post, Comment, Bookmark, Recommendations } from '../types';

interface ProfileUpdateResponse {
  message: string;
  user: User;
}

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (name: string, email: string, password: string, preferences: string[] = []) => {
    const response = await api.post('/auth/register', { name, email, password, preferences });
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// User services
export const userService = {
  getProfile: async (): Promise<User> => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  
  updateProfile: async (data: Partial<User>): Promise<ProfileUpdateResponse> => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },
  
  getBookmarks: async (): Promise<Bookmark[]> => {
    const response = await api.get('/users/bookmarks');
    return response.data;
  },
  
  getRecommendations: async (): Promise<Recommendations> => {
    const response = await api.get('/users/recommendations');
    return response.data;
  }
};

// Tourism place services
export const tourismService = {
  getAllPlaces: async (): Promise<TourismPlace[]> => {
    const response = await api.get('/tourism');
    return response.data;
  },
  
  getPlaceById: async (id: number): Promise<TourismPlace> => {
    const response = await api.get(`/tourism/${id}`);
    return response.data;
  },
  
  getNearbyPlaces: async (latitude: number, longitude: number, radius: number = 10000): Promise<TourismPlace[]> => {
    const response = await api.get('/tourism/nearby', { 
      params: { latitude, longitude, radius } 
    });
    return response.data;
  },
  
  bookmarkPlace: async (id: number) => {
    const response = await api.post(`/tourism/${id}/bookmark`);
    return response.data;
  },
  
  unbookmarkPlace: async (id: number) => {
    const response = await api.delete(`/tourism/${id}/bookmark`);
    return response.data;
  }
};

// Cultural event services
export const eventService = {
  getAllEvents: async (): Promise<CulturalEvent[]> => {
    const response = await api.get('/events');
    return response.data;
  },
  
  getEventById: async (id: number): Promise<CulturalEvent> => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },
  
  getNearbyEvents: async (latitude: number, longitude: number, radius: number = 10000): Promise<CulturalEvent[]> => {
    const response = await api.get('/events/nearby', { 
      params: { latitude, longitude, radius } 
    });
    return response.data;
  },
  
  getUpcomingEvents: async (): Promise<CulturalEvent[]> => {
    const response = await api.get('/events/upcoming');
    return response.data;
  },
  
  bookmarkEvent: async (id: number) => {
    const response = await api.post(`/events/${id}/bookmark`);
    return response.data;
  },
  
  unbookmarkEvent: async (id: number) => {
    const response = await api.delete(`/events/${id}/bookmark`);
    return response.data;
  }
};

// Post services
export const postService = {
  getAllPosts: async (): Promise<Post[]> => {
    const response = await api.get('/posts');
    return response.data;
  },
  
  getPostById: async (id: number): Promise<Post> => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },
  
  createPost: async (data: { 
    title: string, 
    content: string, 
    image_url?: string, 
    tourism_place_id?: number,
    cultural_event_id?: number
  }): Promise<Post> => {
    const response = await api.post('/posts', data);
    return response.data;
  },
  
  updatePost: async (id: number, data: { 
    title?: string, 
    content?: string, 
    image_url?: string 
  }): Promise<Post> => {
    const response = await api.put(`/posts/${id}`, data);
    return response.data;
  },
  
  deletePost: async (id: number) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },
  
  getPostComments: async (id: number): Promise<Comment[]> => {
    const response = await api.get(`/posts/${id}/comments`);
    return response.data;
  },
  
  addComment: async (postId: number, content: string): Promise<Comment> => {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data;
  },
  
  deleteComment: async (id: number) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  }
};

export default api; 