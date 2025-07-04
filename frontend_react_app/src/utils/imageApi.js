//
// imageApi.js - Utilities for fetching animal images from public APIs
//

// PUBLIC_INTERFACE
/**
 * Fetches a random dog image or a dog image by breed from the dog.ceo API.
 * @param {string} [breed] - Optional breed name (use dash-for-space, e.g. 'golden-retriever')
 * @returns {Promise<string>} URL of a dog image or null
 */
export async function fetchDogImage(breed) {
  try {
    let url;
    if (breed) {
      url = `https://dog.ceo/api/breed/${breed}/images/random`;
    } else {
      url = 'https://dog.ceo/api/breeds/image/random';
    }
    const resp = await fetch(url);
    const data = await resp.json();
    if (data.status === 'success') {
      return data.message;
    }
    return null;
  } catch (err) {
    console.error('Error fetching dog image:', err);
    return null;
  }
}

// PUBLIC_INTERFACE
/**
 * Fetches a random cat image, or a cat image by breed id from TheCatAPI.
 * @param {string} [breedId] - Optional TheCatAPI breed id
 * @returns {Promise<string>} URL of a cat image or null
 */
export async function fetchCatImage(breedId) {
  try {
    let url = 'https://api.thecatapi.com/v1/images/search';
    if (breedId) {
      url += `?breed_ids=${breedId}`;
    }
    const resp = await fetch(url);
    const data = await resp.json();
    if (Array.isArray(data) && data.length > 0 && data[0].url) {
      return data[0].url;
    }
    return null;
  } catch (err) {
    console.error('Error fetching cat image:', err);
    return null;
  }
}
