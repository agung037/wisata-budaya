// User types
export interface User {
  id: number;
  email: string;
  name: string;
  bio?: string;
  preferences: string[];
}

// Tourism place types
export interface TourismPlace {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  category: string;
  image_url?: string;
  distance?: number;
  isBookmarked?: boolean;
}

// Cultural event types
export interface CulturalEvent {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  start_date: string;
  end_date: string;
  image_url?: string;
  distance?: number;
  isBookmarked?: boolean;
}

// Post types
export interface Post {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  user_id: number;
  user_name: string;
  tourism_place_id?: number;
  tourism_place_name?: string;
  cultural_event_id?: number;
  cultural_event_name?: string;
  comment_count?: number;
  comments?: Comment[];
}

// Comment types
export interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_id: number;
  user_name: string;
}

// Bookmark types
export interface Bookmark {
  bookmark_id: number;
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  type: 'tourism_place' | 'cultural_event';
  category?: string;
  start_date?: string;
  end_date?: string;
  image_url?: string;
}

// Recommendation types
export interface Recommendations {
  based_on_preferences: TourismPlace[];
  based_on_bookmarks: TourismPlace[];
  upcoming_events: CulturalEvent[];
} 