import { Router } from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController';
import { auth } from '../middleware/auth';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

router.route('/').get(asyncHandler(getEvents)).post(auth, asyncHandler(createEvent));

router
  .route('/:id')
  .get(asyncHandler(getEventById))
  .put(auth, asyncHandler(updateEvent))
  .delete(auth, asyncHandler(deleteEvent));

export default router; 