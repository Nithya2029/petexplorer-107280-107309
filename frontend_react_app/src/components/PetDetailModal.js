import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

// Carousel utility (local, simple)
function Carousel({ images, alt, initial = 0 }) {
  const [idx, setIdx] = useState(initial);
  if (!Array.isArray(images) || images.length === 0) return null;
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);
  // Accessible indicators text
  return (
    <div style={{ position: "relative", marginBottom: 14 }}>
      <img
        src={images[idx]}
        alt={alt || ""}
        style={{
          width: "100%",
          maxHeight: 190,
          objectFit: "cover",
          borderRadius: 10,
          background: "#eee",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
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
              position: "absolute",
              left: 4,
              top: "48%",
              background: "rgba(255,255,255,.84)",
              border: "none",
              borderRadius: 18,
              width: 32,
              height: 32,
              fontSize: 20,
              color: "#444",
              cursor: "pointer",
              zIndex: 3,
              boxShadow: "0 1px 4px #ccc",
            }}
          >&#8592;</button>
          <button
            onClick={next}
            aria-label="Show next image"
            style={{
              position: "absolute",
              right: 4,
              top: "48%",
              background: "rgba(255,255,255,.84)",
              border: "none",
              borderRadius: 18,
              width: 32,
              height: 32,
              fontSize: 20,
              color: "#444",
              cursor: "pointer",
              zIndex: 3,
              boxShadow: "0 1px 4px #ccc",
            }}
          >&#8594;</button>
          <div
            style={{
              position: "absolute",
              bottom: 4,
              width: "100%",
              textAlign: "center",
              fontSize: 12,
              color: "#666",
              opacity: 0.85,
              fontWeight: 600,
              letterSpacing: "0.08em"
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
function PetDetailModal({ pet, onClose }) {
  /**
   * PUBLIC_INTERFACE
   * Modal showing detailed pet info, with carousel, health mock info, and a unified contact button.
   */
  const closeBtnRef = useRef(null);
  useEffect(() => {
    if (closeBtnRef.current) closeBtnRef.current.focus();
    const escListener = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", escListener);
    return () => document.removeEventListener("keydown", escListener);
  }, [onClose]);
  if (!pet) return null;

  // Expand image support - support arrays, fallback gracefully
  // Normally, a pet.images array could exist, but we simulate this by repeating imageURL or showing 2-3 images for demo.
  const images = Array.isArray(pet.images) && pet.images.length
    ? pet.images
    : [pet.imageURL, pet.imageURL.replace("3004", "1500") || pet.imageURL, pet.imageURL.replace("bpc", "9oo") || pet.imageURL].filter(Boolean);

  // Mock up health data for demo: assume if contact is present, health object also exists
  const health = pet.health || {
    vaccinated: !!(pet.type === "dog" || pet.type === "cat"),
    neutered: pet.id && parseInt(String(pet.id).replace(/\D/g,'')) % 2 === 0,
    microchipped: Math.random() > 0.4,
    // If pet.age < 12mo, less likely neutered, more likely microchipped
    specialNeeds: pet.age < 8
      ? "Kitten/Puppy care required"
      : undefined,
    status: pet.age < 8 ? "Puppy/Kitten" : pet.age > 84 ? "Senior" : "Healthy",
  };
  // seed random for consistent results per id in better version

  // Construct contact links
  const specName = [pet.name, pet.breed].filter(Boolean).join(' ');
  const mailtoHref = `mailto:?subject=Interested in adopting ${encodeURIComponent(
    pet.name
  )}&body=Hi, I'm interested in ${pet.name} (${pet.breed}, ${pet.type}) at ${pet.location}.`;
  const whatsappText = `Hi! I'm interested in adopting ${pet.name} (${pet.breed}, ${pet.type}) at ${pet.location}.`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;

  // Framer modal variants (as before)
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.18 } }
  };
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.88, y: 40 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 25 } },
    exit: { opacity: 0, scale: 0.92, y: 26 }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="modal-backdrop"
        role="dialog"
        aria-modal="true"
        aria-label={`Details about ${pet.name}`}
        tabIndex={-1}
        className="pet-detail-modal-backdrop"
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 2000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        <motion.div
          key="pet-detail-modal"
          style={{
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
            borderRadius: 18,
            maxWidth: 465,
            width: "97vw",
            boxShadow: "0 4px 28px rgba(0,0,0,0.19)",
            padding: "32px 26px 26px 26px",
            position: "relative",
          }}
          role="document"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={e => e.stopPropagation()}
        >
          <motion.button
            aria-label="Close"
            ref={closeBtnRef}
            onClick={onClose}
            style={{
              position: "absolute",
              right: 12,
              top: 12,
              background: "transparent",
              border: "none",
              color: "var(--text-secondary)",
              fontSize: 27,
              cursor: "pointer",
              fontWeight: 800
            }}
            whileTap={{ scale: 0.80, rotate: -38 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
          >
            ×
          </motion.button>

          {/* Carousel */}
          <Carousel images={images} alt={`Photos of ${specName}`} />

          <h2 style={{ margin: "4px 0 6px", fontSize: 27, fontWeight: 800, letterSpacing: -0.4 }}>{pet.name}</h2>
          <div style={{ fontSize: 16, color: "var(--text-secondary)", marginBottom: 2, fontWeight: 600 }}>
            {pet.breed}{pet.type ? ` · ${pet.type[0].toUpperCase() + pet.type.substring(1)}` : ""}
          </div>
          <div style={{ fontSize: 15, opacity: 0.9, marginBottom: 2 }}>
            Age: {pet.age < 12 ? `${pet.age} months` : `${Math.floor(pet.age / 12)} years`}
          </div>
          <div style={{ fontSize: 15, color: "var(--text-primary)", opacity: 0.8, marginBottom: 8 }}>
            <span style={{ opacity: 0.98 }}>Location:</span> {pet.location}
          </div>
          {/* Extra details */}
          {pet.description && (
            <div style={{
              fontSize: 15, color: "var(--text-primary)", opacity: 0.92, fontStyle: "italic",
              margin: "8px 0 10px", borderLeft: "3px solid var(--accent)", paddingLeft: 11
            }}>
              {pet.description}
            </div>
          )}
          {/* Health/Status */}
          <div
            role="region"
            aria-label="Pet Health Information"
            style={{
              background: "var(--bg-secondary)",
              border: "1.5px solid var(--border-color)",
              borderRadius: 10,
              padding: "10px 14px",
              margin: "10px 0 18px",
              fontSize: 14,
              color: "var(--text-primary)"
            }}
          >
            <div style={{ marginBottom: 3, fontWeight: 700, color: "var(--primary)" }}>
              Health & Status
            </div>
            <ul style={{
              listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5
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
          {/* Contact */}
          <div
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 11, marginTop: 9 }}>
            <span className="sr-only">Adoption contact options</span>
            <a
              href={mailtoHref}
              className="btn"
              style={{
                background: "var(--primary)",
                color: "var(--button-text)",
                fontWeight: 700,
                padding: "11px 0px",
                borderRadius: 8,
                textDecoration: "none",
                display: "block",
                width: "90%",
                margin: "0 auto",
                fontSize: 17,
                marginBottom: 5,
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
                padding: "11px 0px",
                borderRadius: 8,
                textDecoration: "none",
                display: "block",
                width: "90%",
                margin: "0 auto",
                fontSize: 17,
                textAlign: "center",
              }}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Express interest in ${pet.name} via WhatsApp`}
            >
              I'm Interested – WhatsApp
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
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
