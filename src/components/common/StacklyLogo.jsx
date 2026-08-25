import React from 'react';

/**
 * Official Stackly Brand Logo Component
 * Exact dual-swoosh S ribbon in mint-teal & deep navy + STACKLY wordmark
 */
export default function StacklyLogo({ size = 'medium', className = '' }) {
  const heights = {
    small: 32,
    medium: 44,
    large: 54
  };

  const height = heights[size] || 44;

  return (
    <div className={`brand-header-box ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.85rem' }}>
      <svg
        height={height}
        viewBox="0 0 260 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="stackly-brand-svg"
      >
        {/* Dual Swoosh Ribbon S Mark */}
        <g id="stackly-s-icon">
          {/* Top Mint-Teal Swoosh */}
          <path
            d="M29 6C23 6 12 14 8 26C5 34 10 40 20 40C14 36 12 28 16 21C20 15 28 13 38 18C35 11 32 6 29 6Z"
            fill="#78D6C6"
          />
          {/* Bottom Deep Navy Swoosh */}
          <path
            d="M25 58C31 58 42 50 46 38C49 30 44 24 34 24C40 28 42 36 38 43C34 49 26 51 16 46C19 53 22 58 25 58Z"
            fill="#38BDF8"
          />
        </g>

        {/* Crisp STACKLY Wordmark */}
        <text
          x="66"
          y="42"
          fontFamily="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
          fontSize="32"
          fontWeight="900"
          letterSpacing="2.5"
          fill="#F8FAFC"
        >
          STACKLY
        </text>
      </svg>
    </div>
  );
}
