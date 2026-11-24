import { rateLimit } from 'express-rate-limit';

// Rate limiting = counting requests from one IP address (one phone, computer or network)
// and answering "429 Too Many Requests" after too many.
// The counts are kept in memory, so restarting the server resets them.

function createLimiter({ minutes, max, message, ...options }) {
  return rateLimit({
    windowMs: minutes * 60 * 1000,
    limit: max,
    message: { error: message }, // same { error } shape as all our other errors
    standardHeaders: 'draft-8', // RateLimit and Retry-After headers tell the client how long to wait
    legacyHeaders: false, // skip the old X-RateLimit-* headers
    ...options,
  });
}

// Login: stops someone guessing a vendor's password again and again
export const loginLimiter = createLimiter({
  minutes: 15,
  max: 10,
  skipSuccessfulRequests: true, // only wrong tries count
  message: 'Too many wrong tries. Please try again after 15 minutes.',
});

// Checking a 6-digit code (verify email, reset password): stops code guessing
export const otpCheckLimiter = createLimiter({
  minutes: 15,
  max: 10,
  skipSuccessfulRequests: true, // only wrong tries count
  message: 'Too many wrong tries. Please try again after 15 minutes.',
});

// Anything that sends an email (register, resend code, forgot password).
// Protects people's inboxes from spam, and our Brevo free plan (300 emails a day).
export const emailLimiter = createLimiter({
  minutes: 60,
  max: 10,
  skipFailedRequests: true, // a request that failed sent no email, so it doesn't count
  message: 'Too many requests. Please try again after 1 hour.',
});
