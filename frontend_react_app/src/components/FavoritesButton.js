import React from 'react';

// PUBLIC_INTERFACE
function FavoritesButton({ onClick }) {
  /**
   * PUBLIC_INTERFACE
   * Placeholder floating favorites button.
   */
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
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        border: 'none',
        cursor: 'pointer',
        zIndex: 99,
      }}
      title="View favorites"
      onClick={onClick}
      aria-label="Favorites"
    >
      ★
    </button>
  );
}

export default FavoritesButton;
