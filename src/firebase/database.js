// src/firebase/database.js
// This file handles all Realtime Database operations
import { ref, set, get, update, remove, query, orderByChild } from 'firebase/database';
import { database } from './config';

export { database } from './config';
// User Profile Operations
export const createUserProfile = async (userId, userData) => {
  try {
    await set(ref(database, `users/${userId}`), userData);
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const snapshot = await get(ref(database, `users/${userId}`));
    return snapshot.val();
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    await update(ref(database, `users/${userId}`), updates);
  } catch (error) {
    throw error;
  }
};

// Data Operations (example for a 'posts' collection)
export const createPost = async (userId, postData) => {
  try {
    const newPostRef = ref(database, `posts/${userId}/${Date.now()}`);
    await set(newPostRef, {
      ...postData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    throw error;
  }
};

export const getUserPosts = async (userId) => {
  try {
    const postsRef = ref(database, `posts/${userId}`);
    const postsQuery = query(postsRef, orderByChild('createdAt'));
    const snapshot = await get(postsQuery);
    return snapshot.val();
  } catch (error) {
    throw error;
  }
};

// Add these functions to your src/firebase/database.js file

import { 
  doc, 
  setDoc, 
  deleteDoc, 
  getDoc, 
  collection, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { firestore } from './config'; // Add this import

// Favorites Operations
export const addToFavorites = async (userId, resortName) => {
  try {
    const favoriteRef = doc(firestore, `users/${userId}/favorites`, resortName);
    await setDoc(favoriteRef, {
      resortName: resortName,
      favoritedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

export const removeFromFavorites = async (userId, resortName) => {
  try {
    const favoriteRef = doc(firestore, `users/${userId}/favorites`, resortName);
    await deleteDoc(favoriteRef);
    return true;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

export const checkIsFavorited = async (userId, resortName) => {
  try {
    const favoriteRef = doc(firestore, `users/${userId}/favorites`, resortName);
    const docSnap = await getDoc(favoriteRef);
    return docSnap.exists();
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false; // Default to not favorited if error
  }
};

export const getUserFavorites = async (userId) => {
  try {
    const favoritesRef = collection(firestore, `users/${userId}/favorites`);
    const querySnapshot = await getDocs(favoritesRef);
    const favorites = [];
    querySnapshot.forEach((doc) => {
      favorites.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return favorites;
  } catch (error) {
    console.error('Error getting user favorites:', error);
    throw error;
  }
};

// View History Operations (bonus for later)
export const addToViewHistory = async (userId, resortName) => {
  try {
    const viewRef = doc(firestore, `users/${userId}/viewHistory`, resortName);
    const viewDoc = await getDoc(viewRef);
    
    if (viewDoc.exists()) {
      // Update existing view
      await setDoc(viewRef, {
        resortName: resortName,
        lastViewed: serverTimestamp(),
        viewCount: (viewDoc.data().viewCount || 0) + 1
      });
    } else {
      // Create new view record
      await setDoc(viewRef, {
        resortName: resortName,
        lastViewed: serverTimestamp(),
        viewCount: 1
      });
    }
    return true;
  } catch (error) {
    console.error('Error adding to view history:', error);
    throw error;
  }
};
