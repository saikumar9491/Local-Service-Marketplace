import express from 'express';
import { registerWorker, getPendingWorkers, approveWorker, rejectWorker, getNearbyWorkers } from '../controllers/worker.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.post('/register', protectRoute, registerWorker);
router.get('/pending', protectRoute, getPendingWorkers); // Admin only internally handled
router.post('/approve/:workerId', protectRoute, approveWorker); // Admin only internally handled
router.post('/reject/:workerId', protectRoute, rejectWorker); // Admin only internally handled
router.get('/nearby', protectRoute, getNearbyWorkers);

export default router;
