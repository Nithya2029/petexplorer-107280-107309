/**
 * PUBLIC_INTERFACE
 * API utility entry point for pet data and UX logic.
 *
 * Main data flow:
 *   - By default, all UI (listing/detail/filters) uses only local MOCK dataset (mockPets.json enriched).
 *   - fetchAllPetsWithEnrichment and fetchPetByIdWithEnrichment always return pets with imageURL populated.
 *   - To enable live API for demo, call toggleLiveData(true) before making fetches (not exposed by UI yet).
 *   - All other helper APIs still exported as before (location, images).
 */

// Pet data APIs (mock+image main source; live optional)
export {
  fetchAllPetsWithEnrichment,
  fetchPetByIdWithEnrichment,
  setUseLiveApi as toggleLiveData, // Public alias for future "live" toggle
  getUseLiveApi as isLiveDataActive,
} from './rescueGroupsApi';

// Pet image APIs
export { fetchDogImage, fetchCatImage } from '../utils/imageApi';

// Location autocomplete/geocoding APIs
export { autocompleteCity, geocodeCity } from '../utils/locationApi';

// (legacy, deprecated; always returns empty)
export const fetchPets = async () => [];
