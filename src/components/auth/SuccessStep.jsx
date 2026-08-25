import React from 'react';
import Button from '../common/Button';

/**
 * Forgot Password Step 4: Success confirmation screen
 */
export default function SuccessStep({ email, onBackToLogin }) {
  return (
    <div className="card-content-transition success-screen">
      <div className="success-badge-wrapper">
        <div className="success-ripple" />
        <div className="success-badge-circle">
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>

      <h2 className="card-title">Password Reset Complete!</h2>
      <p className="card-subtitle" style={{ maxWidth: '380px', margin: '0 auto' }}>
        Your Stackly account password has been securely updated. You can now sign in using your new credentials.
      </p>

      <div className="success-info-card">
        <div className="info-card-row">
          <span className="info-label">Account</span>
          <span className="info-val">{typeof email === 'string' ? email : 'your-email@example.com'}</span>
        </div>
        <div className="info-card-row">
          <span className="info-label">Security Status</span>
          <span className="info-val" style={{ color: 'var(--success)' }}>● Active & Protected</span>
        </div>
        <div className="info-card-row">
          <span className="info-label">Active Sessions</span>
          <span className="info-val">Terminated across devices</span>
        </div>
      </div>

      <Button
        id="back-to-login-final-btn"
        type="button"
        variant="primary"
        onClick={() => onBackToLogin(typeof email === 'string' ? email : '')}
        rightIcon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        }
      >
        Sign In with New Password
      </Button>
    </div>
  );
}
