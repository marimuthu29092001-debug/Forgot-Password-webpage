import React from 'react';

/**
 * Brand Hero Showcase Column for Desktop & Tablet
 */
export default function BrandHero() {
  return (
    <div className="brand-hero">
      <div className="hero-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span>Enterprise-Grade Cloud Security</span>
      </div>

      <div>
        <h1 className="hero-title">
          Build faster with <span className="gradient-text">Stackly</span> platform.
        </h1>
        <p className="hero-subtitle">
          Empowering engineering teams worldwide to automate workflows, manage cloud microservices, and protect sensitive resources with Zero-Trust identity.
        </p>
      </div>

      <div className="hero-features-grid">
        <div className="feature-pill">
          <div className="feature-icon-wrapper">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <h4>Multi-Factor & OTP</h4>
            <p>End-to-end encrypted 6-digit challenge verification.</p>
          </div>
        </div>

        <div className="feature-pill">
          <div className="feature-icon-wrapper">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div>
            <h4>Real-time Telemetry</h4>
            <p>Sub-millisecond authentication edge routing.</p>
          </div>
        </div>

        <div className="feature-pill">
          <div className="feature-icon-wrapper">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          </div>
          <div>
            <h4>Modular SDKs</h4>
            <p>Seamless React, Node, and Python integration.</p>
          </div>
        </div>

        <div className="feature-pill">
          <div className="feature-icon-wrapper">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <h4>99.99% Uptime</h4>
            <p>Guaranteed reliability across 32 global clusters.</p>
          </div>
        </div>
      </div>

      {/* Code Snippet */}
      <div className="code-preview-card">
        <div className="code-preview-header">
          <div className="code-dots">
            <span className="code-dot dot-red" />
            <span className="code-dot dot-yellow" />
            <span className="code-dot dot-green" />
          </div>
          <span className="code-filename">stackly.auth.config.ts</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--success)' }}>● active</span>
        </div>
        <div className="code-body">
          <div><span className="code-keyword">import</span> &#123; createClient &#125; <span className="code-keyword">from</span> <span className="code-str">'@stackly/auth'</span>;</div>
          <br />
          <div><span className="code-keyword">const</span> stackly = <span className="code-func">createClient</span>(&#123;</div>
          <div style={{ paddingLeft: '1rem' }}>mfa: <span className="code-keyword">true</span>,</div>
          <div style={{ paddingLeft: '1rem' }}>otpDigits: <span className="code-num">6</span>,</div>
          <div style={{ paddingLeft: '1rem' }}>encryption: <span className="code-str">'AES-GCM-256'</span></div>
          <div>&#125;);</div>
        </div>
      </div>

      <div className="security-trust-bar">
        <div className="trust-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>SOC-2 Certified</span>
        </div>
        <div className="trust-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>ISO 27001</span>
        </div>
        <div className="trust-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Zero-Knowledge Encryption</span>
        </div>
      </div>
    </div>
  );
}
