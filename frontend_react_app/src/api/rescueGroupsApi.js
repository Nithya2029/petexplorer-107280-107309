//
// rescueGroupsApi.js - Pet data logic: use enriched mockPets.json (with images) as the main dataset, with optional live API toggle.
//

import { fetchDogImage, fetchCatImage } from '../utils/imageApi';

// PUBLIC_INTERFACE
/**
 * LOCAL STORAGE + ENRICHED DATASET CONFIGURATION
 */
// Use this cache key for the enriched mock pets set
const PET_CACHE_KEY = 'enrichedMockPetsCache';
const CACHE_MAX_AGE_MS = 15 * 60 * 1000;

// Toggle for live API mode (default: false = use only enriched mock dataset)
let useLiveApiDefault = false;
export function setUseLiveApi(flag) { useLiveApiDefault = !!flag; }
export function getUseLiveApi() { return useLiveApiDefault; }

/**
 * Read pets from cache, respect expiry.
 */
function getCachedPets() {
  try {
    const raw = localStorage.getItem(PET_CACHE_KEY);
    if (!raw) return null;
    const { ts, pets } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_MAX_AGE_MS) return null;
    return pets;
  } catch (e) {
    return null;
  }
}

function setCachedPets(pets) {
  localStorage.setItem(PET_CACHE_KEY, JSON.stringify({ ts: Date.now(), pets }));
}

/**
 * Helper: Enrich a single pet with a fallback image (if missing) and stub a contact.
 * For demo, this NEVER errors and always ensures imageURL + contact present.
 */
async function enrichPet(pet) {
  const type = (pet.species || pet.type || '').toLowerCase();
  let imageURL = pet.imageURL;
  // If missing image, fetch as appropriate
  if (type === 'dog' || pet.breed?.toLowerCase().includes('dog')) {
    if (!imageURL) imageURL = await fetchDogImage();
  }
  if (type === 'cat' || pet.breed?.toLowerCase().includes('cat')) {
    if (!imageURL) imageURL = await fetchCatImage();
  }
  if (!imageURL) {
    imageURL = 'https://place-puppy.com/320x210';
  }
  // Stub contact for demo UX
  let contact = pet.contact || {
    name: "Adoption Center",
    email: "adopt@example.com",
    phone: "N/A",
    location: pet.location || "N/A",
    photo: "",
  };
  return { ...pet, imageURL, contact };
}

/**
 * PUBLIC_INTERFACE
 * Loads mockPets.json and fully enriches with image/contact if missing.
 * Caches the final results for fast demo UX. Used as the main listing/detail dataset.
 */
export async function loadAndEnrichMockPets() {
  const cached = getCachedPets();
  if (cached) return cached;
  try {
    const resp = await fetch('./mockPets.json');
    let rawPets = await resp.json();
    const promises = rawPets.map(async pet => {
      // Enrich if missing image or contact
      if (!pet.imageURL || !pet.contact) {
        return await enrichPet(pet);
      }
      return pet;
    });
    const completed = await Promise.all(promises);
    setCachedPets(completed);
    return completed;
  } catch (err) {
    console.error('[mockPets] Error loading/enriching mock pets:', err);
    return [];
  }
}

/**
 * PUBLIC_INTERFACE
 * Main fetch function for all listing/filter/detail pages:
 * By default, returns the enriched mock pets (with images) dataset.
 * Set useLiveApiDefault=true and call again (or toggle via setUseLiveApi) to enable live API mode.
 */
export async function fetchAllPetsWithEnrichment() {
  if (!useLiveApiDefault) {
    return await loadAndEnrichMockPets();
  }
  // fallback: Try API live, but always fallback to mock if it fails
  const cached = getCachedPets();
  if (cached) return cached;
  try {
    const url = 'https://api.rescuegroups.org/v5/public/animals/search/available/?limit=28&fields[animals]=id,name,species,breedPrimary,ageGroup,description,city,state';
    const resp = await fetch(url, { headers: { 'accept': 'application/json' } });
    const data = await resp.json();
    if (!data || !Array.isArray(data.data)) throw new Error('API missing data array');
    const pets = data.data.map(p => {
      const attr = p.attributes || {};
      return {
        id: p.id ? String(p.id) : undefined,
        name: attr.name || 'Unnamed',
        breed: attr.breedPrimary || '',
        age: attr.ageGroup === 'Baby' ? 3 : attr.ageGroup === 'Young' ? 18 : 48,
        ageGroup: attr.ageGroup || '',
        location: attr.city && attr.state ? `${attr.city}, ${attr.state}` : (attr.city || ''),
        description: attr.description || '',
        type: attr.species ? attr.species.toLowerCase() : '',
        imageURL: '',
        contact: undefined,
      };
    }).filter(p => ['dog', 'cat'].includes(p.type));
    const promises = pets.map(enrichPet);
    const enriched = await Promise.all(promises);
    setCachedPets(enriched);
    return enriched;
  } catch (e) {
    return await loadAndEnrichMockPets();
  }
}

/**
 * PUBLIC_INTERFACE
 * Gets a single pet by id (from the main dataset).
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function fetchPetByIdWithEnrichment(id) {
  const pets = await fetchAllPetsWithEnrichment();
  return (pets || []).find(p => p.id === id) || null;
}
