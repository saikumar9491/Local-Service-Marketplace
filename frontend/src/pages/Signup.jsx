import { useState } from "react";
import { Link } from "react-router-dom";
import useSignup from "../hooks/useSignup";
import { motion } from "framer-motion";

const Signup = () => {
	const [inputs, setInputs] = useState({
		name: "",
		email: "",
		password: "",
        otp: "",
	});
    const [otpSent, setOtpSent] = useState(false);

	const { loading, sendOtp, verifyOtp } = useSignup();

	const handleSubmitParams = async (e) => {
		e.preventDefault();
		const success = await sendOtp(inputs);
        if(success) setOtpSent(true);
	};

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        await verifyOtp(inputs);
    };

	return (
		<div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Blobs */}
            <div className="absolute top-1/4 -right-12 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob"></div>
            <div className="absolute bottom-1/4 -left-12 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-2000"></div>

			<motion.div 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-white/70 backdrop-blur-xl border border-white p-8 rounded-2xl shadow-xl w-full max-w-md relative z-10 my-8"
            >
				<h1 className='text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 tracking-tight'>
					Join ServiceMarket
				</h1>
				<p className="text-center text-slate-500 mt-2 font-medium">Create your account to get started.</p>

				{!otpSent ? (
                    <form onSubmit={handleSubmitParams} className="mt-8 space-y-4">
                        <div>
                            <label className='block text-sm font-semibold text-slate-700 mb-1'>Full Name</label>
                            <input
                                type='text'
                                placeholder='John Doe'
                                className='w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm'
                                value={inputs.name}
                                onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-semibold text-slate-700 mb-1'>Email</label>
                            <input
                                type='email'
                                placeholder='john@example.com'
                                className='w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm'
                                value={inputs.email}
                                onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-semibold text-slate-700 mb-1'>Password</label>
                            <input
                                type='password'
                                placeholder='Enter Password'
                                className='w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm'
                                value={inputs.password}
                                onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                            />
                        </div>

                        <div className="text-sm flex justify-between pt-2">
                            <span className="text-slate-500 font-medium">Already have an account? </span>
                            <Link to='/login' className='font-bold text-blue-600 hover:text-blue-500 hover:underline transition-colors'>
                                Login
                            </Link>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className='w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg transform transition hover:-translate-y-0.5 disabled:opacity-50'
                                disabled={loading}
                            >
                                {loading ? <span className='animate-spin mr-2 border-b-2 border-white rounded-full w-4 h-4 inline-block'></span> : "Sign Up"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="mt-8 space-y-4">
                        <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm font-medium border border-blue-100">
                            We've sent a 6-digit confirmation code to <span className="font-bold">{inputs.email}</span>. Please enter it below.
                        </div>

                        <div>
                            <label className='block text-sm font-semibold text-slate-700 mb-1'>Confirmation Code</label>
                            <input
                                type='text'
                                placeholder='123456'
                                maxLength={6}
                                className='w-full px-4 py-3 rounded-xl text-center text-lg tracking-widest font-bold border border-slate-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm'
                                value={inputs.otp}
                                onChange={(e) => setInputs({ ...inputs, otp: e.target.value })}
                            />
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setOtpSent(false)}
                                className='flex-1 py-3 px-4 border border-slate-200 text-sm font-bold rounded-xl text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 shadow-sm transition'
                                disabled={loading}
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className='flex-[2] flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg transform transition hover:-translate-y-0.5 disabled:opacity-50'
                                disabled={loading}
                            >
                                {loading ? <span className='animate-spin mr-2 border-b-2 border-white rounded-full w-4 h-4 inline-block'></span> : "Verify & Create Account"}
                            </button>
                        </div>
                    </form>
                )}
			</motion.div>
		</div>
	);
};
export default Signup;
