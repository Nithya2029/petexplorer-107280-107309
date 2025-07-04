import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import PetList from './components/PetList';
import PetDetail from './components/PetDetail';
import Favorites from './components/Favorites';
import { useFavorites } from './hooks/useFavorites';
// Prepare enriched data on app load
import { loadAndEnrichMockPets } from './api/rescueGroupsApi';

// PUBLIC_INTERFACE
function Navbar() {
  /**
   * PUBLIC_INTERFACE
   * Responsive Tailwind navbar with navigation links.
   */
  return (
    <nav className="navbar w-full bg-secondary border-b border-border-color py-3 px-5 flex items-center justify-between">
      <div>
        <Link to="/" className="navbar-brand font-bold text-primary no-underline text-xl">
          PetExplorer
        </Link>
      </div>
      <div className="flex gap-6">
        <Link to="/" className="text-accent no-underline font-semibold hover:underline">Home</Link>
        <Link to="/favorites" className="text-accent no-underline font-semibold hover:underline">Favorites</Link>
      </div>
    </nav>
  );
}

// PUBLIC_INTERFACE
function Footer() {
  /**
   * PUBLIC_INTERFACE
   * Responsive Tailwind footer with static content.
   */
  return (
    <footer className="bg-secondary border-t border-border-color text-accent text-center py-4 mt-auto">
      &copy; {new Date().getFullYear()} PetExplorer - A KAVIA demo
    </footer>
  );
}

// PUBLIC_INTERFACE
function FavoritesButton({ onClick }) {
  /**
   * PUBLIC_INTERFACE
   * Responsive floating favorites button.
   */
  return (
    <button
      className="favorites-btn fixed bottom-8 right-8 rounded-full bg-primary text-white w-14 h-14 text-2xl shadow-lg border-none cursor-pointer z-50 flex items-center justify-center"
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

  // Enrich/prime mock dataset at startup for instant experience (on first load)
  useEffect(() => {
    loadAndEnrichMockPets();
  }, []);

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
      <div className={`App min-h-screen flex flex-col font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-secondary text-white' : 'bg-white text-secondary'}`}>
        <Navbar />
        <button
          className="theme-toggle absolute top-5 right-5 z-50 bg-accent text-secondary rounded-full px-6 py-2 text-base font-bold shadow-md transition-all duration-150 hover:bg-primary hover:text-white focus:outline-none"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <main className="flex-1 py-8">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/listings" element={<PetList />} />
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
            className="fixed inset-0 bg-black bg-opacity-40 z-40 flex justify-center items-center"
            onClick={closeFavorites}
            aria-modal="true"
            role="dialog"
          >
            <div className="bg-white p-8 rounded-lg max-w-md min-w-[280px]" onClick={e => e.stopPropagation()}>
              <Favorites />
              <button
                className="mt-4 bg-primary text-white border-none px-5 py-2 rounded cursor-pointer"
                onClick={closeFavorites}
              >Close</button>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
