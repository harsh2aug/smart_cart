import { updateMerchant } from './merchant.service.js';
import { updateProfileSchema, updateStatusSchema } from './merchant.validation.js';

// req.merchant was loaded by requireVerifiedMerchant (see merchant.routes.js)

export function getProfile(req, res) {
  res.json({ merchant: req.merchant });
}

export async function updateProfile(req, res) {
  const data = updateProfileSchema.parse(req.body);
  const merchant = await updateMerchant(req.merchant.id, data);
  res.json({ merchant });
}

// Open = customers can order. Closed = the menu shows "closed".
export async function updateStatus(req, res) {
  const { isOpen } = updateStatusSchema.parse(req.body);
  const merchant = await updateMerchant(req.merchant.id, { isOpen });
  res.json({ merchant });
}
