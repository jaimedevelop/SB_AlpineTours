// utils/favoritesFilter.ts
import { Resort } from '../../types/types';

export interface FavoritesFilterParams {
  resorts: Resort[];
  favoritesActive: boolean;
  favoriteResorts: Set<string>;
}

/**
 * Applies favorites filter to a list of resorts
 * @param resorts - Array of all resorts
 * @param favoritesActive - Whether favorites filter is active
 * @param favoriteResorts - Set of favorited resort IDs
 * @returns Filtered array of resorts
 */
export function applyFavoritesFilter({
  resorts,
  favoritesActive,
  favoriteResorts
}: FavoritesFilterParams): Resort[] {
  if (!favoritesActive) {
    return resorts;
  }

  return resorts.filter(resort => favoriteResorts.has(resort.name));
}

/**
 * Checks if the favorites filter is currently active
 * @param favoritesActive - Boolean indicating if favorites filter is on
 * @returns Boolean indicating if filter is active
 */
export function isFavoritesFilterActive(favoritesActive: boolean): boolean {
  return favoritesActive;
}

/**
 * Gets the count of favorited resorts from a list
 * @param resorts - Array of resorts to check
 * @param favoriteResorts - Set of favorited resort IDs
 * @returns Number of favorited resorts in the array
 */
export function getFavoritesCount(resorts: Resort[], favoriteResorts: Set<string>): number {
  return resorts.filter(resort => favoriteResorts.has(resort.id)).length;
}