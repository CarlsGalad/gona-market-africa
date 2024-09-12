// hooks/useUserLocation.ts
import { useState, useEffect } from 'react';
import { reverseGeocode } from '../utils/locationUtils';

export const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState<{ location: string; state: string }>({ location: '', state: '' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserLocation = async () => {
      const cachedLocation = localStorage.getItem('userLocation');
      
      if (cachedLocation) {
        console.log('Using cached location:', JSON.parse(cachedLocation));
        setUserLocation(JSON.parse(cachedLocation));
      } else if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });

          const { latitude, longitude } = position.coords;
          const locationData = await reverseGeocode(latitude, longitude);
          
          console.log('Fetched location:', locationData);
          setUserLocation(locationData);
          localStorage.setItem('userLocation', JSON.stringify(locationData));
        } catch (error) {
          console.error('Error fetching user location:', error);
          setError('Unable to fetch user location. Please enter your location manually.');
        }
      } else {
        setError('Geolocation is not supported by this browser. Please enter your location manually.');
      }
    };

    fetchUserLocation();
  }, []);

  return { userLocation, error };
};