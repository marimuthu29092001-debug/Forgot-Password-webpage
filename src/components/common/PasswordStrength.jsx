import React from 'react';
import { checkPasswordStrength } from '../../utils/validation';

/**
 * Visual Password Strength Meter & Real-time Requirements Checklist
 */
export default function PasswordStrength({ password = '' }) {
  const { criteria, strength } = checkPasswordStrength(password);

  const strengthLabels = {
    none: 'Enter password',
    weak: 'Weak',
    fair: 'Fair',
    good: 'Good',
    strong: 'Strong'
  };

  return (
    <div className="password-strength-container">
      <div className="strength-bar-wrapper">
        <div className={`strength-bars-track strength-${strength}`}>
          <div className="strength-segment" />
          <div className="strength-segment" />
          <div className="strength-segment" />
          <div className="strength-segment" />
        </div>
        <span className={`strength-label strength-${strength}`}>
          {strengthLabels[strength]}
        </span>
      </div>

      <ul className="password-checklist">
        <li className={`checklist-item ${criteria.length ? 'passed' : ''}`}>
          {criteria.length ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
            </svg>
          )}
          <span>At least 8 characters</span>
        </li>

        <li className={`checklist-item ${criteria.hasUppercase ? 'passed' : ''}`}>
          {criteria.hasUppercase ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
            </svg>
          )}
          <span>Uppercase letter</span>
        </li>

        <li className={`checklist-item ${criteria.hasNumber ? 'passed' : ''}`}>
          {criteria.hasNumber ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
            </svg>
          )}
          <span>At least 1 number</span>
        </li>

        <li className={`checklist-item ${criteria.hasSpecial ? 'passed' : ''}`}>
          {criteria.hasSpecial ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
            </svg>
          )}
          <span>Special symbol (!@#$)</span>
        </li>
      </ul>
    </div>
  );
}
