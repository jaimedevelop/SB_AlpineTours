import { useEffect, useState } from 'react';
import { ResortCard } from './resort-card';
import { database } from '../firebase/config';
import { ref, onValue } from 'firebase/database';
import type { Resort } from '../types/types';

export function ResortGrid() {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResorts = () => {
      try {
        const resortsRef = ref(database, 'resorts');
        
        const unsubscribe = onValue(resortsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            // Transform the data to include the Firebase key as id
            const resortsArray = Object.entries(data).map(([key, value]) => ({
              id: key,
              ...(value as Omit<Resort, 'id'>)
            }));
            setResorts(resortsArray);
          } else {
            setResorts([]);
          }
          setLoading(false);
        }, (error) => {
          console.error('Error fetching resorts:', error);
          setError('Error loading resorts');
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (err) {
        console.error('Error setting up resorts listener:', err);
        setError('Error loading resorts');
        setLoading(false);
        return () => {}; // Return empty cleanup function in case of error
      }
    };

    return fetchResorts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={`skeleton-${i}`} className="h-64 bg-white/10 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-200">{error}</p>
      </div>
    );
  }

  if (resorts.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-white/60">No resorts found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resorts.map((resort) => (
        <ResortCard key={resort.id} resort={resort} />
      ))}
    </div>
  );
}