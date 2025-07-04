import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import PetList from './components/PetList';
import PetDetail from './components/PetDetail';
import Favorites from './components/Favorites';
import { useFavorites } from './hooks/useFavorites';

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

// PUBLIC_INTERFACE
function Footer() {
  /**
   * PUBLIC_INTERFACE
   * Placeholder footer with static content.
   */
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      color: 'var(--text-secondary)',
      textAlign: 'center',
      padding: '1rem 0',
      marginTop: 'auto'
    }}>
      &copy; {new Date().getFullYear()} PetExplorer - A KAVIA demo
    </footer>
  );
}

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

// PUBLIC_INTERFACE
function App() {
  /**
   * PUBLIC_INTERFACE
   * Main application component. Sets up theming, UI layout, and React Router config.
   */
  const [theme, setTheme] = useState('light');
  const [showFavs, setShowFavs] = useState(false);

  // Favorites logic for global button
  const [favoriteIds] = useFavorites();

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // PUBLIC_INTERFACE
  const openFavorites = () => setShowFavs(true);
  // PUBLIC_INTERFACE
  const closeFavorites = () => setShowFavs(false);

  return (
    <Router>
      <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            zIndex: 100
          }}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <main style={{ flex: '1 0 auto', padding: '2rem 0' }}>
          <Routes>
            <Route path="/" element={<PetList />} />
            <Route path="/pets/:petId" element={<PetDetail />} />
            <Route path="/favorites" element={<Favorites />} />
            {/* Add additional routes as future features are implemented */}
          </Routes>
        </main>
        <Footer />
        <FavoritesButton
          onClick={() => window.location.href = '/favorites'}
          count={favoriteIds.length}
          hasFavorites={favoriteIds.length > 0}
        />
        {/* Modal overlay for favorites preview (optional, stubbed) */}
        {showFavs && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              zIndex: 500,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onClick={closeFavorites}
            aria-modal="true"
            role="dialog"
          >
            <div style={{
              background: 'white',
              padding: 32,
              borderRadius: 12,
              maxWidth: 440,
              minWidth: 280
            }}>
              <Favorites />
              <button style={{
                marginTop: 16,
                background: 'var(--button-bg)',
                color: 'var(--button-text)',
                border: 'none',
                padding: '8px 18px',
                borderRadius: 6,
                cursor: 'pointer'
              }} onClick={closeFavorites}>Close</button>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
