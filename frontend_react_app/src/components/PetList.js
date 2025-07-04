import React, { useEffect, useState, useMemo } from 'react';
import { fetchAllPets } from '../api/petsApi';
import PetCard from './PetCard';
import Filters from './Filters';

/**
 * PUBLIC_INTERFACE
 * PetList - Fetches pet data and displays in a responsive card grid with filters.
 */
function PetList() {
  const [allPets, setAllPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state: breed, ageGroup, city
  const [filters, setFilters] = useState({
    breed: '',
    ageGroup: '',
    city: '',
  });

  // Fetch pet data on mount
  useEffect(() => {
    let isMounted = true;
    fetchAllPets().then(data => {
      if (isMounted) {
        setAllPets(Array.isArray(data) ? data : []);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  // PUBLIC_INTERFACE
  // Filtering logic based on selected filters.
  function matchesFilter(pet) {
    // breed
    if (filters.breed && pet.breed !== filters.breed) return false;
    // city: extract city part and match
    if (filters.city) {
      const city = pet.location ? pet.location.split(',')[0].trim() : '';
      if (city !== filters.city) return false;
    }
    // age group
    if (filters.ageGroup) {
      const age = pet.age || 0;
      if (filters.ageGroup === 'baby' && age > 12) return false;
      if (filters.ageGroup === 'young' && (age <= 12 || age > 36)) return false;
      if (filters.ageGroup === 'adult' && age <= 36) return false;
    }
    return true;
  }

  // Memoize filtered pets to optimize performance
  const filteredPets = useMemo(
    () => allPets.filter(matchesFilter),
    [allPets, filters]
  );

  return (
    <section
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '1rem',
      }}
      aria-label="Pet List"
    >
      <h2
        style={{
          color: 'var(--text-primary)',
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: -0.75,
          marginBottom: 18,
          textAlign: 'left',
        }}
      >
        Explore Pets
      </h2>
      {/* Filters UI */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 12,
          alignItems: 'flex-start',
          marginBottom: 18,
        }}
      >
        <Filters
          pets={allPets}
          filters={filters}
          onChange={setFilters}
        />
        {/* Optional for future: search bar */}
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', margin: 40, fontSize: 18, color: 'var(--text-secondary)' }}>Loading...</div>
      ) : filteredPets.length === 0 ? (
        <div style={{ textAlign: 'center', margin: 40, fontSize: 18 }}>No pets found.</div>
      ) : (
        <div
          className="pet-card-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 26,
            width: '100%',
            margin: '0 auto'
          }}
        >
          {filteredPets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}
    </section>
  );
}

export default PetList;
