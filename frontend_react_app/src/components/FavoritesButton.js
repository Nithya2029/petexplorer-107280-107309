import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from "framer-motion";

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
    <motion.button
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
      whileTap={{ scale: 0.93, rotate: -12 }}
      whileHover={{ scale: 1.07, boxShadow: "0 4px 18px rgba(0,0,0,0.22)" }}
      transition={{ type: "spring", stiffness: 420, damping: 20 }}
    >
      <motion.span
        animate={{ scale: hasFavorites ? 1.12 : 1, color: hasFavorites ? "#FFD700" : "#E3E3E3" }}
        transition={{ type: "spring", duration: 0.28 }}
        style={{ display: 'inline-block' }}
      >
        {hasFavorites ? '★' : '☆'}
      </motion.span>
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key="favs-badge"
            initial={{ scale: 0, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
            style={{
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
            }}
            aria-label={`${count} favorite${count === 1 ? '' : 's'}`}
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

FavoritesButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  count: PropTypes.number,
  hasFavorites: PropTypes.bool,
};

export default FavoritesButton;
