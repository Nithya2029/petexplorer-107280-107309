/**
 * Placeholder for general utility/helper functions.
 * Add functions here as the project grows.
 */

// Example (to be replaced)
export function formatAge(ageMonths) {
  if (ageMonths < 12) return `${ageMonths} months`;
  const years = Math.floor(ageMonths / 12);
  return `${years} years`;
}
