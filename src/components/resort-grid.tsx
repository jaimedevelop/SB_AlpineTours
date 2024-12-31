import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import { ResortCard } from "./resort-card";
import type { Resort } from "@/types/resort";

export function ResortGrid() {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Connecting to Firebase...");
    const resortsRef = ref(db, "/");
    
    const unsubscribe = onValue(resortsRef, (snapshot) => {
      console.log("Received Firebase data:", snapshot.val());
      const data = snapshot.val();
      if (data) {
        // Convert object to array and add id
        const resortsArray = Object.entries(data).map(([id, resort]) => ({
          id,
          ...(resort as Omit<Resort, "id">)
        }));
        console.log("Processed resorts:", resortsArray);
        setResorts(resortsArray);
      } else {
        console.log("No data received from Firebase");
        setResorts([]);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching resorts:", error);
      setError(error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">Error loading resorts: {error}</p>
      </div>
    );
  }

  if (resorts.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No resorts found</p>
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