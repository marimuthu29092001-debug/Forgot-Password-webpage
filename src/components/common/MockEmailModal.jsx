import React, { useState } from 'react';

/**
 * Interactive simulated email popup modal
 * Demonstrates the email received with the OTP code and allows one-click auto-fill
 */
export default function MockEmailModal({
  isOpen,
  onClose,
  email,
  otpCode,
  onFillOtp
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(otpCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFill = () => {
    if (onFillOtp) {
      onFillOtp(otpCode);
    }
    onClose();
  };

  return (
    <div className="mock-email-modal-overlay" onClick={onClose}>
      <div
        className="mock-email-window"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="mock-email-header">
          <div className="mock-inbox-badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span>Simulated Mailbox • Stackly Cloud Mail</span>
          </div>
          <button
            type="button"
            className="toast-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="mock-email-body">
          <div style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <div><strong>From:</strong> security@stackly.io (Stackly Security Service)</div>
            <div><strong>To:</strong> {email || 'user@example.com'}</div>
            <div><strong>Subject:</strong> Your Stackly Password Reset Verification Code</div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Reset your Stackly password
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              We received a request to reset the password for your account associated with <span className="email-highlight">{email}</span>. Use the 6-digit verification code below to proceed:
            </p>
          </div>

          <div className="mock-otp-highlight-box">
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)' }}>
              Verification Code (Valid for 10 minutes)
            </div>
            <div className="mock-otp-number">{otpCode}</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Never share this code with anyone. Stackly staff will never ask for your code.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCopy}
              style={{ flex: 1 }}
            >
              {copied ? '✓ Copied to Clipboard' : '📋 Copy Code'}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleFill}
              style={{ flex: 1 }}
            >
              ⚡ Auto-Fill & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
