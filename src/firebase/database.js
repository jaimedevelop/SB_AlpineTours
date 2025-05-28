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
