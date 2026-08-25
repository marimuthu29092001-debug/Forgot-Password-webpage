import React, { useState, useEffect } from 'react';
import StacklyLogo from '../common/StacklyLogo';
import { validateEmail } from '../../utils/validation';
import { simulateDelay } from '../../utils/mockData';
import { loginWithEmail, isFirebaseConfigured } from '../../services/firebase';

/**
 * Clean Enterprise Login Card Component
 */
export default function LoginCard({
  onForgotPassword,
  onLoginSuccess,
  prefilledEmail = '',
  userAccounts = {},
  onToast
}) {
  const [email, setEmail] = useState(typeof prefilledEmail === 'string' && prefilledEmail ? prefilledEmail : 'admin@oneenterprise.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [generalSuccess, setGeneralSuccess] = useState('');

  useEffect(() => {
    if (typeof prefilledEmail === 'string' && prefilledEmail) {
      setEmail(prefilledEmail);
    }
  }, [prefilledEmail]);

  const handleFillDemo = (type = 'admin') => {
    if (type === 'admin') {
      setEmail('admin@oneenterprise.com');
      setPassword('admin123');
    } else {
      setEmail('hr@oneenterprise.com');
      setPassword('hr12345');
    }
    setErrors({});
    setGeneralError('');
    if (onToast) {
      onToast({
        type: 'info',
        title: 'Credentials Loaded',
        message: `Filled ${type.toUpperCase()} demo account details.`
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setGeneralSuccess('');

    const emailVal = validateEmail(email);
    const newErrors = {};

    if (!email || email.trim() === '') {
      newErrors.email = 'Username / Email is required';
    }

    if (!password) {
      newErrors.password = 'Password is required to sign in';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      // 1. Firebase Authentication if configured in .env
      if (isFirebaseConfigured()) {
        const fbResult = await loginWithEmail(email.trim(), password);
        if (fbResult.success) {
          setGeneralSuccess(`Welcome back! Authenticated as ${email.trim()}.`);
          if (onLoginSuccess) onLoginSuccess({ email: email.trim(), user: fbResult.user });
          setIsLoading(false);
          return;
        } else if (!fbResult.isSimulated) {
          setGeneralError(fbResult.message);
          setIsLoading(false);
          return;
        }
      }

      // 2. Local State Authentication (Supports demo accounts and newly reset passwords)
      await simulateDelay(600);

      const normalized = email.trim().toLowerCase();
      const storedPassword = userAccounts[normalized];

      // If user reset this password during forgot password flow
      if (storedPassword && password !== storedPassword) {
        setGeneralError('Invalid password. Please use your newly reset password or reset it again.');
        setIsLoading(false);
        return;
      }

      setGeneralSuccess(`Welcome back! Successfully logged in as ${email.trim()}.`);
      if (onToast) {
        onToast({
          type: 'success',
          title: 'Login Successful',
          message: `Authenticated as ${email.trim()}`
        });
      }

      if (onLoginSuccess) {
        onLoginSuccess({ email: email.trim() });
      }
    } catch (err) {
      setGeneralError('An unexpected authentication error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      {/* Brand Header */}
      <div className="brand-header">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.65rem' }}>
          <StacklyLogo size="small" />
        </div>
        <h1 className="brand-main-title">One Enterprise</h1>
        <p className="brand-sub-title">One Enterprise Cloud Platform</p>
      </div>

      <h2 className="section-heading">Login to Platform</h2>

      {generalError && (
        <div className="alert-box alert-error">{generalError}</div>
      )}

      {generalSuccess && (
        <div className="alert-box alert-success">{generalSuccess}</div>
      )}

      {/* Demo Mode Box Matching Screenshot */}
      <div className="demo-mode-card">
        <div className="demo-title">Demo mode</div>
        <div className="demo-credentials">
          <div>Admin: <strong>admin@oneenterprise.com</strong> / admin123</div>
          <div>HR: <strong>hr@oneenterprise.com</strong> / hr12345</div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button
            type="button"
            className="demo-auto-btn"
            onClick={() => handleFillDemo('admin')}
          >
            Auto Fill Admin
          </button>
          <button
            type="button"
            className="demo-auto-btn"
            style={{ background: '#0d5cb6' }}
            onClick={() => handleFillDemo('hr')}
          >
            Auto Fill HR
          </button>
        </div>
      </div>

      <form onSubmit={handleLogin} noValidate>
        {/* Username / Email */}
        <div className="form-field">
          <label className="form-label" htmlFor="login-username">Username</label>
          <div className="input-container">
            <input
              id="login-username"
              type="text"
              className={`clean-input ${errors.email ? 'error' : ''}`}
              placeholder="admin@oneenterprise.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
            />
          </div>
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        {/* Password */}
        <div className="form-field">
          <label className="form-label" htmlFor="login-password">Password</label>
          <div className="input-container">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              className={`clean-input has-toggle ${errors.password ? 'error' : ''}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
            />
            <button
              type="button"
              className="eye-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>

        {/* Login Button */}
        <button
          id="login-btn"
          type="submit"
          className="btn-submit"
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Login'}
        </button>
      </form>

      {/* Forgot Password Link Row matching screenshot */}
      <div className="bottom-link-row">
        <span>Forgot Password? </span>
        <button
          type="button"
          id="forgot-password-click-here"
          className="clickable-link"
          onClick={() => onForgotPassword(typeof email === 'string' ? email : '')}
        >
          Click Here
        </button>
      </div>
    </div>
  );
}
