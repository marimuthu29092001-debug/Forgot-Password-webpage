/**
 * Mock data & simulation helpers for Stackly Platform
 */

export const DEMO_USER = {
  email: 'alex.rivera@stackly.io',
  password: 'Password@2026',
  name: 'Alex Rivera',
  role: 'Staff Infrastructure Engineer',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
};

/**
 * Generates a random 6-digit OTP code for simulation
 */
export function generateRandomOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Simulate asynchronous network delay
 */
export function simulateDelay(ms = 800) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
