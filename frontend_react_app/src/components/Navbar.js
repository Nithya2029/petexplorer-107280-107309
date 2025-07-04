import React from 'react';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
function Navbar() {
  /**
   * PUBLIC_INTERFACE
   * Semantic navbar with ARIA, keyboard, and responsive accessibility features.
   */
  return (
    <nav className="navbar" aria-label="Primary navigation"
      style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
      <div>
        <Link
          to="/"
          className="navbar-brand"
          aria-current="page"
          tabIndex={0}
          style={{
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            textDecoration: 'none',
            fontSize: 22
          }}
        >
          PetExplorer
        </Link>
      </div>
      <ul
        role="menubar"
        style={{
          display: 'flex',
          gap: 12,
          margin: 0,
          padding: 0,
          listStyle: 'none'
        }}
      >
        <li role="none">
          <Link
            to="/"
            role="menuitem"
            tabIndex={0}
            style={{
              marginRight: 12,
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontWeight: 600
            }}
            aria-label="Home"
          >
            Home
          </Link>
        </li>
        <li role="none">
          <Link
            to="/favorites"
            role="menuitem"
            tabIndex={0}
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontWeight: 600
            }}
            aria-label="Favorites"
          >
            Favorites
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
