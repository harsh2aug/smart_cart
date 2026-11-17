import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const AUTH_COOKIE = 'token';
export const TOKEN_DAYS = 7; // login lasts 7 days

const cookieOptions = {
  httpOnly: true, // page JavaScript cannot read the cookie
  secure: env.isProduction, // HTTPS only in production
  sameSite: 'lax', // not sent when another website posts to our API
  path: '/',
};

export function setAuthCookie(res, token) {
  res.cookie(AUTH_COOKIE, token, {
    ...cookieOptions,
    maxAge: TOKEN_DAYS * 24 * 60 * 60 * 1000, // in milliseconds
  });
}

export function clearAuthCookie(res) {
  res.clearCookie(AUTH_COOKIE, cookieOptions);
}

// Returns the merchant id from the login cookie, or null when there is no valid login
// (no cookie, expired, or changed by someone: jwt.verify checks the signature and expiry)
export function getMerchantIdFromCookie(req) {
  const token = req.cookies[AUTH_COOKIE];
  if (!token) {
    return null;
  }
  try {
    return jwt.verify(token, env.JWT_SECRET).sub;
  } catch {
    return null;
  }
}
