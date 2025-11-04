'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../../../types';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user exists in localStorage
    const storedUserId = localStorage.getItem('userId');
    
    if (storedUserId) {
      // Fetch user data from API
      fetch(`/api/users/${storedUserId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUser(data.data);
          }
        })
        .catch((error) => console.error('Error fetching user:', error))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const updateUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('userId', newUser._id);
    } else {
      localStorage.removeItem('userId');
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}