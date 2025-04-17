// src/services/resortService.ts
import { ref, get, query, limitToFirst } from 'firebase/database';
import { database } from '../firebase/config';
import { Resort } from '../types/types';
import { adaptResort, adaptResorts } from '../adapters/resortAdapter';

/**
 * Fetches a limited number of resorts from the Firebase database
 * @param limit Maximum number of resorts to fetch
 * @returns Promise that resolves to an array of Resort objects
 */
export const fetchResorts = async (limit: number = 10): Promise<Resort[]> => {
  try {
    // Create a query to get only the specified number of resorts
    const resortsQuery = query(
      ref(database, 'resorts'),
      limitToFirst(limit)
    );
    
    const snapshot = await get(resortsQuery);
    
    if (snapshot.exists()) {
      const resortsData = snapshot.val();
      // Use adapter to convert Firebase data to Resort objects
      return adaptResorts(resortsData);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching resorts:', error);
    throw error;
  }
};

/**
 * Fetches a specific resort by ID from the Firebase database
 * @param resortId The ID of the resort to fetch
 * @returns Promise that resolves to a Resort object or null if not found
 */
export const fetchResortById = async (resortId: string): Promise<Resort | null> => {
  try {
    const resortRef = ref(database, `resorts/${resortId}`);
    const snapshot = await get(resortRef);
    
    if (snapshot.exists()) {
      const resortData = snapshot.val();
      // Use adapter to convert Firebase data to Resort object
      return adaptResort(resortData, resortId);
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching resort with ID ${resortId}:`, error);
    throw error;
  }
};