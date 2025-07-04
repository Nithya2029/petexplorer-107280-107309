import React, { useEffect, useState, useMemo } from 'react';
import { fetchAllPetsWithEnrichment } from '../api';
import PetCard from './PetCard';
import Filters from './Filters';
import Pagination from './Pagination';
import { useSearchParams } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * PetList - Fetches pet data and displays in a responsive card grid with filters and pagination.
 * Supports URL query string for initial filters (breed, ageGroup, city).
 */
function PetList() {
  const [allPets, setAllPets] = useState([]);
  const [loading, setLoading] = useState(true);
  // Support reading query params for filters
  const [searchParams] = useSearchParams();

  // Filters state: breed, ageGroup, city
  const [filters, setFilters] = useState({
    breed: '',
    ageGroup: '',
    city: '',
  });

  // On mount, sync filters from searchParams (URL query) if present
  useEffect(() => {
    const urlFilters = {};
    for (const k of ['breed', 'ageGroup', 'city']) {
      if (searchParams.get(k)) urlFilters[k] = searchParams.get(k);
    }
    if (
      urlFilters.breed !== filters.breed ||
      urlFilters.ageGroup !== filters.ageGroup ||
      urlFilters.city !== filters.city
    ) {
      setFilters((prev) => ({ ...prev, ...urlFilters }));
    }
    // eslint-disable-next-line
    // intentionally only on mount/params change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; // Show 6 pets per page by default

  // Fetch pet data on mount (with enrichment/cache)
  useEffect(() => {
    let isMounted = true;
    fetchAllPetsWithEnrichment().then(data => {
      if (isMounted) {
        setAllPets(Array.isArray(data) ? data : []);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Reset page 1 on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

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

  // Paginate filtered pets
  const totalPages = Math.max(1, Math.ceil(filteredPets.length / pageSize));
  const pagedPets = filteredPets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // PUBLIC_INTERFACE
  function handlePageChange(pageNum) {
    if (pageNum >= 1 && pageNum <= totalPages && pageNum !== currentPage) {
      setCurrentPage(pageNum);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

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
        className="main-flexrow"
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 12,
          alignItems: 'flex-start',
          marginBottom: 18,
        }}
      >
        <div className="filters-pane">
          <Filters
            pets={allPets}
            filters={filters}
            onChange={setFilters}
          />
        </div>
        {/* Optional for future: search bar */}
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', margin: 40, fontSize: 18, color: 'var(--text-secondary)' }}>Loading...</div>
      ) : filteredPets.length === 0 ? (
        <div style={{ textAlign: 'center', margin: 40, fontSize: 18 }}>No pets found.</div>
      ) : (
        <>
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
            {pagedPets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </section>
  );
}

export default PetList;
