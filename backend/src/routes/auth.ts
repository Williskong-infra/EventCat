import { Router } from 'express';
import { register, login, verifyEmail } from '../controllers/authController';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.post('/verify-email', asyncHandler(verifyEmail));

export default router; 