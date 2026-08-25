import React, { useState } from 'react';
import InputField from '../common/InputField';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { validateEmail } from '../../utils/validation';
import { simulateDelay } from '../../utils/mockData';

/**
 * Forgot Password Step 1: Email Validation & OTP Request
 */
export default function EmailStep({
  email,
  setEmail,
  onNext,
  onBackToLogin,
  onToast
}) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertMsg('');
    setError('');

    const validation = validateEmail(email);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setIsLoading(true);

    try {
      await simulateDelay(600);

      if (onToast) {
        onToast({
          type: 'success',
          title: 'Verification Code Dispatched',
          message: `A 6-digit security code was sent to ${email}`
        });
      }

      onNext(email.trim());
    } catch (err) {
      setAlertMsg('Failed to dispatch verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card-content-transition">
      <div className="card-header">
        <h2 className="card-title">Forgot Password?</h2>
        <p className="card-subtitle">
          Enter your email address and we'll send you a 6-digit one-time passcode (OTP) to reset your password.
        </p>
      </div>

      {alertMsg && (
        <Alert
          type="error"
          message={alertMsg}
          onClose={() => setAlertMsg('')}
        />
      )}

      <form onSubmit={handleSubmit} noValidate>
        <InputField
          id="forgot-email-input"
          label="Email Address"
          type="email"
          value={typeof email === 'string' ? email : ''}
          placeholder="e.g. yourname@example.com"
          required
          autoFocus
          autoComplete="email"
          error={error}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          helperText="Any valid email address can be used to test the password reset flow."
          leftIcon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          }
        />

        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Button
            id="send-code-btn"
            type="submit"
            variant="primary"
            isLoading={isLoading}
            rightIcon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            }
          >
            Send Verification Code
          </Button>

          <Button
            id="back-to-signin-btn"
            type="button"
            variant="ghost"
            onClick={() => onBackToLogin(typeof email === 'string' ? email : '')}
            leftIcon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            }
          >
            Back to Sign In
          </Button>
        </div>
      </form>
    </div>
  );
}
