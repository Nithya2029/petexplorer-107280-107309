/**
 * PUBLIC_INTERFACE
 * API utility entry point for: pet data, pet image APIs, and geolocation APIs.
 *
 * Exports:
 *   - fetchDogImage, fetchCatImage (dynamic animal images)
 *   - autocompleteCity, geocodeCity (location/geocoding/autocomplete)
 *   - fetchAllPetsWithEnrichment, fetchPetByIdWithEnrichment (pet data, live+mock fallback)
 */

// Pet data APIs (live + mock fallback)
export { fetchAllPetsWithEnrichment, fetchPetByIdWithEnrichment } from './rescueGroupsApi';

// Pet image APIs
export { fetchDogImage, fetchCatImage } from '../utils/imageApi';

// Location autocomplete/geocoding APIs
export { autocompleteCity, geocodeCity } from '../utils/locationApi';

// (legacy placeholder kept for backward compatibility; to be removed)
export const fetchPets = async () => [];
