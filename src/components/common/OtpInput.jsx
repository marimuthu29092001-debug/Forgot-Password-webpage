import React, { useRef, useEffect } from 'react';

/**
 * 6-Digit OTP Box Component with auto-focus, paste, and backspace handling
 */
export default function OtpInput({
  value = ['', '', '', '', '', ''],
  onChange,
  onComplete,
  hasError = false,
  disabled = false,
  length = 6
}) {
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus the first empty input on mount
    const firstEmptyIndex = value.findIndex((digit) => digit === '');
    const targetIndex = firstEmptyIndex !== -1 ? firstEmptyIndex : 0;
    if (inputRefs.current[targetIndex]) {
      inputRefs.current[targetIndex].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const rawVal = e.target.value;
    // Extract only digits
    const digitsOnly = rawVal.replace(/\D/g, '');

    if (!digitsOnly) {
      // Clear input
      const newOtp = [...value];
      newOtp[index] = '';
      onChange(newOtp);
      return;
    }

    // Handle single character or fast multi-char input
    const newOtp = [...value];
    const char = digitsOnly.slice(-1);
    newOtp[index] = char;
    onChange(newOtp);

    // If filled, move to next input box
    if (index < length - 1 && char) {
      inputRefs.current[index + 1]?.focus();
      inputRefs.current[index + 1]?.select();
    }

    // Check completion
    const completeOtp = newOtp.join('');
    if (completeOtp.length === length && onComplete) {
      onComplete(completeOtp);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        // Move back to previous box and delete
        const newOtp = [...value];
        newOtp[index - 1] = '';
        onChange(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...value];
        newOtp[index] = '';
        onChange(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
      inputRefs.current[index - 1]?.select();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
      inputRefs.current[index + 1]?.select();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    const digitsOnly = pastedData.replace(/\D/g, '').slice(0, length);

    if (digitsOnly.length > 0) {
      const newOtp = [...value];
      for (let i = 0; i < length; i++) {
        newOtp[i] = digitsOnly[i] || '';
      }
      onChange(newOtp);

      // Focus on the next available box or the last box
      const nextFocus = Math.min(digitsOnly.length, length - 1);
      inputRefs.current[nextFocus]?.focus();

      if (digitsOnly.length === length && onComplete) {
        onComplete(digitsOnly);
      }
    }
  };

  return (
    <div className={`otp-boxes-row ${hasError ? 'shake' : ''}`}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          id={`otp-box-${index}`}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          autoComplete="one-time-code"
          className={`otp-box ${value[index] ? 'filled' : ''} ${hasError ? 'error' : ''}`}
          aria-label={`Digit ${index + 1} of verification code`}
        />
      ))}
    </div>
  );
}
