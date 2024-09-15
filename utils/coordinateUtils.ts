// utils/coordinateUtils.ts
import axios from 'axios';
import { fallbackCalculateDistance } from './distanceFallback';

interface Coordinate {
  lat: number;
  lng: number;
}

type CoordinatesDB = {
  [key: string]: Coordinate;
};

// coordinates database
const COORDINATES_DB: CoordinatesDB = {
  'Lagos': { lat: 6.5244, lng: 3.3792 },
  'Abuja': { lat: 9.0765, lng: 7.3986 },
  'Kano': { lat: 12.0022, lng: 8.5920 },
  'Port Harcourt': { lat: 4.8156, lng: 7.0498 },
  'Ibadan': { lat: 7.3775, lng: 3.9470 },
  'Kaduna': { lat: 10.5264, lng: 7.4383 },
  'Benin City': { lat: 6.3382, lng: 5.6258 },
  'Enugu': { lat: 6.5249, lng: 7.5183 },
  'Jos': { lat: 9.8965, lng: 8.8583 },
  'Ilorin': { lat: 8.4966, lng: 4.5428 },
  'Abeokuta': { lat: 7.1475, lng: 3.3619 },
  'Maiduguri': { lat: 11.8333, lng: 13.1500 },
  'Owerri': { lat: 5.4836, lng: 7.0333 },
  'Warri': { lat: 5.5174, lng: 5.7506 },
  'Sokoto': { lat: 13.0059, lng: 5.2476 },
  'Uyo': { lat: 5.0408, lng: 7.9190 },
  'Akure': { lat: 7.2508, lng: 5.2103 },
  'Yola': { lat: 9.2035, lng: 12.4954 },
  'Bauchi': { lat: 10.3158, lng: 9.8442 },
  'Ado Ekiti': { lat: 7.6278, lng: 5.2209 },
  'Minna': { lat: 9.6153, lng: 6.5473 },
  'Makurdi': { lat: 7.7337, lng: 8.5214 },
  'Calabar': { lat: 4.9757, lng: 8.3417 },
  'Oyo': { lat: 7.8432, lng: 3.9338 },
  'Gombe': { lat: 10.2897, lng: 11.1714 },
  'Osogbo': { lat: 7.7667, lng: 4.5667 },
  'Onitsha': { lat: 6.1476, lng: 6.7850 },
  'Zaria': { lat: 11.0733, lng: 7.6886 },
  'Umuahia': { lat: 5.5333, lng: 7.4833 },
  'Asaba': { lat: 6.2000, lng: 6.7333 },
  'Lokoja': { lat: 7.8000, lng: 6.7333 },
  'Katsina': { lat: 12.9908, lng: 7.6006 },
  'Jalingo': { lat: 8.8833, lng: 11.3667 },
  'Damaturu': { lat: 11.7461, lng: 11.9661 },
  'Gusau': { lat: 12.1621, lng: 6.6618 },
  'Birnin Kebbi': { lat: 12.4539, lng: 4.1979 },
  'Awka': { lat: 6.2109, lng: 7.0747 },
  'Eket': { lat: 4.6488, lng: 7.9279 },
  'Ife': { lat: 7.4875, lng: 4.5625 },
  'Bida': { lat: 9.0833, lng: 6.0167 },
  'Okene': { lat: 7.5500, lng: 6.2333 },
  'Iseyin': { lat: 7.9667, lng: 3.6000 },
  'Ilesa': { lat: 7.6167, lng: 4.7333 },
  'Aba': { lat: 5.1103, lng: 7.3494 },
  'Nsukka': { lat: 6.8578, lng: 7.3958 },
  'Sapele': { lat: 5.8904, lng: 5.6931 },
  'Owo': { lat: 7.1962, lng: 5.5862 },
  'Ijebu Ode': { lat: 6.8184, lng: 3.9176 },
  'Ikom': { lat: 5.9671, lng: 8.7186 },
  'Offa': { lat: 8.1491, lng: 4.7203 },
  'Oturkpo': { lat: 7.2000, lng: 8.1333 },
  'Gboko': { lat: 7.3167, lng: 9.0000 },
  'Bama': { lat: 11.5167, lng: 13.6833 },
};
const GEOCODING_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// In-memory cache
const cache: { [key: string]: Coordinate } = {};

/**
 * Convert a location (city or state) to coordinates
 * @param {string} location - The name of the city or state
 * @param {string} [state] - The name of the state (optional, for disambiguation)
 * @returns {Coordinate} An object with lat and lng properties
 */
export async function getCoordinates(location: string, state?: string): Promise<Coordinate | null> {
  const key = state ? `${location}, ${state}` : location;
  
  // Check if the coordinates are in the cache
  if (key in cache) {
    return cache[key];
  }
    
  if (key in COORDINATES_DB) {
    cache[key] = COORDINATES_DB[key];
    return COORDINATES_DB[key];
  }
  
  // If the location is not found in the COORDINATES_DB, use the Geocoding API
  try {
    const response = await axios.get(GEOCODING_API_URL, {
      params: {
        address: key,
        key: API_KEY,
      },
    });
      
    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry.location;
      const coordinates = { lat, lng };
      
      // Cache the result
      cache[key] = coordinates;
      
      return coordinates;
    } else {
      console.error('Geocoding API error:', response.data.status);
      return null;
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
}

/**
 * Calculate the distance between two locations by their names (city or state)
 * @param {string} location1 - The first location (city or state)
 * @param {string} location2 - The second location (city or state)
 * @returns {Promise<number | null>} The distance in kilometers, or null if not found
 */
export async function calculateDistanceByLocation(location1: string, location2: string): Promise<number | null> {
  const coord1 = await getCoordinates(location1);
  const coord2 = await getCoordinates(location2);

  if (coord1 && coord2) {
    return calculateDistance(coord1, coord2);
  } else {
    // Fallback to using predefined distances if coordinates are not available
    const fallbackDistance = fallbackCalculateDistance(location1, location2);
    return fallbackDistance;
  }
}

/**
 * Calculate the distance between two points using the Haversine formula
 * @param {Coordinate} coord1 - The first coordinate
 * @param {Coordinate} coord2 - The second coordinate
 * @returns {number} The distance in kilometers
 */
export function calculateDistance(coord1: Coordinate, coord2: Coordinate): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(coord2.lat - coord1.lat);
  const dLon = deg2rad(coord2.lng - coord1.lng);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(coord1.lat)) * Math.cos(deg2rad(coord2.lat)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  return distance;
}

/**
 * Convert degrees to radians
 * @param {number} deg - Degrees
 * @returns {number} Radians
 */
function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}