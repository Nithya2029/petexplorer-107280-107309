import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * PUBLIC_INTERFACE
 * Filters - dynamic filters for breed, age group, and city.
 * @param {Object} props
 * @param {Array} props.pets - list of all pets
 * @param {Object} props.filters - { breed, ageGroup, city }
 * @param {Function} props.onChange - callback to set filters
 * @returns {JSX.Element}
 */
function Filters({ pets, filters, onChange }) {
  // Get breed and city options from pets list
  const breedOptions = useMemo(() => {
    const allBreeds = pets.map((pet) => pet.breed).filter(Boolean);
    return Array.from(new Set(allBreeds)).sort();
  }, [pets]);

  const cityOptions = useMemo(() => {
    const allCities = pets
      .map((pet) =>
        pet.location
          ? pet.location.split(',')[0].trim()
          : '' // Extract city part from "San Francisco, CA"
      )
      .filter(Boolean);
    return Array.from(new Set(allCities)).sort();
  }, [pets]);

  // Define static age group options and matching logic
  const ageGroups = [
    { label: 'All', value: '' },
    { label: 'Puppy/Kitten (0-12 months)', value: 'baby' },
    { label: 'Young (1-3 years)', value: 'young' },
    { label: 'Adult (4+ years)', value: 'adult' }
  ];

  // PUBLIC_INTERFACE
  function handleChange(e) {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  }

  return (
    <aside
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 12,
        padding: '18px 22px',
        marginBottom: 22,
        marginRight: 24,
        minWidth: 220,
        maxWidth: 300
      }}
      aria-label="Filter Pets"
    >
      <h3
        style={{
          margin: '0 0 10px 0',
          color: 'var(--text-primary)',
          fontSize: 20,
          fontWeight: 700
        }}
      >
        Filter Pets
      </h3>
      {/* Breed Filter */}
      <div style={{ marginBottom: 14 }}>
        <label htmlFor="breed" style={{ display: 'block', marginBottom: 4, color: 'var(--text-secondary)', fontWeight: 600 }}>
          Breed
        </label>
        <select
          id="breed"
          name="breed"
          value={filters.breed}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: 7,
            borderRadius: 6,
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            background: 'var(--bg-primary)'
          }}
        >
          <option value="">All Breeds</option>
          {breedOptions.map((breed) => (
            <option key={breed} value={breed}>
              {breed}
            </option>
          ))}
        </select>
      </div>
      {/* Age Group Filter */}
      <div style={{ marginBottom: 14 }}>
        <label htmlFor="ageGroup" style={{ display: 'block', marginBottom: 4, color: 'var(--text-secondary)', fontWeight: 600 }}>
          Age Group
        </label>
        <select
          id="ageGroup"
          name="ageGroup"
          value={filters.ageGroup}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: 7,
            borderRadius: 6,
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            background: 'var(--bg-primary)'
          }}
        >
          {ageGroups.map((ag) => (
            <option key={ag.value} value={ag.value}>
              {ag.label}
            </option>
          ))}
        </select>
      </div>
      {/* City Filter */}
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="city" style={{ display: 'block', marginBottom: 4, color: 'var(--text-secondary)', fontWeight: 600 }}>
          City
        </label>
        <select
          id="city"
          name="city"
          value={filters.city}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: 7,
            borderRadius: 6,
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            background: 'var(--bg-primary)'
          }}
        >
          <option value="">All Cities</option>
          {cityOptions.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}

Filters.propTypes = {
  pets: PropTypes.array.isRequired,
  filters: PropTypes.shape({
    breed: PropTypes.string,
    ageGroup: PropTypes.string,
    city: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Filters;
