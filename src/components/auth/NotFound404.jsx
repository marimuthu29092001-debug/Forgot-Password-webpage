import React from 'react';
import Button from '../common/Button';

/**
 * Modern Clean 404 Not Found Page Component
 */
export default function NotFound404({
  provider = 'Google',
  onBackToLogin
}) {
  return (
    <div className="auth-card card-content-transition not-found-screen">
      {/* 404 Header Badge */}
      <div className="not-found-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>Error 404 • Page Not Found</span>
      </div>

      {/* Holographic Gradient 404 Display */}
      <div className="glitch-404-box">
        <div className="glitch-404-number">404</div>
      </div>

      <h2 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
        {provider} Service Unavailable
      </h2>
      
      <p className="card-subtitle" style={{ maxWidth: '380px', margin: '0 auto 2rem', fontSize: '0.92rem' }}>
        The requested <strong style={{ color: 'var(--accent-primary)' }}>{provider} Single Sign-On</strong> page or service could not be found. Please sign in with your email or return to the home page.
      </p>

      {/* Action Navigation */}
      <div style={{ width: '100%' }}>
        <Button
          id="back-to-login-from-404"
          type="button"
          variant="primary"
          onClick={onBackToLogin}
          leftIcon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          }
        >
          Return to Sign In
        </Button>
      </div>
    </div>
  );
}
