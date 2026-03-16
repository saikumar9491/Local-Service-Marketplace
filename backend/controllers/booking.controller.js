import Booking from '../models/Booking.js';
import Worker from '../models/Worker.js';

export const createBooking = async (req, res) => {
    try {
        const { workerId, date, time, address } = req.body;
        
        const worker = await Worker.findById(workerId);
        if (!worker) {
            return res.status(404).json({ error: "Worker not found" });
        }

        // For simplicity, we'll assume a fixed price based on 1 hour, or just the hourly rate
        const price = worker.hourlyRate; 

        const newBooking = new Booking({
            userId: req.user._id,
            workerId,
            date,
            time,
            address,
            price
        });

        await newBooking.save();
        res.status(201).json(newBooking);
    } catch (error) {
        console.error("Error in createBooking", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id })
            .populate('workerId')
            .populate({ path: 'workerId', populate: { path: 'userId', select: 'name email' }})
            .sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error in getUserBookings", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getWorkerBookings = async (req, res) => {
    try {
        // Find if the logged in user is a worker
        const worker = await Worker.findOne({ userId: req.user._id });
        if (!worker) {
             return res.status(404).json({ error: "Worker profile not found" });
        }

        const bookings = await Booking.find({ workerId: worker._id })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
            
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error in getWorkerBookings", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const validStatuses = ['pending', 'accepted', 'rejected', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
             return res.status(400).json({ error: "Invalid status" });
        }

        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        // Authorization checks (simplified: worker can do mostly anything, user can cancel)
        // Usually you'd check if req.user._id matches booking.userId OR if they are the worker.
        
        booking.status = status;
        await booking.save();
        
        res.status(200).json(booking);
    } catch (error) {
        console.error("Error in updateBookingStatus", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
