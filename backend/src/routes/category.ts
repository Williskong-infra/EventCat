import { Router } from 'express';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../controllers/categoryController';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

router.route('/').get(asyncHandler(getCategories)).post(asyncHandler(addCategory));

router.route('/:id').put(asyncHandler(updateCategory)).delete(asyncHandler(deleteCategory));

export default router; 