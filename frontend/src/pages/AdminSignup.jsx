import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const AdminSignup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/auth/send-admin-creation-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newAdminEmail: email }),
            });
            const data = await res.json();

            if (data.error) throw new Error(data.error);
            toast.success("Authorization requested! Superadmin must provide the OTP.");
            setStep(2);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/auth/verify-admin-creation-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, otp }),
            });
            const data = await res.json();
            
            if (data.error) throw new Error(data.error);
            
            localStorage.setItem("service-market-user", JSON.stringify(data));
            toast.success("Admin Profile Created Successfully!");
            // Full reload or AuthContext update might be needed depending on implementation.
            // A simple reload ensures the context picks up the new localstorage cleanly
            window.location.href = '/admin';
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            <div className="absolute top-1/4 -right-12 w-80 h-80 bg-zinc-800 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute bottom-1/4 -left-12 w-80 h-80 bg-amber-900 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
                className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-700 p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10"
            >
                <div className="flex justify-center mb-4">
                   <div className="p-3 bg-amber-500/10 rounded-full">
                     <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                   </div>
                </div>
                <h1 className='text-3xl font-extrabold text-center text-white tracking-tight mb-2'>
                    Create Admin
                </h1>
                
                {step === 1 ? (
                    <>
                        <p className="text-center text-zinc-400 mb-6 text-sm">Step 1: Request Authorization</p>
                        <form onSubmit={handleSendOtp} className="space-y-4">
                            <div>
                                <label className='block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1'>New Admin Email</label>
                                <input
                                    type='email' placeholder='admin@example.com' required
                                    className='w-full px-4 py-3 rounded-lg border border-zinc-700 bg-zinc-800 text-white focus:outline-none focus:border-amber-500 transition-colors'
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit" disabled={loading}
                                className='mt-6 w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-lg border border-zinc-600 transition-colors flex justify-center'
                            >
                                {loading ? <span className='animate-spin border-b-2 border-white rounded-full w-4 h-4'></span> : "Request Superadmin OTP"}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <p className="text-center text-amber-500 mb-6 text-sm font-medium">Step 2: Authenticate and Provide Details</p>
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                            <div>
                                <label className='block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1'>Full Name</label>
                                <input
                                    type='text' placeholder='Admin Name' required
                                    className='w-full px-4 py-3 rounded-lg border border-zinc-700 bg-zinc-800 text-white focus:outline-none focus:border-amber-500 transition-colors'
                                    value={name} onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className='block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1'>Password</label>
                                <input
                                    type='password' placeholder='••••••••' required minLength={6}
                                    className='w-full px-4 py-3 rounded-lg border border-zinc-700 bg-zinc-800 text-white focus:outline-none focus:border-amber-500 transition-colors'
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className='block text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1 mt-2'>Superadmin OTP</label>
                                <input
                                    type='text' placeholder='Enter 6-digit code' required maxLength={6}
                                    className='w-full px-4 py-3 rounded-lg border border-amber-500/50 bg-amber-900/20 text-white focus:outline-none focus:border-amber-500 focus:bg-amber-900/40 transition-colors text-center font-mono tracking-[0.5em] text-xl'
                                    value={otp} onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                            
                            <button
                                type="submit" disabled={loading}
                                className='mt-6 w-full py-3 bg-amber-500 hover:bg-amber-600 text-zinc-900 font-bold rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all flex justify-center'
                            >
                                {loading ? <span className='animate-spin border-b-2 border-zinc-900 rounded-full w-4 h-4'></span> : "Create Account"}
                            </button>
                            
                            <button type="button" onClick={() => setStep(1)} className="w-full text-center text-zinc-500 hover:text-zinc-300 text-sm mt-2">
                                ← Back
                            </button>
                        </form>
                    </>
                )}

                <div className="mt-6 text-center text-sm border-t border-zinc-800 pt-4">
                    <Link to='/admin/login' className='text-zinc-400 hover:text-white transition-colors' >
                        Already have access? <span className="text-amber-500">Log In</span>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};
export default AdminSignup;
