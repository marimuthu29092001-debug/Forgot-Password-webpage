import React, { useState, useEffect } from 'react';
import OtpInput from '../common/OtpInput';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { validateOtp } from '../../utils/validation';
import { simulateDelay } from '../../utils/mockData';

/**
 * Forgot Password Step 2: 6-Digit OTP Verification
 */
export default function OtpStep({
  email,
  expectedOtp,
  onVerifySuccess,
  onResendOtp,
  onEditEmail,
  onOpenInbox,
  onToast
}) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [hasShake, setHasShake] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(45);
  const [isResending, setIsResending] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleVerify = async (codeToVerify) => {
    setError('');
    const code = codeToVerify || otp.join('');

    const validation = validateOtp(code, expectedOtp);
    if (!validation.isValid) {
      setError(validation.error);
      setHasShake(true);
      setAttempts((prev) => prev + 1);
      setTimeout(() => setHasShake(false), 500);
      return;
    }

    setIsLoading(true);

    try {
      await simulateDelay(850);

      if (onToast) {
        onToast({
          type: 'success',
          title: 'OTP Verified',
          message: 'Identity confirmed. Proceed to reset your password.'
        });
      }

      onVerifySuccess();
    } catch (err) {
      setError('Verification service unavailable. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || isResending) return;

    setIsResending(true);
    setError('');
    try {
      await simulateDelay(600);
      const newOtp = onResendOtp();
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
      if (onToast) {
        onToast({
          type: 'info',
          title: 'New OTP Dispatched',
          message: `A fresh 6-digit code has been sent to ${email}`
        });
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="card-content-transition">
      <div className="card-header">
        <h2 className="card-title">Enter Verification Code</h2>
        <p className="card-subtitle">
          We sent a 6-digit temporary passcode to your email inbox.
        </p>
      </div>

      <div className="edit-email-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-primary)', flexShrink: 0 }}>
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          </svg>
          <span className="email-highlight" style={{ fontSize: '0.85rem' }}>{email}</span>
        </div>
        <button
          type="button"
          className="edit-email-btn"
          onClick={onEditEmail}
          title="Change email"
        >
          Change
        </button>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
        />
      )}

      {/* Simulated Mailbox Quick Helper Banner */}
      <div style={{
        padding: '0.65rem 0.9rem',
        borderRadius: 'var(--radius-md)',
        background: 'var(--accent-subtle)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        fontSize: '0.8rem'
      }}>
        <div style={{ color: 'var(--text-secondary)' }}>
          <span>Test OTP: </span>
          <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', letterSpacing: '0.05em' }}>{expectedOtp}</strong>
        </div>
        <button
          type="button"
          className="btn-fill-demo"
          onClick={onOpenInbox}
        >
          View Email 📬
        </button>
      </div>

      <div className="otp-container">
        <OtpInput
          value={otp}
          onChange={(newOtp) => {
            setOtp(newOtp);
            if (error) setError('');
          }}
          onComplete={(completedCode) => {
            handleVerify(completedCode);
          }}
          hasError={hasShake || Boolean(error)}
          disabled={isLoading}
        />

        <div className="otp-actions-row">
          <span>Didn't receive the code?</span>
          <button
            type="button"
            className="resend-btn"
            onClick={handleResend}
            disabled={resendTimer > 0 || isResending}
          >
            {resendTimer > 0 ? (
              <>
                <span>Resend code in</span>
                <span className="timer-tag">{resendTimer}s</span>
              </>
            ) : (
              <span>Resend Code</span>
            )}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.25rem' }}>
        <Button
          id="verify-otp-btn"
          type="button"
          variant="primary"
          isLoading={isLoading}
          onClick={() => handleVerify()}
          disabled={otp.join('').length < 6}
        >
          Verify & Continue
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={onEditEmail}
          leftIcon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          }
        >
          Back to Email Entry
        </Button>
      </div>
    </div>
  );
}
