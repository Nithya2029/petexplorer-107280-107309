import React from 'react';
import PropTypes from 'prop-types';

/**
 * PUBLIC_INTERFACE
 * FavoritesButton - Floating button with count, filled/star, and visual feedback on favorite add/remove.
 * 
 * @param {function} onClick - Handler for button click.
 * @param {number} count - Number to display in badge.
 * @param {boolean} hasFavorites - If true, show filled star.
 */
function FavoritesButton({ onClick, count = 0, hasFavorites }) {
  return (
    <button
      className="favorites-btn"
      style={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        borderRadius: '50%',
        background: 'var(--button-bg)',
        color: 'var(--button-text)',
        width: 56,
        height: 56,
        fontSize: 28,
        boxShadow: '0 2px 10px rgba(0,0,0,0.16)',
        border: 'none',
        cursor: 'pointer',
        zIndex: 99,
        transition: 'background 0.2s, box-shadow 0.2s'
      }}
      title="View favorites"
      onClick={onClick}
      aria-label="Favorites"
    >
      {hasFavorites ? '★' : '☆'}
      {count > 0 && (
        <span style={{
          background: 'red',
          color: 'white',
          fontSize: 13,
          fontWeight: 700,
          borderRadius: 14,
          padding: '2px 7px',
          position: 'absolute',
          top: 6,
          right: 4,
          minWidth: 16,
          minHeight: 12,
          display: 'inline-block',
          boxShadow: '0 1px 4px rgba(0,0,0,0.15)'
        }} aria-label={`${count} favorite${count === 1 ? '' : 's'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

FavoritesButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  count: PropTypes.number,
  hasFavorites: PropTypes.bool,
};

export default FavoritesButton;
