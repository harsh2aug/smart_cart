import { Router } from 'express';
import { login, logout, register } from './auth.controller.js';

// These paths are added after /api/v1/auth (see app.js)
const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

export default router;
