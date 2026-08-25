import React, { useState, useEffect } from 'react';
import { validateEmail } from '../../utils/validation';
import { simulateDelay } from '../../utils/mockData';
import { loginWithEmail, isFirebaseConfigured } from '../../services/firebase';

/**
 * Modern 3D Blue Theme - Sign In Component
 * Matches the user reference image pixel-for-pixel
 */
export default function LoginCard({
  onForgotPassword,
  onLoginSuccess,
  onNavigateTo404,
  prefilledEmail = '',
  userAccounts = {},
  onToast
}) {
  const [username, setUsername] = useState(
    typeof prefilledEmail === 'string' && prefilledEmail ? prefilledEmail : 'admin@oneenterprise.com'
  );
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [showOtherMenu, setShowOtherMenu] = useState(false);

  useEffect(() => {
    if (typeof prefilledEmail === 'string' && prefilledEmail) {
      setUsername(prefilledEmail);
    }
  }, [prefilledEmail]);

  const handleFillDemo = (type = 'admin') => {
    if (type === 'admin') {
      setUsername('admin@oneenterprise.com');
      setPassword('admin123');
    } else {
      setUsername('hr@oneenterprise.com');
      setPassword('hr12345');
    }
    setShowOtherMenu(false);
    setErrors({});
    setGeneralError('');
    if (onToast) {
      onToast({
        type: 'info',
        title: 'Demo Loaded',
        message: `Filled ${type.toUpperCase()} credentials.`
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setGeneralError('');

    const newErrors = {};
    if (!username || username.trim() === '') {
      newErrors.username = 'User Name is required';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      // 1. Firebase Authentication if configured
      if (isFirebaseConfigured()) {
        const fbResult = await loginWithEmail(username.trim(), password);
        if (fbResult.success) {
          if (onToast) {
            onToast({
              type: 'success',
              title: 'Signed In',
              message: `Welcome back, ${username.trim()}!`
            });
          }
          if (onLoginSuccess) onLoginSuccess({ email: username.trim(), user: fbResult.user });
          setIsLoading(false);
          return;
        } else if (!fbResult.isSimulated) {
          setGeneralError(fbResult.message);
          setIsLoading(false);
          return;
        }
      }

      // 2. Local State Authentication
      await simulateDelay(500);

      const normalized = username.trim().toLowerCase();
      const storedPassword = userAccounts[normalized];

      if (storedPassword && password !== storedPassword) {
        setGeneralError('Invalid password. Please enter your correct or newly reset password.');
        setIsLoading(false);
        return;
      }

      if (onToast) {
        onToast({
          type: 'success',
          title: 'Sign In Successful',
          message: `Logged in as ${username.trim()}`
        });
      }

      if (onLoginSuccess) {
        onLoginSuccess({ email: username.trim() });
      }
    } catch (err) {
      setGeneralError('Authentication failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-content-inner">
      {/* Title & Subtitle */}
      <h1 className="form-main-title">Sign in</h1>
      <p className="form-sub-title">Lorem ipsum dolor sit amet, consectetuer adipiscing elit</p>

      {generalError && (
        <div className="alert-box alert-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{generalError}</span>
        </div>
      )}

      <form onSubmit={handleLogin} noValidate>
        {/* User Name Input with Silhouette Icon */}
        <div className="form-input-group">
          <div className={`form-input-box ${errors.username ? 'has-error' : ''}`}>
            <span className="input-icon-left">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input
              id="signin-username"
              type="text"
              className="form-clean-input"
              placeholder="User Name"
              value={username}
              autoComplete="username"
              onChange={(e) => {
                setUsername(e.target.value);
                if (errors.username) setErrors({ ...errors, username: '' });
              }}
            />
          </div>
          {errors.username && <div className="field-error-msg">{errors.username}</div>}
        </div>

        {/* Password Input with Lock Icon & SHOW/HIDE Toggle */}
        <div className="form-input-group">
          <div className={`form-input-box ${errors.password ? 'has-error' : ''}`}>
            <span className="input-icon-left">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <input
              id="signin-password"
              type={showPassword ? 'text' : 'password'}
              className="form-clean-input"
              placeholder="Password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
            />
            <button
              type="button"
              id="toggle-show-password-btn"
              className="btn-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'HIDE' : 'SHOW'}
            </button>
          </div>
          {errors.password && <div className="field-error-msg">{errors.password}</div>}
        </div>

        {/* Remember me & Forgot Password Row */}
        <div className="form-options-row">
          <label className="remember-me-label" onClick={() => setRememberMe(!rememberMe)}>
            <div className={`custom-checkbox ${rememberMe ? 'checked' : ''}`}>
              {rememberMe && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span>Remember me</span>
          </label>

          <button
            type="button"
            id="forgot-password-link"
            className="link-forgot-pass"
            onClick={() => onForgotPassword(username)}
          >
            Forgot Password?
          </button>
        </div>

        {/* Primary Action Button ("Sign in") */}
        <button
          id="signin-submit-btn"
          type="submit"
          className="btn-primary-signin"
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign in'}
        </button>
      </form>

      {/* Divider */}
      <div className="divider-or-row">
        <div className="divider-line" />
        <span className="divider-text">Or</span>
        <div className="divider-line" />
      </div>

      {/* Secondary Action Button ("Sign in with other") */}
      <button
        id="signin-with-other-btn"
        type="button"
        className="btn-secondary-outline"
        onClick={() => setShowOtherMenu(!showOtherMenu)}
      >
        <span>Sign in with other</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: showOtherMenu ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown for "Sign in with other" */}
      {showOtherMenu && (
        <div className="demo-dropdown-menu">
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Quick Demo & OAuth Providers
          </div>
          <button
            type="button"
            className="demo-btn-item"
            onClick={() => handleFillDemo('admin')}
          >
            <span>👑 Admin Demo Account</span>
            <span style={{ fontSize: '0.72rem', color: '#0066f5' }}>Auto-Fill</span>
          </button>
          <button
            type="button"
            className="demo-btn-item"
            onClick={() => handleFillDemo('hr')}
          >
            <span>👔 HR Demo Account</span>
            <span style={{ fontSize: '0.72rem', color: '#0066f5' }}>Auto-Fill</span>
          </button>
          <button
            type="button"
            className="demo-btn-item"
            onClick={() => {
              setShowOtherMenu(false);
              if (onNavigateTo404) onNavigateTo404('Google Single Sign-On');
            }}
          >
            <span>🌐 Google Single Sign-On</span>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Connect</span>
          </button>
        </div>
      )}

      {/* Bottom Sign Up Link */}
      <div className="bottom-signup-row">
        <span>Don't have an account?</span>
        <button
          type="button"
          className="link-signup"
          onClick={() => {
            if (onToast) {
              onToast({
                type: 'info',
                title: 'Sign Up Portal',
                message: 'Self-service registration demo.'
              });
            }
          }}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
