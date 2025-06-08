// hooks/useFavorites.ts
import { useState, useEffect } from 'react';
import { auth } from '../../firebase/auth';
import { collection, doc, getDocs, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';

export interface UseFavoritesReturn {
  favoriteResorts: Set<string>;
  favoritesActive: boolean;
  setFavoritesActive: (active: boolean) => void;
  toggleFavorite: (resortId: string) => Promise<void>;
  resetFavoritesFilter: () => void;
  isFavorite: (resortId: string) => boolean;
  isLoading: boolean;
  error: string | null;
}

export function useFavorites(): UseFavoritesReturn {
  const [favoriteResorts, setFavoriteResorts] = useState<Set<string>>(new Set());
  const [favoritesActive, setFavoritesActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user's favorite resorts
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      console.log('No user logged in');
      setIsLoading(false);
      return;
    }

    const favoritesRef = collection(db, 'users', user.uid, 'favorites');
    
    const unsubscribe = onSnapshot(
      favoritesRef, 
      (snapshot) => {
        const favorites = new Set<string>();
        snapshot.docs.forEach((doc) => {
          favorites.add(doc.id);
        });
        setFavoriteResorts(favorites);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error loading favorites:', err);
        setError('Failed to load favorites');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Function to toggle favorite status
  const toggleFavorite = async (resortId: string): Promise<void> => {
    const user = auth.currentUser;
    if (!user) {
      setError('User not authenticated');
      return;
    }

    const favoriteDocRef = doc(db, 'users', user.uid, 'favorites', resortId);
    
    try {
      if (favoriteResorts.has(resortId)) {
        await deleteDoc(favoriteDocRef);
      } else {
        await setDoc(favoriteDocRef, {
          resortId,
          addedAt: new Date().toISOString()
        });
      }
      setError(null);
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError('Failed to update favorite');
    }
  };

  // Reset favorites filter
  const resetFavoritesFilter = (): void => {
    setFavoritesActive(false);
  };

  // Check if a resort is favorited
  const isFavorite = (resortId: string): boolean => {
    return favoriteResorts.has(resortId);
  };

  return {
    favoriteResorts,
    favoritesActive,
    setFavoritesActive,
    toggleFavorite,
    resetFavoritesFilter,
    isFavorite,
    isLoading,
    error
  };
}