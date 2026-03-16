import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [newPassword, setNewPassword] = useState("");
	
	const [step, setStep] = useState(1);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSendOtp = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setMessage("");
		
		try {
			const res = await fetch("/api/auth/send-forgot-password-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);
			
			setMessage(data.message);
			setStep(2);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleResetPassword = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setMessage("");
		
		try {
			const res = await fetch("/api/auth/reset-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, otp, newPassword }),
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);
			
			setMessage(data.message);
			setTimeout(() => {
				navigate('/login');
			}, 2000);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            <div className="absolute top-1/4 -right-12 w-80 h-80 bg-red-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob"></div>
            <div className="absolute bottom-1/4 -left-12 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-2000"></div>

			<motion.div 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-white/70 backdrop-blur-xl border border-white p-8 rounded-2xl shadow-xl w-full max-w-md relative z-10"
            >
				<h1 className='text-3xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500 tracking-tight'>
					Reset Password
				</h1>
				<p className="text-center text-slate-500 mt-2 font-medium mb-6">
					{step === 1 ? "Enter your email to receive an OTP." : "Enter the OTP and your new password."}
				</p>

				{error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">{error}</div>}
				{message && <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4 border border-green-100">{message}</div>}

				{step === 1 ? (
					<form onSubmit={handleSendOtp} className="space-y-4">
						<div>
							<label className='block text-sm font-semibold text-slate-700 mb-1'>Email Address</label>
							<input
								type='email'
								required
								placeholder='Enter registered email'
								className='w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-400 transition-all shadow-sm'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<button
							type="submit"
							className='w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-lg transform transition hover:-translate-y-0.5 disabled:opacity-50'
							disabled={loading}
						>
							{loading ? <span className='animate-spin mr-2 border-b-2 border-white rounded-full w-4 h-4 inline-block'></span> : "Send Reset OTP"}
						</button>
					</form>
				) : (
					<form onSubmit={handleResetPassword} className="space-y-4">
						<div>
							<label className='block text-sm font-semibold text-slate-700 mb-1'>OTP Code</label>
							<input
								type='text'
								maxLength={6}
								required
								placeholder='123456'
								className='w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-400 transition-all shadow-sm text-center tracking-widest font-bold'
								value={otp}
								onChange={(e) => setOtp(e.target.value)}
							/>
						</div>
						<div>
							<label className='block text-sm font-semibold text-slate-700 mb-1'>New Password</label>
							<input
								type='password'
								required
								placeholder='Enter new password'
								className='w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-400 transition-all shadow-sm'
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
							/>
						</div>
						<button
							type="submit"
							className='w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-lg transform transition hover:-translate-y-0.5 disabled:opacity-50'
							disabled={loading}
						>
							{loading ? <span className='animate-spin mr-2 border-b-2 border-white rounded-full w-4 h-4 inline-block'></span> : "Reset Password"}
						</button>
					</form>
				)}

				<div className="mt-6 text-center">
					<Link to='/login' className='text-sm font-bold text-slate-500 hover:text-slate-800 hover:underline transition-colors'>
						&larr; Back to Login
					</Link>
				</div>
			</motion.div>
		</div>
	);
};
export default ForgotPassword;
