import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPetByIdWithEnrichment } from "../api";

// Simple carousel (inline, matches modal)
function Carousel({ images, alt, initial = 0 }) {
  const [idx, setIdx] = useState(initial);
  if (!Array.isArray(images) || images.length === 0) return null;
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);
  return (
    <div style={{ position: "relative", marginBottom: 16 }}>
      <img
        src={images[idx]}
        alt={alt || ""}
        style={{
          width: "100%",
          maxHeight: 260,
          objectFit: "cover",
          borderRadius: 12,
          marginBottom: 5,
          background: "#eee",
          boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
        }}
        aria-label={alt}
        loading="lazy"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Show previous image"
            style={{
              position: "absolute", left: 9, top: "44%",
              background: "rgba(255,255,255,.89)", border: "none", borderRadius: 18,
              width: 37, height: 37, fontSize: 23, color: "#444", cursor: "pointer", zIndex: 2, boxShadow: "0 1px 4px #ccc"
            }}
          >&#8592;</button>
          <button
            onClick={next}
            aria-label="Show next image"
            style={{
              position: "absolute", right: 9, top: "44%",
              background: "rgba(255,255,255,.89)", border: "none", borderRadius: 18,
              width: 37, height: 37, fontSize: 23, color: "#444", cursor: "pointer", zIndex: 2, boxShadow: "0 1px 4px #ccc"
            }}
          >&#8594;</button>
          <div
            style={{
              position: "absolute", bottom: 3, width: "100%", textAlign: "center",
              fontSize: 13, color: "#666", fontWeight: 800, opacity: 0.88, letterSpacing: "0.07em"
            }}
            aria-live="polite"
          >
            Image {idx + 1} of {images.length}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * PetDetail - Page showing full details for a pet. Enhanced: image carousel, health, contact, all info.
 */
function PetDetail() {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!petId) return;
    setLoading(true);
    fetchPetByIdWithEnrichment(petId).then((data) => {
      setPet(data);
      setLoading(false);
    });
  }, [petId]);

  if (loading) {
    return (
      <section>
        <div style={{ textAlign: "center", margin: 60, fontSize: 18 }}>
          Loading...
        </div>
      </section>
    );
  }

  if (!pet) {
    return (
      <section>
        <div style={{ textAlign: "center", margin: 60, fontSize: 18 }}>
          Pet not found.
        </div>
      </section>
    );
  }

  // Gallery
  const images = Array.isArray(pet.images) && pet.images.length
    ? pet.images
    : [pet.imageURL, pet.imageURL.replace("3004", "1500") || pet.imageURL, pet.imageURL.replace("bpc", "9oo") || pet.imageURL]
        .filter(Boolean);

  // Health Info
  const health = pet.health || {
    vaccinated: !!(pet.type === "dog" || pet.type === "cat"),
    neutered: pet.id && parseInt(String(pet.id).replace(/\D/g,'')) % 2 === 0,
    microchipped: Math.random() > 0.4,
    specialNeeds: pet.age < 8 ? "Kitten/Puppy care required" : undefined,
    status: pet.age < 8 ? "Puppy/Kitten" : pet.age > 84 ? "Senior" : "Healthy",
  };

  // Contact links
  const specName = [pet.name, pet.breed].filter(Boolean).join(' ');
  const mailtoHref = `mailto:?subject=Interested in adopting ${encodeURIComponent(
    pet.name
  )}&body=Hi, I'm interested in ${pet.name} (${pet.breed}, ${pet.type}) at ${pet.location}.`;
  const whatsappText = `Hi! I'm interested in adopting ${pet.name} (${pet.breed}, ${pet.type}) at ${pet.location}.`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;

  return (
    <section
      style={{
        maxWidth: 560,
        margin: "2.5rem auto",
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        borderRadius: 20,
        padding: "2.2rem 2.1rem",
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        color: "var(--text-primary)",
        position: "relative",
      }}
      aria-label={`Details about ${pet.name}`}
    >
      <button
        aria-label="Back"
        style={{
          background: "transparent",
          border: "none",
          color: "var(--text-secondary)",
          fontWeight: 700,
          fontSize: 21,
          position: "absolute",
          left: 20,
          top: 16,
          cursor: "pointer"
        }}
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <Carousel images={images} alt={`Photos of ${specName}`} />

      <h2 style={{ margin: "7px 0 10px", fontSize: 33, fontWeight: 800 }}>{pet.name}</h2>
      <div style={{ fontSize: 19, color: "var(--text-secondary)", marginBottom: 3, fontWeight: 700 }}>
        {pet.breed}{pet.type ? ` · ${pet.type[0].toUpperCase() + pet.type.substring(1)}` : ""}
      </div>
      <div style={{ fontSize: 16, opacity: 0.92, marginBottom: 3 }}>
        Age: {pet.age < 12 ? `${pet.age} months` : `${Math.floor(pet.age / 12)} years`}
      </div>
      <div style={{ fontSize: 16, color: "var(--text-primary)", opacity: 0.82, marginBottom: 10 }}>
        Location: {pet.location}
      </div>
      {pet.description && (
        <div style={{
          fontSize: 16, color: "var(--text-primary)", opacity: 0.93, fontStyle: "italic",
          margin: "10px 0 13px", borderLeft: "3px solid var(--accent)", paddingLeft: 13
        }}>
          {pet.description}
        </div>
      )}
      <div
        role="region"
        aria-label="Pet Health Information"
        style={{
          background: "var(--bg-primary)",
          border: "1.5px solid var(--border-color)",
          borderRadius: 11,
          padding: "14px 15px",
          margin: "14px 0 18px",
          fontSize: 15,
          color: "var(--text-primary)"
        }}
      >
        <div style={{ marginBottom: 7, fontWeight: 800, color: "var(--primary)", fontSize: 16 }}>
          Health & Status
        </div>
        <ul style={{
          listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7
        }}>
          <li>
            <span style={{ fontWeight: 600 }}>Vaccinated:</span> {health.vaccinated ? "Yes" : "Unknown"}
          </li>
          <li>
            <span style={{ fontWeight: 600 }}>Neutered:</span> {health.neutered ? "Yes" : "No"}
          </li>
          <li>
            <span style={{ fontWeight: 600 }}>Microchip:</span> {health.microchipped ? "Yes" : "No"}
          </li>
          <li>
            <span style={{ fontWeight: 600 }}>Status:</span> {health.status || "Healthy"}
          </li>
          {health.specialNeeds &&
            <li style={{ gridColumn: "span 2", fontStyle: "italic", color: "var(--accent)" }}>
              Special: {health.specialNeeds}
            </li>
          }
        </ul>
      </div>
      <div
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 11, marginTop: 15, marginBottom: 2 }}>
        <span className="sr-only">Adoption contact options</span>
        <a
          href={mailtoHref}
          className="btn"
          style={{
            background: "var(--primary)",
            color: "var(--button-text)",
            fontWeight: 700,
            padding: "12px 0px",
            borderRadius: 8,
            textDecoration: "none",
            display: "block",
            width: "94%",
            margin: "0 auto",
            fontSize: 18,
            marginBottom: 7,
            textAlign: "center"
          }}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Express interest in ${pet.name} by email`}
        >
          I'm Interested – Email
        </a>
        <a
          href={whatsappHref}
          className="btn"
          style={{
            background: "#25D366",
            color: "#fff",
            fontWeight: 700,
            padding: "12px 0px",
            borderRadius: 8,
            textDecoration: "none",
            display: "block",
            width: "94%",
            margin: "0 auto",
            fontSize: 18,
            textAlign: "center",
          }}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Express interest in ${pet.name} via WhatsApp`}
        >
          I'm Interested – WhatsApp
        </a>
      </div>
    </section>
  );
}

export default PetDetail;
