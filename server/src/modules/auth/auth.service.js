import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import prisma from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';
import { TOKEN_DAYS } from '../../utils/authCookie.js';
import { sendEmail } from '../../utils/email.js';
import { toSlug } from '../../utils/slug.js';
import { createOtp, OTP_MINUTES, useOtp } from './otp.service.js';

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

  // Registration should not fail just because the email could not be sent.
  // The merchant can press "Resend code" later.
  try {
    await sendVerificationCode(merchant);
  } catch (error) {
    console.error('Could not send verification email:', error.message);
  }
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

// Makes a new code and emails it to the merchant
async function sendVerificationCode(merchant) {
  const code = await createOtp(merchant.id, 'VERIFY_EMAIL');
  await sendEmail({
    to: merchant.email,
    subject: `${code} is your SmartCart verification code`,
    text:
      `Hi ${merchant.ownerName},\n\n` +
      `Your SmartCart verification code is ${code}.\n` +
      `It works for ${OTP_MINUTES} minutes.\n\n` +
      `If you did not create a SmartCart account, you can ignore this email.`,
  });
}

// The id comes from the login cookie (see requireAuth)
async function findLoggedInMerchant(merchantId) {
  const merchant = await prisma.merchant.findUnique({ where: { id: merchantId } });
  if (!merchant || !merchant.isActive) {
    throw new AppError(401, 'Please log in first');
  }
  return merchant;
}

async function findUnverifiedMerchant(merchantId) {
  const merchant = await findLoggedInMerchant(merchantId);
  if (merchant.isEmailVerified) {
    throw new AppError(400, 'Your email is already verified');
  }
  return merchant;
}

// For GET /auth/me: "who is logged in?" Returns null when nobody is.
export async function getCurrentMerchant(merchantId) {
  if (!merchantId) {
    return null;
  }
  const merchant = await prisma.merchant.findUnique({ where: { id: merchantId } });
  if (!merchant || !merchant.isActive) {
    return null; // account deleted or suspended
  }
  return withoutPassword(merchant);
}

export async function resendVerificationCode(merchantId) {
  const merchant = await findUnverifiedMerchant(merchantId);
  await sendVerificationCode(merchant);
}

export async function verifyEmail(merchantId, otp) {
  const merchant = await findUnverifiedMerchant(merchantId);
  await useOtp(merchant.id, 'VERIFY_EMAIL', otp); // throws if the code is wrong

  const updated = await prisma.merchant.update({
    where: { id: merchant.id },
    data: { isEmailVerified: true },
  });
  return withoutPassword(updated);
}

// Forgot password, step 1: email a reset code.
// We never say "this email is not registered", so nobody can use this
// form to check who has a SmartCart account.
export async function sendPasswordResetCode(email) {
  const merchant = await prisma.merchant.findUnique({ where: { email } });
  if (!merchant || !merchant.isActive) {
    return; // the controller sends the same reply either way
  }

  const code = await createOtp(merchant.id, 'RESET_PASSWORD');
  await sendEmail({
    to: merchant.email,
    subject: `${code} is your SmartCart password reset code`,
    text:
      `Hi ${merchant.ownerName},\n\n` +
      `Your code to reset your SmartCart password is ${code}.\n` +
      `It works for ${OTP_MINUTES} minutes.\n\n` +
      `If you did not ask for this, ignore this email. Your password will not change.`,
  });
}

// Forgot password, step 2: check the code and save the new password
export async function resetPassword({ email, otp, password }) {
  const merchant = await prisma.merchant.findUnique({ where: { email } });
  if (!merchant) {
    throw new AppError(400, 'No code found. Please ask for a new code.');
  }
  await useOtp(merchant.id, 'RESET_PASSWORD', otp); // throws if the code is wrong

  await prisma.merchant.update({
    where: { id: merchant.id },
    data: {
      passwordHash: await bcrypt.hash(password, 10),
      isEmailVerified: true, // they got the code by email, so the email is theirs
    },
  });
}

// The token only stores the merchant id ("sub" = subject = who this token is for)
export function createToken(merchantId) {
  return jwt.sign({ sub: merchantId }, env.JWT_SECRET, { expiresIn: `${TOKEN_DAYS}d` });
}
