import User from '../models/User.js';
import OTP from '../models/OTP.js';
import bcryptjs from 'bcryptjs';
import { generateTokenAndSetCookie } from '../utils/generateToken.js';
import { sendEmail } from '../utils/emailService.js';
export const sendSignupOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered. Please login." });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save/Update OTP in DB
    await OTP.deleteMany({ email, type: 'signup' });
    const newOtp = new OTP({ email, otp, type: 'signup' });
    await newOtp.save();
    
    // Send email
    await sendEmail(email, "Your ServiceMarket Signup OTP", `Your OTP to verify your account is: ${otp}`, `<h3>Your account verification code is <b>${otp}</b>. It will expire in 10 minutes.</h3>`);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log("Error in sendSignupOtp controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const verifySignupOtp = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    const otpRecord = await OTP.findOne({ email, otp, type: 'signup' });
    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    // Prevent direct admin account creation via signup endpoint!
    // Hardcode role to 'user' for safety, unless the email is the superadmin email.
    let role = 'user';
    if (email === 'balisaikumar9491@gmail.com') {
      role = 'admin';
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      
      // Clean up OTP
      await OTP.deleteMany({ email, type: 'signup' });

      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in verifySignupOtp controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendForgotPasswordOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "No account found with this email" });
        }
        
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await OTP.deleteMany({ email, type: 'forgot_password' });
        
        const newOtp = new OTP({ email, otp, type: 'forgot_password' });
        await newOtp.save();
        
        await sendEmail(email, "Password Reset OTP", `Your password reset OTP is ${otp}`, `<h3>Your password reset code is <b style="font-size: 24px;">${otp}</b>. It will expire in 10 minutes.</h3>`);
        
        res.status(200).json({ message: "Password reset OTP sent to email" });
    } catch (error) {
        console.log("Error in sendForgotPasswordOtp", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        
        const otpRecord = await OTP.findOne({ email, otp, type: 'forgot_password' });
        if (!otpRecord) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }
        
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);
        
        await User.updateOne({ email }, { password: hashedPassword });
        await OTP.deleteMany({ email, type: 'forgot_password' });
        
        res.status(200).json({ message: "Password updated successfully! You can now login." });
    } catch (error) {
         console.log("Error in resetPassword", error);
         res.status(500).json({ error: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isPasswordCorrect = await bcryptjs.compare(password, user?.password || "");

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getMe controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendAdminCreationOtp = async (req, res) => {
  try {
    const { newAdminEmail } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(newAdminEmail)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email: newAdminEmail });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered. Please login." });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save/Update OTP in DB for the NEW admin email.
    // The type 'admin_creation' will separate it from normal signups
    await OTP.deleteMany({ email: newAdminEmail, type: 'admin_creation' });
    const newOtp = new OTP({ email: newAdminEmail, otp, type: 'admin_creation' });
    await newOtp.save();
    
    // Hardcoded Superadmin Email
    const superAdminEmail = 'balisaikumar9491@gmail.com';

    // Send email to SUPERADMIN
    await sendEmail(superAdminEmail, "Admin Creation OTP Request", `Someone is trying to create a new admin account for ${newAdminEmail}. Your OTP is: ${otp}`, `<h3>Someone requested to create a new admin account for <b>${newAdminEmail}</b>.</h3><p>Your authorization code is <b style="font-size: 24px;">${otp}</b>. It will expire in 10 minutes.</p>`);

    res.status(200).json({ message: "OTP sent successfully to the Superadmin email." });
  } catch (error) {
    console.log("Error in sendAdminCreationOtp controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const verifyAdminCreationOtp = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    // The 'email' here is the newAdminEmail
    const otpRecord = await OTP.findOne({ email, otp, type: 'admin_creation' });
    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'admin' // Explicitly granting admin role
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      
      // Clean up OTP
      await OTP.deleteMany({ email, type: 'admin_creation' });

      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in verifyAdminCreationOtp controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
