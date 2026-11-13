import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import prisma from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';
import { TOKEN_DAYS } from '../../utils/authCookie.js';
import { toSlug } from '../../utils/slug.js';

// Remove the password hash before a merchant is sent to the browser
function withoutPassword(merchant) {
  const { passwordHash: _passwordHash, ...rest } = merchant;
  return rest;
}

// "raju-chaat" is taken? Try "raju-chaat-2", "raju-chaat-3"...
async function createUniqueSlug(businessName) {
  const base = toSlug(businessName);
  let slug = base;
  let number = 2;

  while (await prisma.merchant.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `${base}-${number}`;
    number++;
  }
  return slug;
}

export async function registerMerchant({ businessName, ownerName, phone, email, password }) {
  const existing = await prisma.merchant.findFirst({
    where: { OR: [{ phone }, { email }] },
    select: { phone: true },
  });
  if (existing) {
    const field = existing.phone === phone ? 'Phone number' : 'Email';
    throw new AppError(409, `${field} is already registered`);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const slug = await createUniqueSlug(businessName);

  const merchant = await prisma.merchant.create({
    data: { businessName, ownerName, phone, email, passwordHash, slug },
  });
  return withoutPassword(merchant);
}

export async function loginMerchant({ phone, password }) {
  const merchant = await prisma.merchant.findUnique({ where: { phone } });

  // Same message for "no such phone" and "wrong password", so attackers learn nothing
  const isMatch = merchant && (await bcrypt.compare(password, merchant.passwordHash));
  if (!isMatch) {
    throw new AppError(401, 'Invalid phone number or password');
  }
  if (!merchant.isActive) {
    throw new AppError(403, 'Your account is suspended. Please contact support.');
  }
  return withoutPassword(merchant);
}

// The token only stores the merchant id ("sub" = subject = who this token is for)
export function createToken(merchantId) {
  return jwt.sign({ sub: merchantId }, env.JWT_SECRET, { expiresIn: `${TOKEN_DAYS}d` });
}
