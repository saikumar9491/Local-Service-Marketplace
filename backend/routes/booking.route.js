import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { createBooking, getUserBookings, getWorkerBookings, updateBookingStatus } from '../controllers/booking.controller.js';

const router = express.Router();

router.post('/', protectRoute, createBooking);
router.get('/user', protectRoute, getUserBookings);
router.get('/worker', protectRoute, getWorkerBookings);
router.put('/:id/status', protectRoute, updateBookingStatus);

export default router;
