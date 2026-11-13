import { clearAuthCookie, setAuthCookie } from '../../utils/authCookie.js';
import { createToken, loginMerchant, registerMerchant } from './auth.service.js';
import { loginSchema, registerSchema } from './auth.validation.js';

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
