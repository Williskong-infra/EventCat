import { Router } from 'express';
import { getCategories } from '../controllers/categoryController';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

router.route('/').get(asyncHandler(getCategories));

export default router; 