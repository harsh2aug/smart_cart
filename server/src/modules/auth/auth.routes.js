import { Router } from 'express';
import { emailLimiter, loginLimiter, otpCheckLimiter } from '../../middlewares/rateLimits.js';
import { requireAuth } from '../../middlewares/requireAuth.js';
import {
  forgotPassword,
  login,
  logout,
  me,
  register,
  resendVerification,
  resetPassword,
  verifyEmail,
} from './auth.controller.js';

// These paths are added after /api/v1/auth (see app.js)
// Functions run left to right: limiters and requireAuth first, the controller last.
const router = Router();

router.post('/register', emailLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.post('/forgot-password', emailLimiter, forgotPassword);
router.post('/reset-password', otpCheckLimiter, resetPassword);
router.get('/me', me); // works logged in or out

// Need the login cookie
router.post('/verify-email', requireAuth, otpCheckLimiter, verifyEmail);
router.post('/resend-verification', requireAuth, emailLimiter, resendVerification);

export default router;
