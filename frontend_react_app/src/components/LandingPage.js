import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllPetsWithEnrichment } from "../api";

// PUBLIC_INTERFACE
function LandingPage() {
  /**
   * PUBLIC_INTERFACE
   * Landing page featuring a banner, CTA, and quick search bar. 
   * Quick search (breed, age group, location) routes to listings page with filters.
   */
  const [allPets, setAllPets] = useState([]);
  const [loading, setLoading] = useState(true);
  // Search state
  const [breed, setBreed] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [city, setCity] = useState("");

  const navigate = useNavigate();

  // Fetch all pets for filter options
  useEffect(() => {
    let mounted = true;
    fetchAllPetsWithEnrichment().then((pets) => {
      if (mounted) {
        setAllPets(Array.isArray(pets) ? pets : []);
        setLoading(false);
      }
    });
    return () => { mounted = false; }
  }, []);

  // Breed and city options
  const breedOptions = useMemo(
    () => Array.from(new Set(allPets.map((pet) => pet.breed).filter(Boolean))).sort(),
    [allPets]
  );
  const cityOptions = useMemo(
    () => Array.from(new Set(
      allPets.map((pet) =>
        pet.location ? pet.location.split(",")[0].trim() : ""
      ).filter(Boolean)
    )).sort(),
    [allPets]
  );

  const ageGroups = [
    { label: "All Ages", value: "" },
    { label: "Puppy/Kitten (0-12m)", value: "baby" },
    { label: "Young (1-3y)", value: "young" },
    { label: "Adult (4+)", value: "adult" }
  ];

  // PUBLIC_INTERFACE
  function handleSubmit(e) {
    e.preventDefault();
    // Build query string for filters, and route to listings
    const query = [];
    if (breed) query.push(`breed=${encodeURIComponent(breed)}`);
    if (ageGroup) query.push(`ageGroup=${encodeURIComponent(ageGroup)}`);
    if (city) query.push(`city=${encodeURIComponent(city)}`);
    const queryStr = query.length ? "?" + query.join("&") : "";
    navigate(`/listings${queryStr}`);
  }

  // Banner/hero styles
  const bannerStyle = {
    background: "linear-gradient(90deg, var(--primary) 40%, var(--accent) 100%)",
    color: "white",
    padding: "58px 24px 38px 24px",
    borderRadius: 32,
    boxShadow: "0 2px 16px rgba(0,0,0,0.13)",
    margin: "40px auto 0 auto",
    maxWidth: 850,
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
    minHeight: 250,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  // Responsive
  const formStyle = {
    background: "var(--bg-primary)",
    borderRadius: 18,
    padding: "22px 20px",
    boxShadow: "0 2px 12px rgba(16,32,53, 0.07)",
    maxWidth: 540,
    width: "95%",
    margin: "auto",
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    alignItems: "flex-end",
    justifyContent: "center",
    marginTop: 42,
  };

  return (
    <div>
      <header style={bannerStyle} aria-label="Welcome banner">
        <h1 style={{
          fontSize: 38,
          fontWeight: 900,
          margin: 0,
          lineHeight: 1.22,
          letterSpacing: -1,
          color: "white"
        }}>
          Find Your New <span style={{ color: "var(--accent)" }}>Best Friend</span>
        </h1>
        <p style={{
          color: "white",
          fontSize: 22,
          fontWeight: 400,
          maxWidth: 650,
          margin: "28px auto 12px auto",
          opacity: 0.95,
          letterSpacing: '-0.13px'
        }}>
          Discover adoptable dogs & cats near you – search by breed, city, or age and make a difference today. Adopt. Foster. Love!
        </p>
        <a
          href="#quick-search"
          className="btn"
          style={{
            display: "inline-block",
            marginTop: 14,
            fontSize: 17,
            fontWeight: 700,
            padding: "13px 32px",
            borderRadius: "2em",
            background: "var(--button-bg)",
            color: "var(--button-text)",
            textDecoration: "none",
            boxShadow: "0 3px 12px rgba(35,41,64,0.17)",
            letterSpacing: ".04em"
          }}
        >
          Start Your Search
        </a>
        {/* Decorative circle */}
        <span style={{
          position: "absolute",
          right: -76,
          top: -86,
          width: 260,
          height: 260,
          borderRadius: 999,
          background: "rgba(255,255,255,0.10)",
          zIndex: 0,
          pointerEvents: "none"
        }} />
      </header>
      <main>
        <form id="quick-search" style={formStyle} onSubmit={handleSubmit} aria-label="Quick Search">
          <h2 style={{ 
            fontSize: 26, margin: "0 0 18px 0", fontWeight: 800, width: "100%", textAlign: "center", color: "var(--primary)"
          }}>
            Quick Search
          </h2>
          {/* Breed dropdown */}
          <div style={{ flex: "1 0 140px", minWidth: 120 }}>
            <label htmlFor="breed" style={{ fontWeight: 600, color: "var(--text-secondary)", fontSize: 14, marginBottom: 3, display: "block" }}>
              Breed
            </label>
            <select
              id="breed"
              value={breed}
              onChange={e => setBreed(e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 7,
                border: "1px solid var(--border-color)",
                background: "var(--bg-primary)",
                color: "var(--text-primary)",
              }}
              disabled={loading || breedOptions.length === 0}
            >
              <option value="">Any</option>
              {breedOptions.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          {/* Age group dropdown */}
          <div style={{ flex: "1 0 142px", minWidth: 120 }}>
            <label htmlFor="ageGroup" style={{ fontWeight: 600, color: "var(--text-secondary)", fontSize: 14, marginBottom: 3, display: "block" }}>
              Age
            </label>
            <select
              id="ageGroup"
              value={ageGroup}
              onChange={e => setAgeGroup(e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 7,
                border: "1px solid var(--border-color)",
                background: "var(--bg-primary)",
                color: "var(--text-primary)",
              }}
            >
              {ageGroups.map(ag => (
                <option key={ag.value} value={ag.value}>{ag.label}</option>
              ))}
            </select>
          </div>
          {/* City dropdown */}
          <div style={{ flex: "1 0 120px", minWidth: 100 }}>
            <label htmlFor="city" style={{ fontWeight: 600, color: "var(--text-secondary)", fontSize: 14, marginBottom: 3, display: "block" }}>
              City
            </label>
            <select
              id="city"
              value={city}
              onChange={e => setCity(e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 7,
                border: "1px solid var(--border-color)",
                background: "var(--bg-primary)",
                color: "var(--text-primary)",
              }}
              disabled={loading || cityOptions.length === 0}
            >
              <option value="">Any</option>
              {cityOptions.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          {/* Submit button */}
          <div style={{ flex: "0 0 150px" }}>
            <button
              type="submit"
              className="btn"
              style={{
                marginTop: 16,
                padding: "11px 32px",
                fontSize: 16,
                fontWeight: 700,
                borderRadius: 7,
                background: "var(--button-bg)",
                color: "var(--button-text)"
              }}
              disabled={loading}
              aria-label="Search pets"
            >
              Search
            </button>
          </div>
        </form>
      </main>
      <section style={{ margin: "62px auto 0", maxWidth: 580, textAlign: "center", color: "var(--text-secondary)", fontSize: 18, opacity: 0.84 }}>
        <strong>Why Adopt?</strong> Every adoption saves a life. Thank you for making a difference in a pet’s journey!
      </section>
    </div>
  );
}

export default LandingPage;
