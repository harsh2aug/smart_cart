import { Router } from 'express';
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
const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', me); // works logged in or out

// Need the login cookie: requireAuth runs first, then the controller
router.post('/verify-email', requireAuth, verifyEmail);
router.post('/resend-verification', requireAuth, resendVerification);

export default router;
