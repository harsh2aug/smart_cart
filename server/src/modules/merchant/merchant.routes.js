import { Router } from 'express';
import { requireVerifiedMerchant } from '../../middlewares/requireVerifiedMerchant.js';
import { getProfile, updateProfile, updateStatus } from './merchant.controller.js';

// These paths are added after /api/v1/merchant (see app.js)
const router = Router();

// Runs before every route below: only logged-in merchants with a verified email
router.use(requireVerifiedMerchant);

router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.patch('/status', updateStatus);

export default router;
