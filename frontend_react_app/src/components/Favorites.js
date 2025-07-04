import React, { useEffect, useState } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { fetchAllPetsWithEnrichment } from '../api';
import PetCard from './PetCard';

// PUBLIC_INTERFACE
function Favorites() {
  /**
   * Favorites view: shows all favorited pets from localStorage.
   */
  const [favoriteIds, , , clearFavorites] = useFavorites();
  const [favoritePets, setFavoritePets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Refresh pets on mount or when favorites change
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const allPets = await fetchAllPetsWithEnrichment();
      // Get pet objects in same order as favoriteIds
      const pets = favoriteIds.map(fid => allPets.find(p => p.id === fid)).filter(Boolean);
      if (mounted) {
        setFavoritePets(pets);
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [favoriteIds]);

  return (
    <section>
      <h2 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: 18 }}>Your Favorites</h2>
      <button
        onClick={clearFavorites}
        style={{
          background: '#eee',
          color: '#D32F2F',
          border: '1px solid #eedfd4',
          borderRadius: 7,
          padding: '6px 17px',
          fontSize: 13,
          fontWeight: 500,
          marginBottom: 20,
          cursor: 'pointer'
        }}
        disabled={favoritePets.length === 0}
        aria-disabled={favoritePets.length === 0}
        aria-label="Clear all favorites"
        title="Remove all favorites"
      >
        Clear All
      </button>
      <div aria-live="polite" aria-atomic="true">
        {loading ? (
          <div style={{ color: 'var(--text-secondary)' }}>Loading favorites...</div>
        ) : favoritePets.length === 0 ? (
          <div>No favorites yet. Tap the ★ on a pet to add them here!</div>
        ) : (
          <div
            className="pet-card-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 22,
              marginTop: 8
            }}
          >
            {favoritePets.map(pet => (
              <PetCard pet={pet} key={pet.id} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Favorites;
