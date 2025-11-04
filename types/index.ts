// Mood types
export type Mood = 'happy' | 'good' | 'okay' | 'sad' | 'anxious';

// User type
export interface User {
  _id: string;
  username: string;
  email?: string;
  themePreference: {
    mode: 'light' | 'dark';
    accentColor: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Journal Entry type
export interface JournalEntry {
  _id: string;
  userId: string;
  title: string;
  content: string;
  mood: Mood;
  date: Date;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Todo type
export interface Todo {
  _id: string;
  userId: string;
  text: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Form types
export interface JournalEntryFormData {
  title: string;
  content: string;
  mood: Mood;
  date: Date;
  tags?: string[];
}

export interface TodoFormData {
  text: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
}

export interface ThemePreference {
  mode: 'light' | 'dark';
  accentColor: string;
}