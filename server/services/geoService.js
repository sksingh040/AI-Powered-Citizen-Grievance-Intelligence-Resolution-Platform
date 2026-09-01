import { SENSITIVE_ZONES } from '../config/constants.js';

const WARDS_DATA = [
  { ward: 'Ward-12 (Connaught Place & Central)', zone: 'Central Zone', latMin: 28.62, latMax: 28.64, lngMin: 77.20, lngMax: 77.23 },
  { ward: 'Ward-08 (Karol Bagh & Pusa)', zone: 'North Central Zone', latMin: 28.64, latMax: 28.67, lngMin: 77.17, lngMax: 77.20 },
  { ward: 'Ward-15 (Lajpat Nagar & South)', zone: 'South Zone', latMin: 28.56, latMax: 28.59, lngMin: 77.23, lngMax: 77.26 },
  { ward: 'Ward-21 (Rohini Sector 7)', zone: 'North West Zone', latMin: 28.70, latMax: 28.73, lngMin: 77.10, lngMax: 77.14 }
];

const SENSITIVE_LANDMARKS = [
  { name: 'AIIMS Hospital', type: 'Hospital', lat: 28.5672, lng: 77.2100, radiusMeters: 400 },
  { name: 'Safdarjung Hospital', type: 'Hospital', lat: 28.5714, lng: 77.2078, radiusMeters: 350 },
  { name: 'Delhi Public School', type: 'School', lat: 28.5950, lng: 77.2280, radiusMeters: 300 },
  { name: 'Rajiv Chowk Metro Station', type: 'Metro Station', lat: 28.6328, lng: 77.2197, radiusMeters: 250 },
  { name: 'ISBT Anand Vihar Terminus', type: 'Bus Terminus', lat: 28.6469, lng: 77.3160, radiusMeters: 300 }
];

export const getWardAndZone = (lat, lng) => {
  for (const w of WARDS_DATA) {
    if (lat >= w.latMin && lat <= w.latMax && lng >= w.lngMin && lng <= w.lngMax) {
      return { ward: w.ward, zone: w.zone };
    }
  }
  return { ward: 'Ward-12 (Civic Core)', zone: 'North Central Zone' };
};

export const checkSensitiveZoneProximity = (lat, lng) => {
  for (const landmark of SENSITIVE_LANDMARKS) {
    const dLat = (landmark.lat - lat) * 111000;
    const dLng = (landmark.lng - lng) * 111000 * Math.cos((lat * Math.PI) / 180);
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);

    if (dist <= landmark.radiusMeters) {
      return {
        isSensitive: true,
        type: landmark.type,
        name: landmark.name,
        distanceMeters: Math.round(dist)
      };
    }
  }

  return {
    isSensitive: false,
    type: null,
    name: null,
    distanceMeters: null
  };
};
