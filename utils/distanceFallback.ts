// utils/distanceFallback.ts

interface DistanceMatrix {
  [key: string]: {
    [key: string]: number;
  };
}

// Predefined distance matrix (in kilometers) between major cities or states
const DISTANCE_MATRIX: DistanceMatrix = {
  Lagos: {
    Abuja: 750,
    Kano: 835,
    'Port Harcourt': 600,
    Ibadan: 120,
    Kaduna: 760,
  },
  Abuja: {
    Lagos: 750,
    Kano: 425,
    'Port Harcourt': 630,
    Ibadan: 670,
    Kaduna: 165,
  },
  Kano: {
    Lagos: 835,
    Abuja: 425,
    'Port Harcourt': 880,
    Ibadan: 810,
    Kaduna: 215,
  },
  'Port Harcourt': {
    Lagos: 600,
    Abuja: 630,
    Kano: 880,
    Ibadan: 500,
    Kaduna: 650,
  },
  Ibadan: {
    Lagos: 120,
    Abuja: 670,
    Kano: 810,
    'Port Harcourt': 500,
    Kaduna: 780,
  },
  Kaduna: {
    Lagos: 760,
    Abuja: 165,
    Kano: 215,
    'Port Harcourt': 650,
    Ibadan: 780,
  },
 
};

/**
 * Fallback method to calculate the distance between two locations using a predefined distance matrix
 * @param {string} location1 - The first location (city or state)
 * @param {string} location2 - The second location (city or state)
 * @returns {number | null} The distance in kilometers or null if not found
 */
export function fallbackCalculateDistance(location1: string, location2: string): number | null {
  if (location1 in DISTANCE_MATRIX && location2 in DISTANCE_MATRIX[location1]) {
    return DISTANCE_MATRIX[location1][location2];
  } else if (location2 in DISTANCE_MATRIX && location1 in DISTANCE_MATRIX[location2]) {
    return DISTANCE_MATRIX[location2][location1];
  } else {
    console.warn(`Distance not found for locations: ${location1}, ${location2}`);
    return null;
  }
}
