import React from 'react';

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

export default Footer;
