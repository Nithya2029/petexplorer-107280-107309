import React, { useEffect, useState } from 'react';
import { fetchAllPets } from '../api/petsApi';
import PetCard from './PetCard';

/**
 * PUBLIC_INTERFACE
 * PetList - Fetches pet data and displays in a responsive card grid.
 */
function PetList() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pet data on mount
  useEffect(() => {
    let isMounted = true;
    fetchAllPets().then(data => {
      if (isMounted) {
        setPets(Array.isArray(data) ? data : []);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

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
      {loading ? (
        <div style={{ textAlign: 'center', margin: 40, fontSize: 18, color: 'var(--text-secondary)' }}>Loading...</div>
      ) : pets.length === 0 ? (
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
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}
    </section>
  );
}

export default PetList;
