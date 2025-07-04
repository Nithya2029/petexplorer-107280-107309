import React, { useMemo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * PUBLIC_INTERFACE
 * Filters - dynamic filters for breed, age range, and location.
 * @param {Object} props
 * @param {Array} props.pets - list of all pets
 * @param {Object} props.filters - { breed, ageRange, location }
 * @param {Function} props.onChange - callback to set filters
 * @returns {JSX.Element}
 */
function Filters({ pets, filters, onChange }) {
  // Memoize breed and location options from pets OR fallback to hardcoded
  const [breedOptions, setBreedOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);

  // This effect sources unique, sorted breed/location from live pets data, or fallback static if not populated
  useEffect(() => {
    const breeds = Array.from(new Set(pets.map(p => p.breed).filter(Boolean))).sort();
    setBreedOptions(breeds.length ? breeds : [
      "Golden Retriever", "Border Collie", "Boxer", "Siamese", "Bombay", "Tabby"
    ]);
    const locations = Array.from(new Set(
      pets.map((p) => (p.location ? p.location.split(',')[0].trim() : "")).filter(Boolean)
    )).sort();
    setLocationOptions(locations.length ? locations : [
      "San Francisco", "New York", "Portland", "Austin", "Chicago", "Seattle"
    ]);
  }, [pets]);

  // Age range: We use a slider from [0, maxAge] months and label common groups
  const minAge = 0;
  const maxAge = useMemo(() => {
    // If app is working, fetch max; else fallback
    const maxPetAge = pets.length
      ? pets.reduce((max, p) => (p.age && p.age > max ? p.age : max), 48)
      : 48; // fallback 4 years
    return Math.max(48, maxPetAge);
  }, [pets]);
  const [localAge, setLocalAge] = useState(filters.ageRange || [minAge, maxAge]); // [min, max]
  // When filters.ageRange changes outside, sync slider local state
  useEffect(() => {
    if (
      filters.ageRange &&
      (filters.ageRange[0] !== localAge[0] || filters.ageRange[1] !== localAge[1])
    ) {
      setLocalAge(filters.ageRange);
    }
    // eslint-disable-next-line
  }, [filters.ageRange]);

  // PUBLIC_INTERFACE
  function handleChange(e) {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  }
  // PUBLIC_INTERFACE
  function handleAgeMinChange(e) {
    let newMin = Number(e.target.value);
    let [oldMin, oldMax] = localAge;
    if (newMin > oldMax) newMin = oldMax; // cannot exceed max
    setLocalAge([newMin, oldMax]);
    onChange({ ...filters, ageRange: [newMin, oldMax] });
  }
  function handleAgeMaxChange(e) {
    let newMax = Number(e.target.value);
    let [oldMin, oldMax] = localAge;
    if (newMax < oldMin) newMax = oldMin; // cannot be below min
    setLocalAge([oldMin, newMax]);
    onChange({ ...filters, ageRange: [oldMin, newMax] });
  }

  // Accessibility: props for sliders
  const makeSliderProps = (which, val, min, max, step, label) => ({
    type: 'range',
    id: `age-${which}`,
    min,
    max,
    step,
    value: val,
    'aria-label': label,
    'aria-valuemin': min,
    'aria-valuemax': max,
    'aria-valuenow': val,
    style: {
      width: '104px',
      marginRight: which === 'min' ? 10 : 0,
      accentColor: 'var(--primary)'
    },
    onChange: which === 'min' ? handleAgeMinChange : handleAgeMaxChange,
  });

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
        maxWidth: 318
      }}
      aria-label="Filter Pets"
    >
      <h3
        style={{
          margin: '0 0 14px 0',
          color: 'var(--text-primary)',
          fontSize: 20,
          fontWeight: 700
        }}
        id="filters-heading"
      >
        Filter Pets
      </h3>
      {/* Breed Filter */}
      <div style={{ marginBottom: 18 }}>
        <label id="label-breed" htmlFor="breed" style={{ display: 'block', marginBottom: 4, color: 'var(--text-secondary)', fontWeight: 600 }}>
          Breed
        </label>
        <select
          id="breed"
          name="breed"
          aria-labelledby="label-breed"
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
      {/* Age Range Filter (Two-ended slider, accessible group) */}
      <fieldset
        style={{ marginBottom: 18, border: 'none', padding: 0 }}
        aria-labelledby="label-age-range"
      >
        <legend
          id="label-age-range"
          style={{
            fontSize: 15,
            color: 'var(--text-secondary)',
            fontWeight: 600,
            marginBottom: 2
          }}
        >
          Age Range (months)
        </legend>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input
            {...makeSliderProps('min', localAge[0], minAge, localAge[1], 1, 'Minimum age')}
            tabIndex={0}
          />
          <span aria-hidden="true" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {localAge[0]}m
          </span>
          <span style={{ margin: '0 3px', color: '#444' }}>–</span>
          <input
            {...makeSliderProps('max', localAge[1], localAge[0], maxAge, 1, 'Maximum age')}
            tabIndex={0}
          />
          <span aria-hidden="true" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {localAge[1] >= 12 ? `${Math.floor(localAge[1] / 12)}y` : `${localAge[1]}m`}
          </span>
        </div>
        <div
          style={{
            fontSize: 12,
            color: '#888',
            marginTop: 2,
            marginLeft: 2,
            marginBottom: 2
          }}
        >
          <span className="sr-only">Select minimum and maximum age in months</span>
          <span style={{ fontWeight: 500, color: '#bbb', fontStyle: 'italic' }}>
            Use left & right arrow keys for fine adjustment. Range: {minAge}–{maxAge} months
          </span>
        </div>
        <button
          type="button"
          style={{
            background: '#F4F8FB',
            color: 'var(--primary)',
            border: '1px solid var(--primary)',
            fontSize: 13,
            borderRadius: 6,
            marginTop: 3,
            padding: '4px 12px',
            cursor: 'pointer'
          }}
          onClick={() => {
            setLocalAge([minAge, maxAge]);
            onChange({ ...filters, ageRange: [minAge, maxAge] });
          }}
          aria-label="Clear age range filter"
        >
          Reset Age
        </button>
      </fieldset>
      {/* Location Filter */}
      <div style={{ marginBottom: 6 }}>
        <label id="label-location" htmlFor="location" style={{ display: 'block', marginBottom: 4, color: 'var(--text-secondary)', fontWeight: 600 }}>
          Location
        </label>
        <select
          id="location"
          name="location"
          aria-labelledby="label-location"
          value={filters.location}
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
          <option value="">All Locations</option>
          {locationOptions.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
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
    ageRange: PropTypes.arrayOf(PropTypes.number), // [min, max]
    location: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Filters;
