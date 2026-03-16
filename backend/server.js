import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';

import authRoutes from './routes/auth.route.js';
import workerRoutes from './routes/worker.route.js';
import bookingRoutes from './routes/booking.route.js';
import paymentRoutes from './routes/payment.route.js';
import reviewRoutes from './routes/review.route.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/local-services';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use('/api/auth', authRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(process.cwd(), "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(process.cwd(), "../frontend/dist", "index.html"));
    });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
