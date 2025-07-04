import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPetByIdWithEnrichment } from "../api";

/**
 * PUBLIC_INTERFACE
 * PetDetail - Page showing full details for a pet.
 * Used for direct link access (not modal overlay).
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

  // Construct mailto and WhatsApp links
  const mailtoHref = `mailto:?subject=Interested in adopting ${encodeURIComponent(
    pet.name
  )}&body=Hi, I'm interested in ${pet.name} (${pet.breed}) at ${pet.location}.`;
  const whatsappText = `Hi! I'm interested in adopting ${pet.name} (${pet.breed}) at ${pet.location}.`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;

  return (
    <section
      style={{
        maxWidth: 540,
        margin: "2rem auto",
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        borderRadius: 18,
        padding: "2rem",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        color: "var(--text-primary)",
        position: "relative",
      }}
      aria-label={`Details about ${pet.name}`}
    >
      <button
        aria-label="Back to list"
        style={{
          background: "transparent",
          border: "none",
          color: "var(--text-secondary)",
          fontWeight: 600,
          fontSize: 18,
          position: "absolute",
          left: 20,
          top: 20,
          cursor: "pointer",
        }}
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      <img
        src={pet.imageURL}
        alt={pet.name}
        style={{
          width: "100%",
          maxHeight: 260,
          objectFit: "cover",
          borderRadius: 12,
          marginBottom: 18,
          background: "#eee",
        }}
      />
      <h2 style={{ margin: "4px 0 10px", fontSize: 32, fontWeight: 800 }}>
        {pet.name}
      </h2>
      <div style={{ fontSize: 17, color: "var(--text-secondary)", marginBottom: 6 }}>
        {pet.breed} · {pet.type && pet.type.charAt(0).toUpperCase() + pet.type.substring(1)}
      </div>
      <div style={{ fontSize: 16, opacity: 0.92, marginBottom: 6 }}>
        Age: {pet.age < 12 ? `${pet.age} months` : `${Math.floor(pet.age / 12)} years`}
      </div>
      <div style={{ fontSize: 16, color: "var(--text-primary)", opacity: 0.82, marginBottom: 12 }}>
        Location: {pet.location}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 15, margin: "32px 0 0" }}>
        <a
          href={mailtoHref}
          className="btn"
          style={{
            background: "var(--button-bg)",
            color: "var(--button-text)",
            fontWeight: 600,
            padding: "9px 28px",
            borderRadius: 8,
            textDecoration: "none",
            display: "inline-block",
            fontSize: 16,
          }}
          target="_blank" rel="noopener noreferrer"
        >
          Email to Adopt
        </a>
        <a
          href={whatsappHref}
          className="btn"
          style={{
            background: "#25D366",
            color: "#fff",
            fontWeight: 600,
            padding: "9px 28px",
            borderRadius: 8,
            textDecoration: "none",
            display: "inline-block",
            fontSize: 16,
          }}
          target="_blank" rel="noopener noreferrer"
        >
          WhatsApp
        </a>
      </div>
    </section>
  );
}

export default PetDetail;
