import { ref, onValue, DataSnapshot } from 'firebase/database';
import { db } from '../lib/firebase';
import type { Resort } from '../types/resort';

export const getResorts = (callback: (resorts: Resort[]) => void) => {
  const resortsRef = ref(db, '/');
  
  return onValue(resortsRef, (snapshot: DataSnapshot) => {
    const data = snapshot.val();
    if (data) {
      const resortsArray = Object.entries(data).map(([id, resort]) => ({
        id,
        ...(resort as Omit<Resort, 'id'>)
      }));
      callback(resortsArray);
    } else {
      callback([]);
    }
  });
};