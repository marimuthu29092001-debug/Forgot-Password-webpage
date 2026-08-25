import React, { useState } from 'react';
import LoginCard from './components/auth/LoginCard';
import ForgotPasswordFlow from './components/auth/ForgotPasswordFlow';
import NotFound404 from './components/auth/NotFound404';
import Toast from './components/common/Toast';
import MockEmailModal from './components/common/MockEmailModal';
import { DEMO_USER } from './utils/mockData';

export default function App() {
  const [view, setView] = useState('login'); // 'login' | 'forgot-password' | '404'
  const [oauthProvider, setOauthProvider] = useState('Google');
  const [prefilledEmail, setPrefilledEmail] = useState('');
  const [activeOtp, setActiveOtp] = useState('849201');
  const [isInboxModalOpen, setIsInboxModalOpen] = useState(false);
  const [userAccounts, setUserAccounts] = useState({
    'admin@oneenterprise.com': 'admin123',
    'hr@oneenterprise.com': 'hr12345',
    [DEMO_USER.email.toLowerCase()]: DEMO_USER.password
  });
  const [toasts, setToasts] = useState([]);

  const addToast = ({ type = 'info', title, message, duration = 4500 }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleStartForgotPassword = (email) => {
    const safeEmail = typeof email === 'string' ? email : '';
    setPrefilledEmail(safeEmail);
    setView('forgot-password');
  };

  const handleBackToLogin = (email) => {
    const safeEmail = typeof email === 'string' ? email : '';
    setPrefilledEmail(safeEmail);
    setView('login');
  };

  const handleNavigateTo404 = (provider) => {
    setOauthProvider(provider || 'OAuth');
    setView('404');
  };

  const handlePasswordResetDone = (email, newPassword) => {
    if (email && typeof email === 'string') {
      const normalized = email.trim().toLowerCase();
      setUserAccounts((prev) => ({
        ...prev,
        [normalized]: newPassword
      }));
      setPrefilledEmail(email.trim());
    }
  };

  return (
    <div className="split-container">
      {/* ==========================================================================
          LEFT SIDE: ROYAL BLUE HERO BANNER
          ========================================================================== */}
      <section className="hero-banner">
        <div className="hero-waves">
          <div className="hero-curve-1" />
          <div className="hero-curve-2" />
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            Welcome back to One Enterprise!
          </h1>
          <p className="hero-subtitle">
            Login and continue where you left off. You will be signed in based on your roles and permissions.
          </p>
        </div>
      </section>

      {/* ==========================================================================
          RIGHT SIDE: CLEAN WHITE FORM PANEL
          ========================================================================== */}
      <section className="form-panel">
        {view === 'login' && (
          <LoginCard
            prefilledEmail={prefilledEmail}
            userAccounts={userAccounts}
            onForgotPassword={handleStartForgotPassword}
            onNavigateTo404={handleNavigateTo404}
            onLoginSuccess={(user) => {}}
            onToast={addToast}
          />
        )}

        {view === 'forgot-password' && (
          <div className="form-wrapper">
            <ForgotPasswordFlow
              initialEmail={prefilledEmail}
              onBackToLogin={handleBackToLogin}
              onOpenInbox={() => setIsInboxModalOpen(true)}
              activeOtp={activeOtp}
              setActiveOtp={setActiveOtp}
              onPasswordResetDone={handlePasswordResetDone}
              onToast={addToast}
            />
          </div>
        )}

        {view === '404' && (
          <div className="form-wrapper">
            <NotFound404
              provider={oauthProvider}
              onBackToLogin={() => handleBackToLogin(prefilledEmail)}
            />
          </div>
        )}
      </section>

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Simulated Email Modal */}
      <MockEmailModal
        isOpen={isInboxModalOpen}
        onClose={() => setIsInboxModalOpen(false)}
        email={prefilledEmail || 'admin@oneenterprise.com'}
        otpCode={activeOtp}
        onFillOtp={(code) => {
          addToast({
            type: 'success',
            title: 'OTP Copied & Filled',
            message: `Applied verification code ${code}`
          });
        }}
      />
    </div>
  );
}
