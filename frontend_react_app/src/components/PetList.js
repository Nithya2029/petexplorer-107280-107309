import React, { useEffect, useState, useMemo } from 'react';
import { fetchAllPetsWithEnrichment, toggleLiveData, isLiveDataActive } from '../api';
import PetCard from './PetCard';
import Filters from './Filters';
import Pagination from './Pagination';
import { useSearchParams } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import SkeletonCard from './SkeletonCard';
import { AnimatePresence, motion } from "framer-motion";

/**
 * PUBLIC_INTERFACE
 * PetList - Uses enriched mockPets as the main data source (with images);
 * supports a demo toggle for "live" API but UIs always use the image-complete/enriched dataset by default.
 */
function PetList() {
  const [allPets, setAllPets] = useState([]);
  const [loading, setLoading] = useState(true);
  // Demo toggle for live/mock mode (now exposed as a UI button, default = mock mode)
  const [useLive, setUseLive] = useState(isLiveDataActive());
  // Support reading query params for filters
  const [searchParams] = useSearchParams();

  // Filters state: breed, ageRange (slider), location (dropdown)
  const [filters, setFilters] = useState({
    breed: '',
    ageRange: [0, 48], // default to full range
    location: '',
  });

  // On mount, sync filters from searchParams (URL query) if present
  useEffect(() => {
    const urlFilters = {};
    // Accept old params for compatibility if present
    if (searchParams.get('breed')) urlFilters.breed = searchParams.get('breed');
    if (searchParams.get('location')) urlFilters.location = searchParams.get('location');
    // Handle city param legacy
    if (!urlFilters.location && searchParams.get('city')) urlFilters.location = searchParams.get('city');

    // Age group mapping for legacy param
    let defaultAge = [0, 48];
    if (searchParams.get('ageGroup')) {
      const ag = searchParams.get('ageGroup');
      if (ag === 'baby') defaultAge = [0, 12];
      else if (ag === 'young') defaultAge = [13, 36];
      else if (ag === 'adult') defaultAge = [37, 96];
    }
    urlFilters.ageRange = defaultAge;

    // Only update if changed
    const notMatch =
      (urlFilters.breed !== filters.breed) ||
      (urlFilters.location !== filters.location) ||
      (
        urlFilters.ageRange &&
        (
          !filters.ageRange ||
          urlFilters.ageRange[0] !== filters.ageRange[0] ||
          urlFilters.ageRange[1] !== filters.ageRange[1]
        )
      );
    if (notMatch) {
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
  }, [useLive]); // re-fetch on live/mock mode

  // For interactive demo: toggle API live/mock mode (exposed as UI toggle)
  const handleToggleLive = () => {
    toggleLiveData(!useLive);
    setUseLive(!useLive);
    setLoading(true);
    // Trigger data reload via useEffect (above)
  };

  // Reset page 1 on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // PUBLIC_INTERFACE
  // Filtering logic based on selected filters.
  function matchesFilter(pet) {
    // breed
    if (filters.breed && pet.breed !== filters.breed) return false;
    // location: extract city part and match
    if (filters.location) {
      const city = pet.location ? pet.location.split(',')[0].trim() : '';
      if (city !== filters.location) return false;
    }
    // age range: inclusive
    if (
      filters.ageRange &&
      (typeof pet.age === 'number')
    ) {
      const age = pet.age;
      const [minA, maxA] = filters.ageRange;
      if (age < minA || age > maxA) return false;
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

  // New: Mock/Live toggle UI above filters
  const toggleButton = (
    <div style={{ marginBottom: 19 }}>
      <button
        type="button"
        onClick={handleToggleLive}
        style={{
          background: useLive ? 'var(--primary)' : 'var(--bg-secondary)',
          color: useLive ? 'var(--button-text)' : 'var(--accent)',
          border: '1.8px solid var(--primary)',
          borderRadius: 7,
          fontWeight: 700,
          fontSize: 14,
          padding: '7.5px 20px',
          marginRight: 8,
          cursor: 'pointer',
          boxShadow: useLive ? '0 2px 13px rgba(0,191,174,0.18)' : '0 0px 0 transparent',
          transition: 'background .13s, color .13s, box-shadow .13s',
          outline: useLive ? '2px solid var(--accent)' : 'none'
        }}
        aria-pressed={useLive}
        aria-label={
          useLive
            ? "Viewing live pet data from the RescueGroups API (click to use Demo Mode)"
            : "Currently using Demo Data (click to try Live Pet API)"
        }
        title={
          useLive
            ? "Showing LIVE API pets. Click to switch to mock/demo dataset."
            : "Showing enriched DEMO (mock) pets. Click to fetch from live API (slower)."
        }
      >
        {useLive ? "Live API: On" : "Demo Mode"}
      </button>
      <span
        style={{
          fontSize: 13,
          color: "#969696",
          marginLeft: 5,
          fontStyle: "italic",
          verticalAlign: "middle"
        }}
      >
        {useLive
          ? "Real adoptable pets (randomized, slower, internet required)"
          : "Offline/enriched sample dataset (fast, includes images)"}
      </span>
    </div>
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
      {/* New: Live/Mock data toggle UI */}
      {toggleButton}
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
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8 px-2">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 28 }}
              >
                <SkeletonCard />
              </motion.div>
            ))}
          </div>
          <LoadingSpinner message="Loading pets..." />
        </div>
      ) : filteredPets.length === 0 ? (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: 15 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <div className="text-4xl" role="img" aria-label="No pets">😢</div>
          <div className="font-bold text-secondary/80 dark:text-white/70 text-xl mt-4 mb-2">
            No pets found!
          </div>
          <div className="text-gray-600 dark:text-gray-300 mb-4 max-w-md text-center">
            Try adjusting your filters. No matches for this combination right now.<br />
            <button
              className="inline-block mt-3 bg-accent/90 text-secondary font-semibold rounded px-5 py-2 hover:bg-primary hover:text-white transition"
              onClick={() => setFilters({ breed: '', ageRange: [0, 48], location: '' })}
              type="button"
            >
              Reset Filters
            </button>
          </div>
        </motion.div>
      ) : (
        <>
          <AnimatePresence>
            <motion.div
              key="petgrid"
              className="pet-card-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: 26,
                width: '100%',
                margin: '0 auto'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.3, staggerChildren: 0.05 }}
            >
              <AnimatePresence>
                {pagedPets.map((pet) => (
                  <motion.div
                    key={pet.id}
                    layout
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 24 }}
                    transition={{ type: "spring", stiffness: 220, damping: 20 }}
                  >
                    <PetCard pet={pet} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
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
