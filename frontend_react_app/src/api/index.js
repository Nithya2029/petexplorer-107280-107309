/**
 * PUBLIC_INTERFACE
 * API utility entry point for: pet data, pet image APIs, and geolocation APIs.
 *
 * Re-exports or documents utilities for:
 *   - fetchDogImage, fetchCatImage (dynamic animal images)
 *   - autocompleteCity, geocodeCity (location/geocoding/autocomplete)
 *   - fetchAllPets, fetchPetById (pet data, local only)
 */

// Pet image APIs
export { fetchDogImage, fetchCatImage } from '../utils/imageApi';
// Location autocomplete/geocoding APIs
export { autocompleteCity, geocodeCity } from '../utils/locationApi';
// Pet data APIs
export { fetchAllPets, fetchPetById } from './petsApi';

// (legacy placeholder kept for backward compatibility; to be removed)
export const fetchPets = async () => {
  // Placeholder function for fetching pets
  return [];
};
