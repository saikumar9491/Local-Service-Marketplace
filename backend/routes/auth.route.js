import express from 'express';
import { login, logout, getMe, sendSignupOtp, verifySignupOtp, sendForgotPasswordOtp, resetPassword, sendAdminCreationOtp, verifyAdminCreationOtp } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.post('/send-signup-otp', sendSignupOtp);
router.post('/verify-signup-otp', verifySignupOtp);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protectRoute, getMe);
router.post('/send-forgot-password-otp', sendForgotPasswordOtp);
router.post('/reset-password', resetPassword);

// New Admin Creation routes
router.post('/send-admin-creation-otp', sendAdminCreationOtp);
router.post('/verify-admin-creation-otp', verifyAdminCreationOtp);
export default router;
