import React, { useState, useEffect } from 'react';
import InputField from '../common/InputField';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { validateEmail } from '../../utils/validation';
import { DEMO_USER, simulateDelay } from '../../utils/mockData';
import { loginWithEmail, loginWithGoogle, isFirebaseConfigured } from '../../services/firebase';

/**
 * Login Card Component with Firebase Authentication & EmailJS Support
 */
export default function LoginCard({
  onForgotPassword,
  onLoginSuccess,
  onNavigateTo404,
  prefilledEmail = '',
  userAccounts = {},
  onToast
}) {
  const [email, setEmail] = useState(typeof prefilledEmail === 'string' ? prefilledEmail : '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [connectingProvider, setConnectingProvider] = useState(null); // 'Google' | 'GitHub' | null
  const [generalError, setGeneralError] = useState('');
  const [generalSuccess, setGeneralSuccess] = useState('');

  useEffect(() => {
    if (typeof prefilledEmail === 'string') {
      setEmail(prefilledEmail);
    }
  }, [prefilledEmail]);

  const handleFillDemo = () => {
    setEmail(DEMO_USER.email);
    setPassword(DEMO_USER.password);
    setErrors({});
    setGeneralError('');
    if (onToast) {
      onToast({
        type: 'info',
        title: 'Demo Credentials Loaded',
        message: 'Click "Sign In" or "Forgot password?" to test the flows!'
      });
    }
  };

  const handleSocialClick = async (provider) => {
    setConnectingProvider(provider);
    if (onToast) {
      onToast({
        type: 'info',
        title: `Connecting to ${provider}`,
        message: `Initiating ${provider} OAuth 2.0 handshake...`,
        duration: 2000
      });
    }

    // If Firebase Google OAuth is configured and provider is Google
    if (provider === 'Google' && isFirebaseConfigured()) {
      try {
        const result = await loginWithGoogle();
        setConnectingProvider(null);
        if (result.success) {
          setGeneralSuccess(`Signed in with Google as ${result.user.email}!`);
          if (onToast) {
            onToast({
              type: 'success',
              title: 'Google Authentication Successful',
              message: `Welcome, ${result.user.displayName || result.user.email}!`
            });
          }
          if (onLoginSuccess) {
            onLoginSuccess({ email: result.user.email, user: result.user });
          }
          return;
        } else {
          setGeneralError(result.message || 'Google sign-in was cancelled.');
          return;
        }
      } catch (err) {
        setConnectingProvider(null);
        setGeneralError('Google Authentication failed.');
        return;
      }
    }

    // Modern model loading delay before redirecting to 404 page
    await simulateDelay(1400);
    setConnectingProvider(null);

    if (onNavigateTo404) {
      onNavigateTo404(provider);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setGeneralSuccess('');

    const emailVal = validateEmail(email);
    const newErrors = {};

    if (!emailVal.isValid) {
      newErrors.email = emailVal.error;
    }

    if (!password) {
      newErrors.password = 'Password is required to sign in';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      // 1. Try Firebase Authentication first if configured
      if (isFirebaseConfigured()) {
        const firebaseResult = await loginWithEmail(email.trim(), password);
        if (firebaseResult.success) {
          setGeneralSuccess(`Welcome back! Authenticated with Firebase as ${email.trim()}.`);
          if (onToast) {
            onToast({
              type: 'success',
              title: 'Firebase Auth Success',
              message: `Logged in as ${email.trim()}`
            });
          }
          if (onLoginSuccess) onLoginSuccess({ email: email.trim(), user: firebaseResult.user });
          setIsLoading(false);
          return;
        } else if (!firebaseResult.isSimulated) {
          setGeneralError(firebaseResult.message);
          setIsLoading(false);
          return;
        }
      }

      // 2. Local State Authentication (Fallback when Firebase is not active)
      await simulateDelay(650);

      const normalizedEmail = email.trim().toLowerCase();
      const storedPassword = userAccounts[normalizedEmail];

      if (storedPassword && password !== storedPassword) {
        setGeneralError('Invalid password. Please use your newly reset password or reset it again.');
        setIsLoading(false);
        return;
      }

      if (normalizedEmail === DEMO_USER.email && !storedPassword && password !== DEMO_USER.password) {
        setGeneralError('Invalid password for demo account. Use Password@2026 or click Forgot Password.');
        setIsLoading(false);
        return;
      }

      setGeneralSuccess(`Welcome back! Successfully authenticated as ${email.trim()}.`);
      if (onToast) {
        onToast({
          type: 'success',
          title: 'Signed In Successfully',
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
    <div className="auth-card card-content-transition" style={{ position: 'relative' }}>
      {/* Modern Model OAuth Connecting Loader Overlay */}
      {connectingProvider && (
        <div className="oauth-loader-overlay">
          <div className="orbit-loader-wrapper">
            <div className="orbit-ring-outer" />
            <div className="orbit-ring-active" />
            <div className="orbit-center-icon">
              {connectingProvider === 'Google' ? (
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#F8FAFC">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              )}
            </div>
          </div>

          <h3 className="oauth-loader-title">Connecting to {connectingProvider}</h3>
          <p className="oauth-loader-subtitle">Establishing secure TLS 1.3 tunnel with {connectingProvider} Single Sign-On...</p>

          <div className="oauth-progress-track">
            <div className="oauth-progress-bar" />
          </div>
        </div>
      )}

      <div className="card-header">
        <h2 className="card-title">Welcome back</h2>
        <p className="card-subtitle">Sign in with your email to access Stackly</p>
      </div>

      {generalError && (
        <Alert
          type="error"
          message={generalError}
          onClose={() => setGeneralError('')}
        />
      )}

      {generalSuccess && (
        <Alert
          type="success"
          message={generalSuccess}
          onClose={() => setGeneralSuccess('')}
        />
      )}

      <form onSubmit={handleLogin} noValidate>
        <InputField
          id="login-email"
          label="Email Address"
          type="email"
          value={typeof email === 'string' ? email : ''}
          placeholder="e.g. yourname@example.com"
          required
          autoComplete="email"
          error={errors.email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({ ...errors, email: '' });
          }}
          leftIcon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          }
        />

        <InputField
          id="login-password"
          label="Password"
          type="password"
          value={password}
          placeholder="••••••••••••"
          required
          autoComplete="current-password"
          error={errors.password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors({ ...errors, password: '' });
          }}
          rightAction={
            <button
              type="button"
              id="forgot-password-link"
              className="forgot-link"
              onClick={() => onForgotPassword(typeof email === 'string' ? email : '')}
            >
              Forgot password?
            </button>
          }
          leftIcon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          }
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <label className="checkbox-label" htmlFor="remember-me">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ display: 'none' }}
            />
            <span className="checkbox-custom">
              {rememberMe && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#060b14" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </span>
            <span>Remember for 30 days</span>
          </label>
        </div>

        <Button
          id="login-submit-btn"
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          Sign In to Stackly
        </Button>
      </form>

      <div className="auth-divider">
        <span>or continue with</span>
      </div>

      <div className="social-auth-grid">
        <button
          type="button"
          id="google-oauth-btn"
          className="btn-social"
          onClick={() => handleSocialClick('Google')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Google</span>
        </button>

        <button
          type="button"
          id="github-oauth-btn"
          className="btn-social"
          onClick={() => handleSocialClick('GitHub')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          <span>GitHub</span>
        </button>
      </div>

      <div className="demo-credentials-box">
        <div className="demo-text">
          <span>Quick Demo: </span>
          <strong>alex.rivera@stackly.io</strong>
        </div>
        <button
          type="button"
          id="fill-demo-btn"
          className="btn-fill-demo"
          onClick={handleFillDemo}
        >
          Auto Fill
        </button>
      </div>
    </div>
  );
}
