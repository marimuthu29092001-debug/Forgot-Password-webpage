import React, { useState } from 'react';
import InputField from '../common/InputField';
import Button from '../common/Button';
import Alert from '../common/Alert';
import PasswordStrength from '../common/PasswordStrength';
import { checkPasswordStrength, validatePasswordMatch } from '../../utils/validation';
import { simulateDelay } from '../../utils/mockData';

/**
 * Forgot Password Step 3: Reset Password with live strength meter, auto-suggest, & confirmation
 */
export default function ResetPasswordStep({
  email,
  onResetSuccess,
  onToast
}) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const strengthInfo = checkPasswordStrength(newPassword);

  const handleSuggestPassword = () => {
    const suggested = 'Stackly#Pass2026';
    setNewPassword(suggested);
    setConfirmPassword(suggested);
    setErrors({});
    setGeneralError('');
    if (onToast) {
      onToast({
        type: 'info',
        title: 'Strong Password Generated',
        message: 'Filled a secure password fulfilling all security requirements.'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    const newErrors = {};

    if (!newPassword || newPassword.trim() === '') {
      newErrors.newPassword = 'New password is required';
    } else if (!strengthInfo.isValid) {
      newErrors.newPassword = 'Password must meet all 4 requirements below';
      setGeneralError('Please ensure your password meets all 4 security criteria.');
    }

    const matchVal = validatePasswordMatch(newPassword, confirmPassword);
    if (!matchVal.isValid) {
      newErrors.confirmPassword = matchVal.error;
      if (!generalError) setGeneralError(matchVal.error);
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await simulateDelay(700);

      if (onToast) {
        onToast({
          type: 'success',
          title: 'Password Updated',
          message: 'Your Stackly credentials have been securely updated.'
        });
      }

      onResetSuccess(newPassword);
    } catch (err) {
      setGeneralError('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card-content-transition">
      <div className="card-header">
        <h2 className="card-title">Reset Password</h2>
        <p className="card-subtitle">
          Create a new strong password for <span className="email-highlight">{email}</span>.
        </p>
      </div>

      {generalError && (
        <Alert
          type="error"
          message={generalError}
          onClose={() => setGeneralError('')}
        />
      )}

      <form onSubmit={handleSubmit} noValidate>
        <InputField
          id="new-password-input"
          label="New Password"
          type="password"
          value={newPassword}
          placeholder="Create a strong password"
          required
          autoFocus
          autoComplete="new-password"
          error={errors.newPassword}
          rightAction={
            <button
              type="button"
              className="quick-suggest-btn"
              onClick={handleSuggestPassword}
              title="Generate a secure strong password"
            >
              ⚡ Suggest Strong
            </button>
          }
          onChange={(e) => {
            setNewPassword(e.target.value);
            if (errors.newPassword) setErrors({ ...errors, newPassword: '' });
          }}
          leftIcon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          }
        />

        {/* Live Password Strength Meter */}
        <PasswordStrength password={newPassword} />

        <InputField
          id="confirm-password-input"
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          placeholder="Re-enter your new password"
          required
          autoComplete="new-password"
          error={errors.confirmPassword}
          isValid={confirmPassword && newPassword === confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
          }}
          helperText={
            confirmPassword && newPassword === confirmPassword
              ? '✓ Passwords match'
              : ''
          }
          leftIcon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          }
        />

        <div style={{ marginTop: '1.5rem' }}>
          <Button
            id="reset-password-submit-btn"
            type="submit"
            variant="primary"
            isLoading={isLoading}
          >
            Update & Save Password
          </Button>
        </div>
      </form>
    </div>
  );
}
