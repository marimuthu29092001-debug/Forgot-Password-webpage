# Stackly — Modern Authentication & Forgot Password Web Application

A modern, responsive, and visually stunning authentication web application built with **React**, **HTML5**, and a custom **CSS Design System** for the **Stackly Cloud Platform**.

---

## 🌟 Key Features

### 1. Complete Multi-Step Forgot Password Flow
The user journey follows a step-by-step state machine with animated transitions:
1. **Email Input & Validation**:
   - Live email validation with regex format checks.
   - Dispatches a 6-digit one-time passcode (OTP) upon submission.
   - Includes a "Back to Sign In" quick exit.
2. **6-Digit OTP Verification**:
   - 6 individual auto-advancing digit boxes.
   - Full keyboard navigation: Left/Right arrows, Backspace auto-reversal, and Paste clipboard handling.
   - 60-second countdown timer for **Resend Code**.
   - Interactive **Simulated Mailbox Drawer/Modal** showing the mock email and a 1-click **Auto-Fill** helper.
   - Shake animation and clear error alerts for invalid codes.
3. **Reset Password with Live Strength Meter**:
   - New Password and Confirm Password inputs with independent **Show/Hide password toggles**.
   - Dynamic 4-segment **Password Strength Meter** (Weak, Fair, Good, Strong).
   - Real-time 4-point requirements checklist:
     - At least 8 characters
     - Uppercase letter
     - Numeric digit
     - Special character (`!@#$%^&*`)
   - Real-time password match verification indicator.
4. **Success Confirmation**:
   - Animated celebratory checkmark with glowing ripple badge.
   - Summary card detailing the updated security credentials.
   - "Sign In with New Password" button returning directly to the login screen with the email prefilled.

### 2. Login Screen
- Responsive card with email and password fields.
- "Remember for 30 days" toggle.
- "Forgot password?" link directly launching the recovery flow.
- Social OAuth buttons (Google & GitHub).
- Demo account helper pill (`alex.rivera@stackly.io`) for instant 1-click testing.

### 3. Aesthetics & Design System
- **Theme Switcher**: Instant Dark Mode and Light Mode support with smooth CSS variable transitions.
- **Glassmorphism**: Backdrop blur filters, subtle gradient borders, and glowing mesh orbs.
- **Micro-Animations**: Shakes on errors, ripple effects on success, smooth progress stepper bar.
- **Toast Notifications**: Floating notification manager with auto-dismiss timers.
- **Fully Responsive**: Flawless experience across mobile (<640px), tablet (768px), and desktop (>1024px) split hero view.

---

## 📂 Project Architecture

```
f:/Implement Forgot Password Flow/
├── index.html                   # Zero-dependency entry point (works natively in any browser)
├── package.json                 # Project dependencies & scripts
├── vite.config.js               # Vite bundler configuration
├── README.md                    # Project documentation
└── src/
    ├── index.css                # CSS Design System (variables, themes, animations, glassmorphism)
    ├── main.jsx                 # React root renderer
    ├── App.jsx                  # Main application orchestrator
    ├── components/
    │   ├── auth/
    │   │   ├── LoginCard.jsx           # Sign-in form with validation
    │   │   ├── ForgotPasswordFlow.jsx  # Multi-step stepper controller
    │   │   ├── EmailStep.jsx           # Step 1: Email entry
    │   │   ├── OtpStep.jsx             # Step 2: 6-digit OTP verification
    │   │   ├── ResetPasswordStep.jsx   # Step 3: Password reset & strength meter
    │   │   └── SuccessStep.jsx         # Step 4: Celebratory confirmation
    │   ├── common/
    │   │   ├── InputField.jsx          # Reusable input with eye toggle & error messages
    │   │   ├── Button.jsx              # Button variants with loading spinners
    │   │   ├── OtpInput.jsx            # 6-box OTP controller with keyboard navigation
    │   │   ├── PasswordStrength.jsx    # Live strength meter & checklist
    │   │   ├── Alert.jsx               # Inline status alerts
    │   │   ├── Toast.jsx               # Floating toast notifications
    │   │   └── MockEmailModal.jsx      # Simulated mailbox popup
    │   └── layout/
    │       ├── BrandHero.jsx           # Cloud platform hero showcase & code preview
    │       └── Navbar.jsx              # Navigation header with theme toggle
    └── utils/
        ├── validation.js               # Email, password strength & OTP validation rules
        └── mockData.js                 # Demo accounts & simulation helpers
```

---

## 🚀 How to Run

### Method 1: Instant Browser View (Zero Setup)
Simply double-click or open [`index.html`](file:///f:/Implement%20Forgot%20Password%20Flow/index.html) in any modern browser (Chrome, Edge, Firefox, Safari). It runs React 18 directly!

### Method 2: Modern Vite Dev Server
```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Open the provided local URL (typically `http://localhost:5173`) in your browser.
