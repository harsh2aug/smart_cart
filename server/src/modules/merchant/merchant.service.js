import prisma from '../../config/prisma.js';
import { withoutPassword } from '../../utils/withoutPassword.js';

// Saves the given fields (already checked by Zod) and returns the updated merchant
export async function updateMerchant(merchantId, data) {
  const merchant = await prisma.merchant.update({ where: { id: merchantId }, data });
  return withoutPassword(merchant);
}
