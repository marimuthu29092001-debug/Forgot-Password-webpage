/**
 * Validation utilities for Stackly Auth System
 */

// Email regex matching standard format
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validate an email address
 * @param {string} email
 * @returns {{ isValid: boolean, error: string }}
 */
export function validateEmail(email) {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email address is required' };
  }
  const trimmed = email.trim();
  if (!EMAIL_REGEX.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email address (e.g. alex@stackly.io)' };
  }
  return { isValid: true, error: '' };
}

/**
 * Detailed password strength checklist & calculation
 * Criteria:
 * 1. Min 8 characters
 * 2. At least one uppercase letter (A-Z)
 * 3. At least one number (0-9)
 * 4. At least one special symbol (!@#$%^&*...)
 * 
 * @param {string} password
 * @returns {{
 *   criteria: {
 *     length: boolean,
 *     hasUppercase: boolean,
 *     hasNumber: boolean,
 *     hasSpecial: boolean
 *   },
 *   score: number,
 *   strength: 'none' | 'weak' | 'fair' | 'good' | 'strong',
 *   isValid: boolean,
 *   error: string
 * }}
 */
export function checkPasswordStrength(password = '') {
  const criteria = {
    length: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  let score = 0;
  if (criteria.length) score += 1;
  if (criteria.hasUppercase) score += 1;
  if (criteria.hasNumber) score += 1;
  if (criteria.hasSpecial) score += 1;

  let strength = 'none';
  if (password.length > 0) {
    if (score <= 1) strength = 'weak';
    else if (score === 2) strength = 'fair';
    else if (score === 3) strength = 'good';
    else if (score >= 4) strength = 'strong';
  }

  const isValid = score >= 4;
  let error = '';
  if (password.length > 0 && !isValid) {
    if (!criteria.length) error = 'Password must be at least 8 characters';
    else if (!criteria.hasUppercase) error = 'Include at least one uppercase letter';
    else if (!criteria.hasNumber) error = 'Include at least one number';
    else if (!criteria.hasSpecial) error = 'Include at least one special character';
  }

  return {
    criteria,
    score,
    strength,
    isValid,
    error
  };
}

/**
 * Validate password match
 * @param {string} newPass
 * @param {string} confirmPass
 * @returns {{ isValid: boolean, error: string }}
 */
export function validatePasswordMatch(newPass, confirmPass) {
  if (!confirmPass || confirmPass === '') {
    return { isValid: false, error: 'Please confirm your new password' };
  }
  if (newPass !== confirmPass) {
    return { isValid: false, error: 'Passwords do not match. Please check again.' };
  }
  return { isValid: true, error: '' };
}

/**
 * Validate OTP string or array
 * @param {string|string[]} otp
 * @param {string} expectedOtp
 * @returns {{ isValid: boolean, error: string }}
 */
export function validateOtp(otp, expectedOtp = '849201') {
  const otpString = Array.isArray(otp) ? otp.join('') : String(otp || '');
  
  if (otpString.length < 6) {
    return { isValid: false, error: 'Please enter the complete 6-digit verification code' };
  }
  if (!/^\d{6}$/.test(otpString)) {
    return { isValid: false, error: 'Verification code must contain digits only' };
  }
  if (expectedOtp && otpString !== expectedOtp) {
    return { isValid: false, error: 'Invalid verification code. Please check and try again.' };
  }
  return { isValid: true, error: '' };
}
