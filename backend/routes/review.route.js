import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { createReview, getWorkerReviews } from '../controllers/review.controller.js';

const router = express.Router();

router.post('/', protectRoute, createReview);
router.get('/worker/:workerId', getWorkerReviews); // Public or protect, keeping public for showing on profiles

export default router;
