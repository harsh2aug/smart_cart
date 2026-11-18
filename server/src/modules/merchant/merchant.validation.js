import { z } from 'zod';
import { businessName, ownerName } from '../auth/auth.validation.js';

// Optional text: an empty input ("") is saved as null, so "empty" and "not filled" are the same
function optionalText(max, label) {
  return z
    .string()
    .trim()
    .max(max, `${label} must be at most ${max} characters`)
    .nullable()
    .transform((value) => value || null);
}

// Only these fields can be changed. Anything else in the body (phone, slug, isActive...)
// is dropped by Zod, so nobody can change them by adding them to the request.
// .partial() = every field is optional (PATCH: send only what you want to change)
export const updateProfileSchema = z
  .object({
    businessName,
    ownerName,
    description: optionalText(500, 'Description'),
    address: optionalText(255, 'Address'),
    city: optionalText(100, 'City'),
  })
  .partial();

export const updateStatusSchema = z.object({
  isOpen: z.boolean({ error: 'isOpen must be true or false' }),
});
