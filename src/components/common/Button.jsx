import React from 'react';

/**
 * Reusable Button Component
 * Supports variants: primary, secondary, outline, ghost
 * Handles loading spinner and disabled state
 */
export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  isLoading = false,
  disabled = false,
  onClick,
  leftIcon,
  rightIcon,
  className = '',
  id,
  fullWidth = true
}) {
  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`btn btn-${variant} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {isLoading ? (
        <>
          <span className="btn-spinner" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="btn-icon-left">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="btn-icon-right">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
