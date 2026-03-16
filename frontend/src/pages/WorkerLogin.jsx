import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import { motion } from "framer-motion";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const WorkerLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { authUser } = useAuthContext();
    const { loading, login } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
        
        // After successful login, the context will update.
        // If they are not a worker, we should ideally log them out or redirect them.
        setTimeout(() => {
             const user = JSON.parse(localStorage.getItem("service-market-user"));
             if (user && user.role !== 'worker') {
                 toast.error("Access denied. Not a worker account.");
                 navigate("/"); // Redirect non-workers away
             } else if (user && user.role === 'worker') {
                 navigate("/"); // or worker dashboard if one exists
             }
        }, 500); // slight delay to allow local storage update
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Blobs - Yellow Theme for Worker */}
            <div className="absolute top-1/4 -left-12 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob"></div>
            <div className="absolute bottom-1/4 -right-12 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-2000"></div>

            <motion.div 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-white/70 backdrop-blur-xl border border-white p-8 rounded-2xl shadow-xl w-full max-w-md relative z-10"
            >
                <h1 className='text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-orange-500 tracking-tight'>
                    Worker Portal
                </h1>
                <p className="text-center text-slate-500 mt-2 font-medium">Login to manage your services.</p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                        <label className='block text-sm font-semibold text-slate-700 mb-1'>
                            Email
                        </label>
                        <input
                            type='email'
                            placeholder='Enter Email'
                            className='w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all shadow-sm'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-semibold text-slate-700 mb-1'>
                            Password
                        </label>
                        <input
                            type='password'
                            placeholder='Enter Password'
                            className='w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all shadow-sm'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="text-sm flex justify-between pt-2">
                        <Link to='/forgot-password' className='font-bold text-slate-500 hover:text-slate-800 hover:underline transition-colors' >
                            Forgot Password?
                        </Link>
                        <div>
                            <span className="text-slate-500 font-medium">Want to provide services? </span>
                            <Link to='/register-worker' className='font-bold text-yellow-500 hover:text-yellow-600 hover:underline transition-colors' >
                                Register Here
                            </Link>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className='w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 shadow-lg transform transition hover:-translate-y-0.5 disabled:opacity-50'
                            disabled={loading}
                        >
                            {loading ? <span className='animate-spin mr-2 border-b-2 border-white rounded-full w-4 h-4 inline-block'></span> : "Login as Worker"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};
export default WorkerLogin;
