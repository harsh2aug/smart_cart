import prisma from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { getMerchantIdFromCookie } from '../utils/authCookie.js';
import { withoutPassword } from '../utils/withoutPassword.js';

// For all vendor dashboard APIs (profile, menu, orders):
// needs a valid login, an active account and a verified email.
// Saves the merchant on req.merchant, so the next functions don't load it again.
export async function requireVerifiedMerchant(req, _res, next) {
  const merchantId = getMerchantIdFromCookie(req);
  const merchant = merchantId
    ? await prisma.merchant.findUnique({ where: { id: merchantId } })
    : null;

  if (!merchant || !merchant.isActive) {
    throw new AppError(401, 'Please log in first');
  }
  if (!merchant.isEmailVerified) {
    throw new AppError(403, 'Please verify your email first');
  }

  req.merchant = withoutPassword(merchant);
  next();
}
