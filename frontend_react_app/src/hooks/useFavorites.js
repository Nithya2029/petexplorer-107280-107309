import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

/**
 * PUBLIC_INTERFACE
 * useFavorites - custom hook to manage pet favorites (localStorage persistence).
 * Provides [favoriteIds, toggleFavorite, isFavorited, clearFavorites]
 * @returns {[favoriteIds, toggleFavorite, isFavorited, clearFavorites]}
 */
export function useFavorites() {
  // Favorite IDs (array of pet.id)
  const [favoriteIds, setFavoriteIds] = useLocalStorage('favoritePetIds', []);

  // PUBLIC_INTERFACE
  const isFavorited = useCallback(
    (petId) => favoriteIds.includes(petId),
    [favoriteIds]
  );

  // PUBLIC_INTERFACE
  const toggleFavorite = useCallback(
    (petId) => {
      setFavoriteIds(prev => {
        if (prev.includes(petId)) {
          return prev.filter(id => id !== petId);
        } else {
          return [...prev, petId];
        }
      });
    },
    [setFavoriteIds]
  );

  // PUBLIC_INTERFACE
  const clearFavorites = useCallback(
    () => setFavoriteIds([]),
    [setFavoriteIds]
  );

  return [favoriteIds, toggleFavorite, isFavorited, clearFavorites];
}
