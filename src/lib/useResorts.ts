import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../config/firebase';
import { Resort } from '../types/types';

export function useResorts() {
  const [resorts, setResorts] = useState<Resort[]>([]);

  useEffect(() => {
    console.log('Connecting to Firebase...');
    const resortsRef = ref(db, 'resorts');
    
    const unsubscribe = onValue(resortsRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Firebase data:', data);
      
      if (data) {
        const resortsArray = Object.entries(data).map(([id, resort]) => ({
          id,
          ...(resort as Omit<Resort, 'id'>)
        }));
        console.log('Processed resorts:', resortsArray);
        setResorts(resortsArray);
      } else {
        console.log('No data received from Firebase');
      }
    }, (error) => {
      console.error('Firebase error:', error);
    });

    return () => unsubscribe();
  }, []);

  return resorts;
}