import React, { useState } from 'react';
import LoginCard from './components/auth/LoginCard';
import ForgotPasswordFlow from './components/auth/ForgotPasswordFlow';
import NotFound404 from './components/auth/NotFound404';
import Toast from './components/common/Toast';
import MockEmailModal from './components/common/MockEmailModal';
import StacklyLogo from './components/common/StacklyLogo';
import { DEMO_USER } from './utils/mockData';

export default function App() {
  const [view, setView] = useState('login'); // 'login' | 'forgot-password' | '404'
  const [oauthProvider, setOauthProvider] = useState('Google');
  const [prefilledEmail, setPrefilledEmail] = useState('admin@oneenterprise.com');
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
    <div className="auth-page-wrapper">
      {/* Ambient background lighting */}
      <div className="bg-ambient-orb-1" />
      <div className="bg-ambient-orb-2" />

      {/* Main Floating Rounded Card */}
      <div className="main-auth-card">
        {/* ==========================================================================
            LEFT PANEL: 3D BLUE SPHERES & WELCOME BANNER
            ========================================================================== */}
        <section className="card-welcome-panel">
          <div className="sphere-layer">
            <div className="sphere-3d-upper" />
            <div className="sphere-3d-main" />
            <div className="sphere-3d-left" />
          </div>

          <div className="welcome-content">
            <div className="welcome-logo-badge-row">
              <StacklyLogo variant="light" size="medium" />
            </div>
            <h2 className="welcome-title">WELCOME</h2>
            <div className="welcome-headline">YOUR HEADLINE NAME</div>
            <p className="welcome-desc">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim quis nostrud exerci tation
            </p>
          </div>
        </section>

        {/* ==========================================================================
            RIGHT PANEL: CLEAN WHITE FORM PANEL
            ========================================================================== */}
        <section className="card-form-panel">
          {/* Decorative Corner Orb */}
          <div className="card-decor-orb-bottom-right" />

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
            <div className="flow-container-inner" style={{ position: 'relative', zIndex: 2 }}>
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
            <div className="flow-container-inner" style={{ position: 'relative', zIndex: 2 }}>
              <NotFound404
                provider={oauthProvider}
                onBackToLogin={() => handleBackToLogin(prefilledEmail)}
              />
            </div>
          )}
        </section>
      </div>

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
            title: 'OTP Applied',
            message: `Verification code ${code} filled successfully.`
          });
        }}
      />
    </div>
  );
}
