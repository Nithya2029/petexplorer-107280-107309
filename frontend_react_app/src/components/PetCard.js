import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { formatAge } from '../utils/helpers';

/**
 * PUBLIC_INTERFACE
 * PetCard - Card displaying pet image, breed, age, location, and "View Details" button.
 * @param {Object} props
 * @param {Object} props.pet - The pet object containing details.
 * @returns {JSX.Element}
 */
function PetCard({ pet }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/pets/${pet.id}`);
  };

  return (
    <div
      className="pet-card"
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 14,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: 220,
        maxWidth: 280,
        margin: 'auto',
        transition: 'transform 0.15s',
      }}
    >
      <img
        src={pet.imageURL}
        alt={pet.name}
        style={{
          width: '100%',
          maxWidth: 210,
          maxHeight: 140,
          objectFit: 'cover',
          borderRadius: 10,
          marginBottom: 14,
        }}
        loading="lazy"
      />
      <h3
        style={{
          margin: '0 0 8px 0',
          color: 'var(--text-primary)',
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: 0.1,
        }}
      >
        {pet.name}
      </h3>
      <div
        style={{
          color: 'var(--text-secondary)',
          fontSize: 14,
          fontWeight: 500,
          marginBottom: 2,
        }}
      >
        {pet.breed}
      </div>
      <div style={{
        fontSize: 13,
        color: 'var(--text-primary)',
        opacity: 0.8,
        marginBottom: 2,
      }}>
        Age: {formatAge(pet.age)}
      </div>
      <div style={{
        fontSize: 13,
        color: 'var(--text-primary)',
        marginBottom: 12,
        opacity: 0.8,
      }}>
        {pet.location}
      </div>
      <button
        className="view-details-btn"
        style={{
          background: 'var(--button-bg)',
          color: 'var(--button-text)',
          border: 'none',
          borderRadius: 8,
          padding: '8px 22px',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
        onClick={handleViewDetails}
      >
        View Details
      </button>
    </div>
  );
}

PetCard.propTypes = {
  pet: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    breed: PropTypes.string,
    age: PropTypes.number,
    location: PropTypes.string,
    imageURL: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
};

export default PetCard;
