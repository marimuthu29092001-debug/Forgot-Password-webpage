import emailjs from '@emailjs/browser';

/**
 * EmailJS Configuration from Vite Environment Variables (.env)
 */
const emailjsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY
};

/**
 * Check if real EmailJS credentials are provided in .env
 */
export function isEmailJSConfigured() {
  const { serviceId, templateId, publicKey } = emailjsConfig;
  return Boolean(
    serviceId &&
    serviceId !== 'service_stackly_otp' &&
    serviceId !== 'your_emailjs_service_id' &&
    templateId &&
    templateId !== 'template_otp_stackly' &&
    templateId !== 'your_emailjs_template_id' &&
    publicKey &&
    publicKey !== 'your_emailjs_public_key_here' &&
    publicKey !== 'your_emailjs_public_key'
  );
}

// Initialize EmailJS public key if available
try {
  if (emailjsConfig.publicKey && emailjsConfig.publicKey !== 'your_emailjs_public_key_here') {
    emailjs.init(emailjsConfig.publicKey);
  }
} catch (err) {
  console.warn('[EmailJS] Init notice:', err.message);
}

/**
 * Dispatch real 6-digit OTP verification email via EmailJS
 * 
 * Template Parameters expected in EmailJS template:
 * - to_email: recipient email address
 * - otp_code: 6-digit OTP code
 * - app_name: 'Stackly'
 * - user_name: name / email prefix
 */
export async function sendOtpEmail({ toEmail, otpCode, userName = '' }) {
  if (!toEmail || !otpCode) {
    return {
      success: false,
      error: 'Missing required email or OTP parameter.'
    };
  }

  // Check if real keys are configured in .env
  if (!isEmailJSConfigured()) {
    console.info(`[EmailJS Simulation] OTP ${otpCode} dispatched to ${toEmail}`);
    return {
      success: true,
      isSimulated: true,
      message: `Simulated OTP dispatched to ${toEmail}. (Provide EmailJS keys in .env for live inbox delivery).`
    };
  }

  const templateParams = {
    to_email: toEmail,
    recipient: toEmail,
    otp_code: otpCode,
    passcode: otpCode,
    app_name: 'Stackly Security',
    user_name: userName || toEmail.split('@')[0],
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  try {
    const response = await emailjs.send(
      emailjsConfig.serviceId,
      emailjsConfig.templateId,
      templateParams,
      emailjsConfig.publicKey
    );

    return {
      success: true,
      isSimulated: false,
      status: response.status,
      message: `Verification code successfully emailed to ${toEmail}!`
    };
  } catch (error) {
    console.error('[EmailJS] Delivery error:', error);
    return {
      success: false,
      isSimulated: false,
      error: error?.text || error?.message || 'Email delivery failed.',
      message: 'Failed to deliver email via EmailJS. Please verify your template settings in dashboard.emailjs.com.'
    };
  }
}
