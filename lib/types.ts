export type Category =
  | "Food"
  | "Drinks & Nightlife & adult fun"
  | "The Great Outdoors"
  | "Furry Friends"
  | "Entertainment & Family Fun"
  | "Weird and Wonderful";

export const CATEGORIES: Category[] = [
  "Food",
  "Drinks & Nightlife & adult fun",
  "The Great Outdoors",
  "Furry Friends",
  "Entertainment & Family Fun",
  "Weird and Wonderful",
];

export const CATEGORY_COLORS: Record<Category, string> = {
  "Food": "#1A237E",
  "Drinks & Nightlife & adult fun": "#C2185B",
  "The Great Outdoors": "#097138",
  "Furry Friends": "#F57C00",
  "Entertainment & Family Fun": "#0288D1",
  "Weird and Wonderful": "#9C27B0",
};

export const CATEGORY_LABELS: Record<Category, string> = {
  "Food": "Food",
  "Drinks & Nightlife & adult fun": "Drinks & Nightlife",
  "The Great Outdoors": "The Great Outdoors",
  "Furry Friends": "Furry Friends",
  "Entertainment & Family Fun": "Entertainment",
  "Weird and Wonderful": "Weird & Wonderful",
};

export const CATEGORY_EMOJIS: Record<Category, string> = {
  "Food": "🍽️",
  "Drinks & Nightlife & adult fun": "🍸",
  "The Great Outdoors": "🌲",
  "Furry Friends": "🐾",
  "Entertainment & Family Fun": "🎡",
  "Weird and Wonderful": "🔮",
};

export interface Spot {
  id: string;
  name: string;
  category: Category;
  latitude: number;
  longitude: number;
  description?: string;
  photo_url?: string;
  state?: string;
  city?: string;
  heart_count: number;
  created_at: string;
  submitted_by?: string;
}

export interface UserList {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  spot_count?: number;
}

export interface ListSpot {
  id: string;
  list_id: string;
  spot_id: string;
  added_at: string;
  spot?: Spot;
}

export interface Heart {
  id: string;
  user_id: string;
  spot_id: string;
  created_at: string;
}

export interface Submission {
  id: string;
  name: string;
  category: Category;
  latitude: number;
  longitude: number;
  description?: string;
  submitted_by: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}
