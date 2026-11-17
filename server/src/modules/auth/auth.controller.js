import { clearAuthCookie, getMerchantIdFromCookie, setAuthCookie } from '../../utils/authCookie.js';
import {
  createToken,
  getCurrentMerchant,
  loginMerchant,
  registerMerchant,
  resendVerificationCode,
  resetPassword as resetMerchantPassword,
  sendPasswordResetCode,
  verifyEmail as verifyMerchantEmail,
} from './auth.service.js';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from './auth.validation.js';

// Controllers stay short: check input -> call the service -> send the response.
// Express 5 sends any thrown error to errorHandler automatically.

export async function register(req, res) {
  const data = registerSchema.parse(req.body);
  const merchant = await registerMerchant(data);

  setAuthCookie(res, createToken(merchant.id));
  res.status(201).json({ merchant });
}

export async function login(req, res) {
  const data = loginSchema.parse(req.body);
  const merchant = await loginMerchant(data);

  setAuthCookie(res, createToken(merchant.id));
  res.json({ merchant });
}

export function logout(_req, res) {
  clearAuthCookie(res);
  res.json({ message: 'Logged out' });
}

// "Who is logged in?" -> { merchant } or { merchant: null }.
// Nobody logged in is a normal answer, not an error, so this always replies 200.
export async function me(req, res) {
  const merchant = await getCurrentMerchant(getMerchantIdFromCookie(req));
  res.json({ merchant });
}

// req.merchantId was set by requireAuth (from the login cookie)
export async function verifyEmail(req, res) {
  const { otp } = verifyEmailSchema.parse(req.body);
  const merchant = await verifyMerchantEmail(req.merchantId, otp);
  res.json({ merchant });
}

export async function resendVerification(req, res) {
  await resendVerificationCode(req.merchantId);
  res.json({ message: 'A new code has been sent to your email' });
}

export async function forgotPassword(req, res) {
  const { email } = forgotPasswordSchema.parse(req.body);
  await sendPasswordResetCode(email);
  res.json({ message: 'If this email has a SmartCart account, we have sent a code to it' });
}

export async function resetPassword(req, res) {
  const data = resetPasswordSchema.parse(req.body);
  await resetMerchantPassword(data);
  res.json({ message: 'Password changed. Please log in with your new password.' });
}
