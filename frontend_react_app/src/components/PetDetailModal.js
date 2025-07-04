import React from "react";
import PropTypes from "prop-types";

// PUBLIC_INTERFACE
function PetDetailModal({ pet, onClose }) {
  /**
   * PUBLIC_INTERFACE
   * Modal showing detailed pet info and adoption contact options.
   * 
   * @param {object} pet - Pet object with details.
   * @param {function} onClose - Callback to close modal.
   */
  if (!pet) return null;

  // Construct mailto and WhatsApp links
  const mailtoHref = `mailto:?subject=Interested in adopting ${encodeURIComponent(
    pet.name
  )}&body=Hi, I'm interested in ${pet.name} (${pet.breed}) at ${pet.location}.`;
  const whatsappText = `Hi! I'm interested in adopting ${pet.name} (${pet.breed}) at ${pet.location}.`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Details about ${pet.name}`}
      tabIndex={-1}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "fadein .25s",
      }}
      onClick={onClose} // background click closes
    >
      <div
        style={{
          background: "var(--bg-primary)",
          color: "var(--text-primary)",
          borderRadius: 12,
          maxWidth: 410,
          width: "90vw",
          boxShadow: "0 4px 28px rgba(0,0,0,0.19)",
          padding: 28,
          position: "relative",
        }}
        role="document"
        onClick={e => e.stopPropagation()} // do not close when clicking modal
      >
        <button
          aria-label="Close"
          onClick={onClose}
          style={{
            position: "absolute",
            right: 12,
            top: 12,
            background: "transparent",
            border: "none",
            color: "var(--text-secondary)",
            fontSize: 22,
            cursor: "pointer"
          }}
        >
          ×
        </button>
        <img
          src={pet.imageURL}
          alt={pet.name}
          style={{
            width: "100%",
            maxHeight: 190,
            objectFit: "cover",
            borderRadius: 10,
            marginBottom: 14,
            background: "#eee"
          }}
        />
        <h2 style={{ margin: "6px 0 6px", fontSize: 26, fontWeight: 700 }}>{pet.name}</h2>
        <div style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 4 }}>
          {pet.breed} · {pet.type && pet.type.charAt(0).toUpperCase() + pet.type.substring(1)}
        </div>
        <div style={{ fontSize: 15, opacity: .9, marginBottom: 4 }}>
          Age: {pet.age < 12 ? `${pet.age} months` : `${Math.floor(pet.age / 12)} years`}
        </div>
        <div style={{ fontSize: 15, color: "var(--text-primary)", opacity: 0.8, marginBottom: 8 }}>
          Location: {pet.location}
        </div>

        {/* Contact/Adopt Buttons */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, margin: "18px 0 0" }}>
          <a
            href={mailtoHref}
            className="btn"
            style={{
              background: "var(--button-bg)",
              color: "var(--button-text)",
              fontWeight: 600,
              padding: "8px 20px",
              borderRadius: 8,
              textDecoration: "none",
              display: "inline-block"
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
              padding: "8px 20px",
              borderRadius: 8,
              textDecoration: "none",
              display: "inline-block"
            }}
            target="_blank" rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

PetDetailModal.propTypes = {
  pet: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    breed: PropTypes.string,
    age: PropTypes.number,
    location: PropTypes.string,
    imageURL: PropTypes.string,
    type: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

export default PetDetailModal;
