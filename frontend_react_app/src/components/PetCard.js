import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { formatAge } from '../utils/helpers';
import PetDetailModal from './PetDetailModal';
import { useFavorites } from '../hooks/useFavorites';

/**
 * PUBLIC_INTERFACE
 * PetCard - Card displaying pet image, breed, age, location, and "View Details" button.
 * On "View Details" opens detail modal; with fallback navigation for keyboard accessibility.
 * @param {Object} props
 * @param {Object} props.pet - The pet object containing details.
 * @returns {JSX.Element}
 */
function PetCard({ pet }) {
  const navigate = useNavigate();
  const [showDetail, setShowDetail] = useState(false);

  // Favorites logic
  const [, toggleFavorite, isFavorited] = useFavorites();
  const [recentlyToggled, setRecentlyToggled] = useState(false);

  /**
   * Open modal for details (mouse click), fallback: if user holds ctrl/meta or right-click, navigate to full route.
   */
  const handleViewDetails = (e) => {
    // Keyboard and screen reader support: open page, not modal
    if (e.type === "keydown" || e.metaKey || e.ctrlKey || e.button === 1 || e.button === 2) {
      navigate(`/pets/${pet.id}`);
    } else {
      setShowDetail(true);
    }
  };

  const handleClose = () => setShowDetail(false);

  // Toggle favorite with optimistic feedback
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(pet.id);
    setRecentlyToggled(true);
    setTimeout(() => setRecentlyToggled(false), 600);
  };

  const favoriteIconStyle = {
    color: isFavorited(pet.id) ? '#E87A41' : '#c7c7c7',
    fontSize: 24,
    transition: 'color 0.25s',
    cursor: 'pointer',
    filter: recentlyToggled ? 'drop-shadow(0 0 4px #E87A41)' : 'none',
    background: 'white',
    borderRadius: '50%',
    padding: 2,
    position: 'absolute',
    right: 12,
    top: 12,
    border: '1px solid #eedfd4',
    zIndex: 4
  };

  return (
    <>
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
          position: 'relative'
        }}
      >
        {/* Favorite/Unfavorite Star Button */}
        <button
          aria-label={isFavorited(pet.id) ? "Remove from favorites" : "Add to favorites"}
          title={isFavorited(pet.id) ? "Remove from favorites" : "Add to favorites"}
          onClick={handleFavoriteClick}
          style={favoriteIconStyle}
        >
          {isFavorited(pet.id) ? '★' : '☆'}
        </button>
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
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === " ") handleViewDetails(e);
          }}
          aria-label={`View details about ${pet.name}`}
        >
          View Details
        </button>
      </div>
      {showDetail && (
        <PetDetailModal pet={pet} onClose={handleClose} />
      )}
    </>
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
