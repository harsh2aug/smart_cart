import { AppError } from '../utils/AppError.js';
import { getMerchantIdFromCookie } from '../utils/authCookie.js';

// Lets a request through only if it has a valid login cookie.
// Saves the merchant id on req.merchantId so the next function knows who is asking.
export function requireAuth(req, _res, next) {
  const merchantId = getMerchantIdFromCookie(req);
  if (!merchantId) {
    throw new AppError(401, 'Please log in first');
  }
  req.merchantId = merchantId;
  next();
}
