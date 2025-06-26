import { Router } from 'express';
import { register, login, verifyEmail, getProfile, updateProfile } from '../controllers/authController';
import asyncHandler from '../utils/asyncHandler';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.post('/verify-email', asyncHandler(verifyEmail));
router.get('/profile', auth, asyncHandler(getProfile));
router.put('/profile', auth, asyncHandler(updateProfile));

export default router; 