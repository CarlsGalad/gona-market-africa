// utils/deliveryFeeCalculator.ts

import { getCoordinates, calculateDistance } from './coordinateUtils';

const BASE_FEE = 1000; // Base delivery fee in Naira
const WEIGHT_MULTIPLIER = 100; // Additional fee per kg
const DISTANCE_MULTIPLIER = 10; // Additional fee per km for long distances

interface LGATiers {
  TIER_1: string[];
  TIER_2: string[];
  // Add more tiers as needed
}
const LGA_TIERS: LGATiers = {
  TIER_1: [
    // Lagos State
    'Ikeja', 'Eti-Osa', 'Lagos Island', 'Surulere', 'Mushin', 
    'Ajeromi-Ifelodun', 'Agege', 'Ifako-Ijaiye', 'Somolu', 'Amuwo-Odofin',

    // Abuja (FCT)
    'Abuja Municipal', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali', 'Abaji',

    // Rivers State
    'Port Harcourt', 'Obio-Akpor', 'Okrika', 'Ogu–Bolo', 'Eleme', 
    'Ikwerre', 'Emohua', 'Tai', 'Oyigbo', 'Okrika',
    
    // Others (e.g., tier 1 states like Delta, Akwa Ibom)
    'Warri South', 'Uyo', 'Calabar Municipal', 'Aba South', 'Owerri Municipal',
  ],
  TIER_2: [
    // Oyo State
    'Ibadan North', 'Ibadan South-East', 'Ibadan South-West', 'Ibadan North-West', 
    'Akinyele', 'Lagelu', 'Egbeda', 'Ona-Ara', 'Ibarapa Central',

    // Kano State
    'Kano Municipal', 'Fagge', 'Gwale', 'Dala', 'Tarauni', 'Kumbotso', 'Nassarawa', 
    'Ungogo', 'Kumbotso', 'Kano Island',

    // Kaduna State
    'Kaduna North', 'Kaduna South', 'Chikun', 'Igabi', 'Zaria', 'Sabon Gari', 
    'Soba', 'Ikara', 'Kachia', 'Kagarko',

    // Others (e.g., Ogun, Anambra)
    'Abeokuta South', 'Ifo', 'Sango Ota', 'Awka South', 'Nnewi North', 
    'Ogbomoso North', 'Ogbomoso South', 'Oyo West', 'Atiba', 'Ijebu Ode',
  ],
};


interface StateTiers {
  TIER_1: string[];
  TIER_2: string[];
  // Add more tiers as needed
}


const STATE_TIERS: StateTiers = {
  TIER_1: [
    'Lagos',    // Economic hub, largest city
    'Abuja',    // Federal Capital Territory
    'Rivers',   // Oil-rich state, Port Harcourt as major city
    'Delta',    // Oil-rich, Warri as major city
    'Akwa Ibom',// Oil-rich, Uyo as major city
    'Edo',      // Benin City as major economic center
    'Anambra',  // Commercial activities in Onitsha and Nnewi
  ],
  TIER_2: [
    'Oyo',      // Ibadan, largest city in West Africa
    'Kano',     // Largest city in northern Nigeria
    'Kaduna',   // Industrial and commercial hub in the north
    'Ogun',     // Proximity to Lagos, industrial activities
    'Enugu',    // Coal city, economic activities in the southeast
    'Cross River', // Calabar as a major tourist destination
    'Benue',    // Agricultural hub
    'Niger',    // Large land area, agricultural potential
    'Kwara',    // Ilorin as a major city
  ],
};


interface Item {
  location: string;
  state: string;
  weight: number;
}

interface UserLocation {
  location: string;
  state: string;
}

export async function calculateDeliveryFee(item: Item, quantity: number, userLocation: UserLocation): Promise<number>{
  let fee = BASE_FEE;

  // LGA-based fee
  if (LGA_TIERS.TIER_1.includes(item.location)) {
    fee += 300;
  } else if (LGA_TIERS.TIER_2.includes(item.location)) {
    fee += 700;
  } else {
    fee += 1000; // Default for other LGAs
  }

  // State-based fee
  if (STATE_TIERS.TIER_1.includes(item.state)) {
    fee += 1000;
  } else if (STATE_TIERS.TIER_2.includes(item.state)) {
    fee += 1400;
  } else {
    fee += 1800; // Default for other states
  }

  // Weight-based fee
  fee += item.weight * quantity * WEIGHT_MULTIPLIER;
 // Distance-based fee
  if (item.state !== userLocation.state) {
    try {
      const itemCoords = await getCoordinates(item.location, item.state);
      const userCoords = await getCoordinates(userLocation.location, userLocation.state);
      if (itemCoords && userCoords) {
        const distance = calculateDistance(itemCoords, userCoords);
        fee += distance * DISTANCE_MULTIPLIER;
      } else {
        console.warn('Could not calculate distance-based fee due to missing coordinates');
      }
    } catch (error) {
      console.error('Error calculating distance-based fee:', error);
    }
  }

  return Math.round(fee);
}