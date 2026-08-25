import React, { useState, useEffect } from 'react';
import EmailStep from './EmailStep';
import OtpStep from './OtpStep';
import ResetPasswordStep from './ResetPasswordStep';
import SuccessStep from './SuccessStep';
import { generateRandomOtp } from '../../utils/mockData';
import { sendOtpEmail, isEmailJSConfigured } from '../../services/emailService';

const STEPS = [
  { id: 1, label: 'Email' },
  { id: 2, label: 'Verify OTP' },
  { id: 3, label: 'New Password' },
  { id: 4, label: 'Complete' }
];

/**
 * Multi-Step Container for the Forgot Password Flow with EmailJS Integration
 */
export default function ForgotPasswordFlow({
  initialEmail = '',
  onBackToLogin,
  onOpenInbox,
  activeOtp,
  setActiveOtp,
  onPasswordResetDone,
  onToast
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState(typeof initialEmail === 'string' ? initialEmail : '');

  useEffect(() => {
    if (typeof initialEmail === 'string' && initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  const handleEmailSubmitted = async (submittedEmail) => {
    const validEmail = submittedEmail || email;
    setEmail(validEmail);
    const code = generateRandomOtp();
    setActiveOtp(code);

    // Dispatch real email via EmailJS (or smart simulation)
    const emailResult = await sendOtpEmail({
      toEmail: validEmail,
      otpCode: code,
      userName: validEmail.split('@')[0]
    });

    if (onToast) {
      if (emailResult.success && !emailResult.isSimulated) {
        onToast({
          type: 'success',
          title: 'Real Email Dispatched via EmailJS',
          message: `6-digit OTP delivered to your actual inbox: ${validEmail}`
        });
      } else {
        onToast({
          type: 'info',
          title: 'OTP Code Generated',
          message: `Verification code ${code} sent to ${validEmail}`
        });
      }
    }

    setCurrentStep(2);
  };

  const handleResendOtp = async () => {
    const freshCode = generateRandomOtp();
    setActiveOtp(freshCode);

    // Dispatch fresh email via EmailJS
    const emailResult = await sendOtpEmail({
      toEmail: email,
      otpCode: freshCode,
      userName: email.split('@')[0]
    });

    if (onToast) {
      if (emailResult.success && !emailResult.isSimulated) {
        onToast({
          type: 'success',
          title: 'New OTP Delivered',
          message: `Fresh verification code emailed to ${email}`
        });
      } else {
        onToast({
          type: 'info',
          title: 'Fresh OTP Generated',
          message: `New code ${freshCode} dispatched to ${email}`
        });
      }
    }

    return freshCode;
  };

  const handleOtpVerified = () => {
    setCurrentStep(3);
  };

  const handlePasswordReset = (newPassword) => {
    if (onPasswordResetDone) {
      onPasswordResetDone(email, newPassword);
    }
    setCurrentStep(4);
  };

  const progressPercent = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="auth-card">
      {/* Stepper Progress Bar */}
      <div className="step-indicator">
        <div className="step-indicator-track" />
        <div
          className="step-indicator-fill"
          style={{ width: `${progressPercent}%` }}
        />

        {STEPS.map((step) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <div
              key={step.id}
              className={`step-node ${isActive ? 'active' : ''} ${
                isCompleted ? 'completed' : ''
              }`}
            >
              <div className="step-circle">
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <span className="step-label">{step.label}</span>
            </div>
          );
        })}
      </div>

      {currentStep === 1 && (
        <EmailStep
          email={email}
          setEmail={setEmail}
          onNext={handleEmailSubmitted}
          onBackToLogin={onBackToLogin}
          onToast={onToast}
        />
      )}

      {currentStep === 2 && (
        <OtpStep
          email={email}
          expectedOtp={activeOtp}
          onVerifySuccess={handleOtpVerified}
          onResendOtp={handleResendOtp}
          onEditEmail={() => setCurrentStep(1)}
          onOpenInbox={onOpenInbox}
          onToast={onToast}
        />
      )}

      {currentStep === 3 && (
        <ResetPasswordStep
          email={email}
          onResetSuccess={handlePasswordReset}
          onToast={onToast}
        />
      )}

      {currentStep === 4 && (
        <SuccessStep
          email={email}
          onBackToLogin={() => onBackToLogin(typeof email === 'string' ? email : '')}
        />
      )}
    </div>
  );
}
