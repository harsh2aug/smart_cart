import { z } from 'zod';

// Indian mobile number: 10 digits, starting with 6, 7, 8 or 9
const phone = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number');

const email = z.string().trim().toLowerCase().pipe(z.email('Enter a valid email address'));

// bcrypt only uses the first 72 bytes of a password, so we limit the length
const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be at most 72 characters');

// Also used by the profile form (merchant.validation.js), so both follow the same rules
export const businessName = z
  .string()
  .trim()
  .min(2, 'Business name is too short')
  .max(100, 'Business name is too long');

export const ownerName = z
  .string()
  .trim()
  .min(2, 'Owner name is too short')
  .max(100, 'Owner name is too long');

export const registerSchema = z.object({
  businessName,
  ownerName,
  phone,
  email,
  password,
});

export const loginSchema = z.object({
  phone,
  password: z.string().min(1, 'Password is required'),
});

const otp = z
  .string()
  .trim()
  .regex(/^\d{6}$/, 'Enter the 6-digit code');

export const verifyEmailSchema = z.object({ otp });

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z.object({ email, otp, password });
