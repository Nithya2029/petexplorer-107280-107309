//
// rescueGroupsApi.js - Unified fetching of pet data from rescuegroups.org with enrichment and fallback to mock
//

import { fetchDogImage, fetchCatImage } from '../utils/imageApi';

// PUBLIC_INTERFACE
/**
 * Cache helper: get/set pets in localStorage (expire in 15 minutes)
 */
const PET_CACHE_KEY = 'rescueGroupsPetCache';
const CACHE_MAX_AGE_MS = 15 * 60 * 1000;

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
 * Enriches a single pet record with image and contact.
 */
async function enrichPet(pet) {
  const type = (pet.species || pet.type || '').toLowerCase();
  let imageURL = pet.imageURL;
  // Dog image
  if (type === 'dog' || pet.breed?.toLowerCase().includes('dog')) {
    if (!imageURL) {
      imageURL = await fetchDogImage(); // default to random if breed conversion fails
    }
  }
  // Cat image
  if (type === 'cat' || pet.breed?.toLowerCase().includes('cat')) {
    if (!imageURL) {
      imageURL = await fetchCatImage();
    }
  }
  // Fallback placeholder
  if (!imageURL) {
    imageURL = 'https://place-puppy.com/320x210'; // Public placeholder for any missing (cute)
  }
  // Contact - random user
  let contact = pet.contact;
  if (!contact) {
    try {
      const resp = await fetch('https://randomuser.me/api/?nat=us');
      const d = await resp.json();
      const user = d.results[0];
      contact = {
        name: `${user.name.first} ${user.name.last}`,
        email: user.email,
        phone: user.phone,
        location: user.location.city + ', ' + user.location.state,
        photo: user.picture.thumbnail,
      };
    } catch { /* fallback to none */ }
  }
  return {
    ...pet,
    imageURL,
    contact,
  };
}

// PUBLIC_INTERFACE
/**
 * Fetches pets from https://api.rescuegroups.org (sample: v5/public/animals/search/available/). 
 * Maps/selects just dogs+cats, normalizes fields, and falls back to mock data on error.
 * All records enriched with image and contact info, always.
 * @returns {Promise<Array>} Array of normalized pet objects.
 */
export async function fetchAllPetsWithEnrichment() {
  // Try cache
  const cached = getCachedPets();
  if (cached) return cached;

  // Attempt live fetch from RescueGroups API (v5 public endpoint, 25-30 records)
  try {
    // RescueGroups API endpoint sample (allows unauthenticated GET): 
    // We'll use a public demo endpoint for this mock-up
    const url = 'https://api.rescuegroups.org/v5/public/animals/search/available/?limit=28&fields[animals]=id,name,species,breedPrimary,ageGroup,description,city,state';
    const resp = await fetch(url, { headers: { 'accept': 'application/json' } });
    const data = await resp.json();
    if (!data || !Array.isArray(data.data)) throw new Error('API missing data array');
    // Map to normalized pet object for app
    const pets = data.data.map(p => {
      const attr = p.attributes || {};
      return {
        id: p.id ? String(p.id) : undefined,
        name: attr.name || 'Unnamed',
        breed: attr.breedPrimary || '',
        age: attr.ageGroup === 'Baby' ? 3 : attr.ageGroup === 'Young' ? 18 : 48, // crude, fallback
        ageGroup: attr.ageGroup || '',
        location: attr.city && attr.state ? `${attr.city}, ${attr.state}` : (attr.city || ''),
        description: attr.description || '',
        type: attr.species ? attr.species.toLowerCase() : '',
        imageURL: '', // enrich later
        contact: undefined, // enrich later
      };
    }).filter(p => ['dog', 'cat'].includes(p.type));
    // Enrich all with image and contact (parallel)
    const promises = pets.map(enrichPet);
    const enriched = await Promise.all(promises);
    setCachedPets(enriched);
    return enriched;
  } catch (e) {
    // Fallback to mock data on error
    try {
      const resp = await fetch('./mockPets.json');
      const fallbackPets = await resp.json();
      // Enrich mock data for demo, if any missing info (e.g. contact)
      const promises = fallbackPets.map(enrichPet);
      const enriched = await Promise.all(promises);
      setCachedPets(enriched);
      return enriched;
    } catch (error) {
      // On complete failure, return completely empty array
      return [];
    }
  }
}

/**
 * PUBLIC_INTERFACE
 * Fetch a single pet by id (searches the enriched array).
 * @param {string} id
 * @returns {Promise<Object|null>} pet record or null if not found
 */
export async function fetchPetByIdWithEnrichment(id) {
  const pets = await fetchAllPetsWithEnrichment();
  return (pets || []).find(p => p.id === id) || null;
}
