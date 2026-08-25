import React from 'react';

/**
 * Official Stackly Brand Logo Component
 * Pixel-accurate dual-swoosh S ribbon in mint-teal & deep navy/white + STACKLY wordmark
 * 
 * @param {Object} props
 * @param {'small' | 'medium' | 'large' | 'xlarge'} props.size - Size of the logo
 * @param {'light' | 'dark' | 'color' | 'badge'} props.variant - Theme variant
 * @param {boolean} props.iconOnly - Render only the icon without text
 * @param {string} props.className - Custom CSS class
 */
export default function StacklyLogo({
  size = 'medium',
  variant = 'light',
  iconOnly = false,
  className = '',
  style = {}
}) {
  const heights = {
    small: 28,
    medium: 38,
    large: 48,
    xlarge: 58
  };

  const height = heights[size] || 38;

  // Color configurations based on variant
  const isLight = variant === 'light';
  const mintColor = '#70D6C4';
  const secondarySwooshColor = isLight ? '#FFFFFF' : '#173354';
  const textColor = isLight ? '#FFFFFF' : '#173354';

  if (variant === 'badge') {
    return (
      <div
        className={`stackly-logo-badge ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.5rem 1.1rem',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.22)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          ...style
        }}
      >
        <StacklySvgIcon
          height={height}
          mintColor="#70D6C4"
          secondaryColor="#FFFFFF"
        />
        {!iconOnly && (
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              fontSize: `${height * 0.58}px`,
              fontWeight: 800,
              letterSpacing: '2.5px',
              color: '#FFFFFF',
              lineHeight: 1,
              textTransform: 'uppercase'
            }}
          >
            STACKLY
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`brand-header-box ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${height * 0.3}px`,
        ...style
      }}
    >
      <StacklySvgIcon
        height={height}
        mintColor={mintColor}
        secondaryColor={secondarySwooshColor}
      />
      {!iconOnly && (
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontSize: `${height * 0.62}px`,
            fontWeight: 800,
            letterSpacing: '2.5px',
            color: textColor,
            lineHeight: 1,
            textTransform: 'uppercase',
            display: 'inline-block',
            transition: 'color 0.2s ease'
          }}
        >
          STACKLY
        </span>
      )}
    </div>
  );
}

/**
 * Isolated Stackly S-ribbon SVG Icon
 */
export function StacklySvgIcon({
  height = 38,
  mintColor = '#70D6C4',
  secondaryColor = '#FFFFFF',
  className = ''
}) {
  const width = (height * 48) / 54;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 48 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`stackly-s-icon ${className}`}
      style={{ display: 'block', flexShrink: 0 }}
    >
      <g id="stackly-ribbon-s">
        {/* Top Mint Swoosh */}
        <path
          d="M 18.5,3 C 13,4.5 4,13.5 4,23.5 C 4,31 9.5,35 17.5,35.5 C 14,32 12,27 13.5,21 C 15,14.5 20.5,9.5 28,7.5 C 24.5,4.5 21,3 18.5,3 Z"
          fill={mintColor}
        />
        {/* Bottom Secondary (Navy / White) Swoosh */}
        <path
          d="M 29.5,21 C 33.5,24.5 35.5,29.5 34,36 C 32.5,42.5 27,47.5 19.5,49.5 C 23,52.5 26.5,54 29.5,54 C 35,52.5 44,43.5 44,33.5 C 44,26 38.5,22 30.5,21.5 C 30.2,21.3 29.8,21.1 29.5,21 Z"
          fill={secondaryColor}
        />
      </g>
    </svg>
  );
}
