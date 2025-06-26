import { Router } from 'express';
import { createOrder, getOrders, getOrderById } from '../controllers/orderController';
import { auth } from '../middleware/auth';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

router.post('/', auth, asyncHandler(createOrder));
router.get('/', auth, asyncHandler(getOrders));
router.get('/:id', auth, asyncHandler(getOrderById));

export default router; 