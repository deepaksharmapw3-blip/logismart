import axios from 'axios';
import { Coordinates } from '../types';

// OSRM Public Demo Server
const BASE_URL = 'http://router.project-osrm.org/table/v1/driving';

export interface DistanceMatrixResult {
    distance: string;
    duration: string;
    distanceValue: number; // in meters
    durationValue: number; // in seconds
}

/**
 * Get accurate distance and time between coordinates using OSRM (Open Source Routing Machine)
 * This is a free, no-key alternative to Google Maps.
 */
export async function getDistanceMatrix(
    origin: Coordinates,
    destination: Coordinates
): Promise<DistanceMatrixResult | null> {
    try {
        // OSRM format: lng,lat;lng,lat
        const coordinates = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
        const url = `${BASE_URL}/${coordinates}?annotations=distance,duration`;

        const response = await axios.get(url);
        const data = response.data;

        if (data.code !== 'Ok') {
            console.error('❌ OSRM API error:', data.code);
            return null;
        }

        // OSRM returns matrices. [source_index][destination_index]
        // Indices: 0 is origin, 1 is destination
        const distanceInMeters = data.distances[0][1];
        const durationInSeconds = data.durations[0][1];

        if (distanceInMeters === undefined || durationInSeconds === undefined) {
            console.warn('⚠️ No route found between coordinates in OSRM');
            return null;
        }

        return {
            distance: formatDistance(distanceInMeters),
            duration: formatDuration(durationInSeconds),
            distanceValue: distanceInMeters,
            durationValue: durationInSeconds,
        };
    } catch (error) {
        console.error('❌ Error fetching distance from OSRM:', error);
        return null;
    }
}

/**
 * Format meters into a human-readable string (km)
 */
function formatDistance(meters: number): string {
    if (meters >= 1000) {
        return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${Math.round(meters)} m`;
}

/**
 * Format seconds into a human-readable string (h m)
 */
function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes} min`;
}

/**
 * Fallback geometric distance calculation (Haversine formula)
 * Returns approximate distance in kilometers
 */
export function calculateGeometricDistance(c1: Coordinates, c2: Coordinates): number {
    const R = 6371; // Earth's radius in km
    const dLat = (c2.lat - c1.lat) * (Math.PI / 180);
    const dLon = (c2.lng - c1.lng) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(c1.lat * (Math.PI / 180)) *
        Math.cos(c2.lat * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
