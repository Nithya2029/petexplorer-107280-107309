import React from 'react';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
function Navbar() {
  /**
   * PUBLIC_INTERFACE
   * Placeholder navbar with navigation links.
   */
  return (
    <nav className="navbar" style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div>
        <Link to="/" className="navbar-brand" style={{ fontWeight: 'bold', color: 'var(--text-primary)', textDecoration: 'none', fontSize: 22 }}>
          PetExplorer
        </Link>
      </div>
      <div>
        <Link to="/" style={{ marginRight: 20, color: 'var(--text-secondary)', textDecoration: 'none' }}>Home</Link>
        <Link to="/favorites" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Favorites</Link>
      </div>
    </nav>
  );
}

export default Navbar;
