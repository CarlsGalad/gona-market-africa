// providers/FarmProvider.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Firestore, collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/lib/firebaseConfig';// Import your Firestore configuration
import { Farm } from '@/models/FarmModel';

// Create a context for the farm provider
const FarmContext = createContext<FarmProviderContext | undefined>(undefined);

interface FarmProviderContext {
  farms: Farm[];
  loading: boolean;
  error: string | null;
}

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'farms'));
        const fetchedFarms = querySnapshot.docs.map((doc) => Farm.fromFirestore(doc));
        setFarms(fetchedFarms);
      } catch (err) {
        setError('Error fetching farms: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, []);

  return (
    <FarmContext.Provider value={{ farms, loading, error }}>
      {children}
    </FarmContext.Provider>
  );
};

// Custom hook to use the FarmProvider context
export const useFarmProvider = () => {
  const context = useContext(FarmContext);
  if (context === undefined) {
    throw new Error('useFarmProvider must be used within a FarmProvider');
  }
  return context;
};
