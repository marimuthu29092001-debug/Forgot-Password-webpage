import React, { useState } from 'react';
import Navbar from './components/layout/Navbar';
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
    [DEMO_USER.email.toLowerCase()]: DEMO_USER.password
  });
  const [toasts, setToasts] = useState([
    {
      id: 1,
      type: 'info',
      title: 'Welcome to Stackly Platform',
      message: 'Enter your email to test login or password recovery.',
      duration: 5000
    }
  ]);

  const addToast = ({ type = 'info', title, message, duration = 5000 }) => {
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
    <div className="app-container">
      {/* ==========================================================================
          ANIMATED IT & CYBERSECURITY TECH BACKGROUND
          ========================================================================== */}
      <div className="ambient-bg" aria-hidden="true">
        {/* Animated Cyber Grid Matrix */}
        <div className="tech-grid-overlay" />
        
        {/* Laser Scanner Beam */}
        <div className="tech-laser-scanner" />

        {/* Ambient Glowing Server Orbs */}
        <div className="orb-1" />
        <div className="orb-2" />
        <div className="orb-3" />

        {/* Floating IT & Cloud Security Tech Icons */}
        <div className="floating-tech-icon tech-icon-1">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
            <line x1="6" y1="6" x2="6.01" y2="6" />
            <line x1="6" y1="18" x2="6.01" y2="18" />
          </svg>
        </div>

        <div className="floating-tech-icon tech-icon-2">
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>

        <div className="floating-tech-icon tech-icon-3">
          <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </div>

        <div className="floating-tech-icon tech-icon-4">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
          </svg>
        </div>
      </div>

      {/* Clean Navbar with Official Stackly Logo */}
      <Navbar
        onResetView={() => setView('login')}
        hasActiveOtp={view === 'forgot-password' && Boolean(activeOtp)}
        onOpenInbox={() => setIsInboxModalOpen(true)}
      />

      {/* Centered Main Authentication Card */}
      <main className="auth-wrapper">
        <div className="auth-card-container">
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
            <ForgotPasswordFlow
              initialEmail={prefilledEmail}
              onBackToLogin={handleBackToLogin}
              onOpenInbox={() => setIsInboxModalOpen(true)}
              activeOtp={activeOtp}
              setActiveOtp={setActiveOtp}
              onPasswordResetDone={handlePasswordResetDone}
              onToast={addToast}
            />
          )}

          {view === '404' && (
            <NotFound404
              provider={oauthProvider}
              onBackToLogin={() => handleBackToLogin(prefilledEmail)}
            />
          )}
        </div>
      </main>

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Simulated Email Inbox Popup */}
      <MockEmailModal
        isOpen={isInboxModalOpen}
        onClose={() => setIsInboxModalOpen(false)}
        email={prefilledEmail || DEMO_USER.email}
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
