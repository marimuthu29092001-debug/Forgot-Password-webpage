import React from 'react';
import StacklyLogo from '../common/StacklyLogo';

/**
 * Application Header with Official Stackly Logo
 */
export default function Navbar({
  onResetView,
  hasActiveOtp = false,
  onOpenInbox
}) {
  return (
    <header className="navbar">
      <button
        type="button"
        className="brand-logo"
        onClick={onResetView}
        title="Stackly Home"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <StacklyLogo size="medium" />
      </button>

      {hasActiveOtp && (
        <div className="nav-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onOpenInbox}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
          >
            📬 View Mock Inbox
          </button>
        </div>
      )}
    </header>
  );
}
