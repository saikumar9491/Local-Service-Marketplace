import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        otp: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['signup', 'forgot_password'],
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 600, // 600 seconds = 10 minutes document expiration
        },
    }
);

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;
