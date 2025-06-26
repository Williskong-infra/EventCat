import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../controllers/cartController';
import { auth } from '../middleware/auth';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

router.get('/', auth, asyncHandler(getCart));
router.post('/add', auth, asyncHandler(addToCart));
router.post('/update', auth, asyncHandler(updateCartItem));
router.post('/remove', auth, asyncHandler(removeCartItem));
router.post('/clear', auth, asyncHandler(clearCart));

export default router; 