import React from "react";
import { motion } from "framer-motion";

/**
 * PUBLIC_INTERFACE
 * LoadingSpinner - Animated spinner for loading states.
 */
function LoadingSpinner({ size = 36, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-8" role="status" aria-live="polite">
      <motion.div
        className="rounded-full border-4 border-t-primary border-gray-200"
        style={{ width: size, height: size, borderTopColor: "var(--primary)" }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.95, ease: "linear" }}
        aria-label="Loading"
      />
      {message && <div className="mt-4 text-gray-500 font-medium">{message}</div>}
    </div>
  );
}

export default LoadingSpinner;
