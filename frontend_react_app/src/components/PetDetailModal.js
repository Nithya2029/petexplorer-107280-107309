import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

// PUBLIC_INTERFACE
function PetDetailModal({ pet, onClose }) {
  /**
   * PUBLIC_INTERFACE
   * Modal showing detailed pet info and adoption contact options, including initial keyboard focus and ESC-close.
   * 
   * @param {object} pet - Pet object with details.
   * @param {function} onClose - Callback to close modal.
   */
  const closeBtnRef = useRef(null);
  useEffect(() => {
    // Focus on close button when modal opens
    if (closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
    // Keyboard trap: close on ESC key
    const escListener = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener("keydown", escListener);
    return () => {
      document.removeEventListener("keydown", escListener);
    };
  }, [onClose]);

  if (!pet) return null;

  // Construct mailto and WhatsApp links
  const mailtoHref = `mailto:?subject=Interested in adopting ${encodeURIComponent(
    pet.name
  )}&body=Hi, I'm interested in ${pet.name} (${pet.breed}) at ${pet.location}.`;
  const whatsappText = `Hi! I'm interested in adopting ${pet.name} (${pet.breed}) at ${pet.location}.`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;

  // Framer motion variants for background and modal
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
            borderRadius: 12,
            maxWidth: 410,
            width: "90vw",
            boxShadow: "0 4px 28px rgba(0,0,0,0.19)",
            padding: 28,
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
              fontSize: 22,
              cursor: "pointer"
            }}
            whileTap={{ scale: 0.80, rotate: -38 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
          >
            ×
          </motion.button>
          <motion.img
            src={pet.imageURL}
            alt={`Photo of ${pet.name}, a ${pet.breed}`}
            aria-label={`Photo of ${pet.name}, ${pet.breed}, in ${pet.location}`}
            style={{
              width: "100%",
              maxHeight: 190,
              objectFit: "cover",
              borderRadius: 10,
              marginBottom: 14,
              background: "#eee"
            }}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12, duration: 0.38 }}
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
            <motion.a
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
              aria-label={`Email to Adopt ${pet.name}`}
              whileTap={{ scale: 0.91 }}
            >
              Email to Adopt
            </motion.a>
            <motion.a
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
              aria-label={`WhatsApp to Adopt ${pet.name}`}
              whileTap={{ scale: 0.91 }}
            >
              WhatsApp
            </motion.a>
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
