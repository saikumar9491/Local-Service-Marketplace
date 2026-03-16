import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import Booking from '../models/Booking.js';

const router = express.Router();

router.post('/:bookingId', protectRoute, async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        // Extremely simplified mock payment logic.
        booking.paymentStatus = 'paid';
        await booking.save();

        res.status(200).json({ message: "Payment successful", booking });
    } catch (error) {
        console.error("Error in mock payment route", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
