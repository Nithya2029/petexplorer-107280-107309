import React from 'react';
import PropTypes from 'prop-types';

/**
 * PUBLIC_INTERFACE
 * Pagination - Renders pagination controls (prev/next/page) for lists.
 * @param {number} currentPage - Active page (1-based)
 * @param {number} totalPages - Count of total pages
 * @param {Function} onPageChange - Handler called with new page number
 * @param {number} [siblingCount] - How many page links left/right of active page
 * @returns {JSX.Element}
 */
function Pagination({ currentPage, totalPages, onPageChange, siblingCount = 1 }) {
  if (totalPages <= 1) return null;

  // PUBLIC_INTERFACE
  // Build the visible set of pages (show 1 ... X Y [current] Z ... N)
  function getPages() {
    const range = [];
    const min = Math.max(2, currentPage - siblingCount);
    const max = Math.min(totalPages - 1, currentPage + siblingCount);

    range.push(1); // Always show first
    if (min > 2) range.push('...');

    for (let i = min; i <= max; ++i) range.push(i);

    if (max < totalPages - 1) range.push('...');
    if (totalPages > 1) range.push(totalPages);

    return range;
  }

  return (
    <nav
      aria-label="Pet List pagination"
      style={{
        marginTop: 34,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 9,
        userSelect: 'none'
      }}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        style={{
          background: 'var(--button-bg)',
          color: 'var(--button-text)',
          border: 'none',
          borderRadius: 7,
          padding: '7px 18px',
          fontWeight: 600,
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          opacity: currentPage === 1 ? 0.56 : 1
        }}
      >
        &larr; Prev
      </button>

      {getPages().map((p, idx) =>
        p === '...' ? (
          <span key={`dots${idx}`} style={{ color: 'var(--text-secondary)', margin: '0 2px' }}>…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            disabled={p === currentPage}
            aria-current={p === currentPage ? 'page' : undefined}
            style={{
              background: p === currentPage ? 'var(--text-secondary)' : 'white',
              color: p === currentPage ? 'white' : 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 7,
              margin: '0 2px',
              padding: '7px 13px',
              fontWeight: p === currentPage ? 700 : 500,
              fontSize: 16,
              cursor: p === currentPage ? 'default' : 'pointer',
              transition: 'background 0.14s'
            }}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        style={{
          background: 'var(--button-bg)',
          color: 'var(--button-text)',
          border: 'none',
          borderRadius: 7,
          padding: '7px 18px',
          fontWeight: 600,
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          opacity: currentPage === totalPages ? 0.56 : 1
        }}
      >
        Next &rarr;
      </button>
    </nav>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  siblingCount: PropTypes.number,
};

export default Pagination;
