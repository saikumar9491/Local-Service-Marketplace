import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Worker from '../models/Worker.js';

export const createReview = async (req, res) => {
    try {
        const { bookingId, rating, comment } = req.body;
        
        const booking = await Booking.findById(bookingId);
        if (!booking) {
             return res.status(404).json({ error: "Booking not found" });
        }
        
        // Ensure user owns this booking
        if (booking.userId.toString() !== req.user._id.toString()) {
             return res.status(403).json({ error: "Not authorized to review this booking" });
        }

        // Ensure booking is completed
        if (booking.status !== 'completed') {
             return res.status(400).json({ error: "Cannot review an incomplete booking" });
        }

        // Check for existing review
        const existingReview = await Review.findOne({ bookingId });
        if (existingReview) {
             return res.status(400).json({ error: "Review already exists for this booking" });
        }

        const newReview = new Review({
            bookingId,
            userId: req.user._id,
            workerId: booking.workerId,
            rating,
            comment
        });

        await newReview.save();

        // Update Worker's average rating
        const allReviews = await Review.find({ workerId: booking.workerId });
        const totalRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
        const averageRating = totalRating / allReviews.length;

        await Worker.findByIdAndUpdate(booking.workerId, {
            rating: averageRating,
            reviewsCount: allReviews.length
        });

        res.status(201).json(newReview);
    } catch (error) {
        console.error("Error in createReview", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getWorkerReviews = async (req, res) => {
    try {
        const { workerId } = req.params;
        const reviews = await Review.find({ workerId })
                                  .populate('userId', 'name')
                                  .sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error in getWorkerReviews", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
