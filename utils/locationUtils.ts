// utils/locationUtils.ts
import axios from 'axios';

const GEOCODING_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function reverseGeocode(latitude: number, longitude: number) {
  try {
    const response = await axios.get(GEOCODING_API_URL, {
      params: {
        latlng: `${latitude},${longitude}`,
        key: API_KEY,
      },
    });

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const addressComponents = response.data.results[0].address_components;
      let location = '';
      let state = '';

      addressComponents.forEach((component: any) => {
        if (component.types.includes('locality')) {
          location = component.long_name;
        }
        if (component.types.includes('administrative_area_level_1')) {
          state = component.long_name;
        }
      });

      return { location, state };
    } else {
      throw new Error(`Geocoding API error: ${response.data.status}`);
    }
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    throw error;
  }
}