//
// locationApi.js - Utilities for location autocomplete and geocoding using Geoapify
//

const GEOAPIFY_API_KEY = "YOUR_GEOAPIFY_API_KEY"; // <-- Replace with real API key

// PUBLIC_INTERFACE
/**
 * Get city/location autocomplete suggestions from Geoapify API.
 * @param {string} input - User input (city or address fragment)
 * @param {number} [limit=5] - Maximum results
 * @returns {Promise<Array<{city: string, state?: string, country?: string, lat: number, lon: number}>>}
 */
export async function autocompleteCity(input, limit = 5) {
  if (!input) return [];
  try {
    const endpoint = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(input)}&type=city&limit=${limit}&format=json&apiKey=${GEOAPIFY_API_KEY}`;
    const resp = await fetch(endpoint);
    const data = await resp.json();
    if (!data || !Array.isArray(data.results)) return [];
    return data.results.map(item => ({
      city: item.city || item.name || "",
      state: item.state,
      country: item.country,
      lat: item.lat,
      lon: item.lon
    }));
  } catch (err) {
    console.error("Error in city autocomplete:", err);
    return [];
  }
}

// PUBLIC_INTERFACE
/**
 * Geocode a city/location name to get lat/lon using Geoapify.
 * @param {string} cityName - City or address to geocode
 * @returns {Promise<{lat: number, lon: number, city?: string, state?: string, country?: string}|null>}
 */
export async function geocodeCity(cityName) {
  if (!cityName) return null;
  try {
    const endpoint = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(cityName)}&limit=1&format=json&apiKey=${GEOAPIFY_API_KEY}`;
    const resp = await fetch(endpoint);
    const data = await resp.json();
    const res = data.results && data.results[0];
    if (!res) return null;
    return {
      lat: res.lat,
      lon: res.lon,
      city: res.city || res.name || "",
      state: res.state,
      country: res.country
    };
  } catch (err) {
    console.error("Error geocoding city:", err);
    return null;
  }
}
