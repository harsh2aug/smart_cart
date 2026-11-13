import bcrypt from 'bcryptjs';
import { randomInt } from 'node:crypto';
import prisma from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';

export const OTP_MINUTES = 10; // a code works for 10 minutes
const MAX_ATTEMPTS = 5; // after 5 wrong tries the code is deleted
const RESEND_SECONDS = 60; // wait 1 minute before asking for another code

// Makes a new 6-digit code, saves its hash and returns the real code (to be emailed).
// Asking again replaces the old code, so only the newest one works.
export async function createOtp(merchantId, purpose) {
  const existing = await prisma.emailOtp.findUnique({
    where: { merchantId_purpose: { merchantId, purpose } },
  });
  if (existing) {
    const secondsPassed = (Date.now() - existing.sentAt.getTime()) / 1000;
    if (secondsPassed < RESEND_SECONDS) {
      const wait = Math.ceil(RESEND_SECONDS - secondsPassed);
      throw new AppError(429, `Please wait ${wait} seconds before asking for a new code`);
    }
  }

  // randomInt is secure random; Math.random() can be guessed
  const code = randomInt(0, 1_000_000).toString().padStart(6, '0');
  const fields = {
    codeHash: await bcrypt.hash(code, 10),
    expiresAt: new Date(Date.now() + OTP_MINUTES * 60 * 1000),
    attempts: 0,
    sentAt: new Date(),
  };

  // upsert = update the row if it exists, otherwise create it
  await prisma.emailOtp.upsert({
    where: { merchantId_purpose: { merchantId, purpose } },
    update: fields,
    create: { merchantId, purpose, ...fields },
  });
  return code;
}

// Checks a code. Throws an error if it is wrong; deletes it once it is used.
export async function useOtp(merchantId, purpose, code) {
  const where = { merchantId_purpose: { merchantId, purpose } };
  const otp = await prisma.emailOtp.findUnique({ where });

  if (!otp) {
    throw new AppError(400, 'No code found. Please ask for a new code.');
  }
  if (otp.expiresAt < new Date()) {
    await prisma.emailOtp.delete({ where });
    throw new AppError(400, 'This code has expired. Please ask for a new code.');
  }

  const isMatch = await bcrypt.compare(code, otp.codeHash);
  if (!isMatch) {
    const attempts = otp.attempts + 1;
    if (attempts >= MAX_ATTEMPTS) {
      await prisma.emailOtp.delete({ where });
      throw new AppError(400, 'Too many wrong tries. Please ask for a new code.');
    }
    await prisma.emailOtp.update({ where, data: { attempts } });
    const left = MAX_ATTEMPTS - attempts;
    throw new AppError(400, `Wrong code. ${left} ${left === 1 ? 'try' : 'tries'} left.`);
  }

  await prisma.emailOtp.delete({ where }); // a code works only once
}
