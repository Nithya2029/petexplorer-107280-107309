/**
 * Functions for accessing pet data (mocked for local development).
 */

const petsDataUrl = './mockPets.json';

/**
 * PUBLIC_INTERFACE
 * Fetch all pets from mock data.
 * @returns {Promise<Array>} Array of pet objects.
 */
export async function fetchAllPets() {
  try {
    const response = await fetch(petsDataUrl);
    if (!response.ok) throw new Error('Failed to fetch pet data');
    const pets = await response.json();
    return pets;
  } catch (error) {
    // Could extend with fallback data or error reporting as needed
    console.error('Error fetching pets:', error);
    return [];
  }
}

/**
 * PUBLIC_INTERFACE
 * Fetch a single pet by id.
 * @param {string} id - Pet ID.
 * @returns {Promise<Object|null>} Pet object or null if not found.
 */
export async function fetchPetById(id) {
  const pets = await fetchAllPets();
  return pets.find(pet => pet.id === id) || null;
}
