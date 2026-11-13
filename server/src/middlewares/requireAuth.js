import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { AUTH_COOKIE } from '../utils/authCookie.js';

// Lets a request through only if it has a valid login cookie.
// Saves the merchant id on req.merchantId so the next function knows who is asking.
export function requireAuth(req, _res, next) {
  const token = req.cookies[AUTH_COOKIE];
  if (!token) {
    throw new AppError(401, 'Please log in first');
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET); // checks the signature and expiry
    req.merchantId = payload.sub;
  } catch {
    // expired, changed by someone, or not a real token
    throw new AppError(401, 'Please log in again');
  }
  next();
}
