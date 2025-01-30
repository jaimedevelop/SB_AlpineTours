// src/firebase/auth.js
// This file handles all authentication-related operations
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    onAuthStateChanged
  } from 'firebase/auth';
  import { auth } from './config';
  import { createUserProfile } from './database';
  
  export const signUp = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      
      // Create user profile in Realtime Database
      await createUserProfile(userCredential.user.uid, {
        email,
        displayName,
        createdAt: new Date().toISOString()
      });
      
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };
  
  export const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };
  
  export const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };
  
  export const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };
  
  export const useAuth = (callback) => {
    return onAuthStateChanged(auth, callback);
  };
  