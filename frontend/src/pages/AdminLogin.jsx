import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { loading, login } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
        
        setTimeout(() => {
             const user = JSON.parse(localStorage.getItem("service-market-user"));
             if (user && user.role !== 'admin') {
                 toast.error("Access denied. Admin privileges required.");
                 navigate("/"); 
             } else if (user && user.role === 'admin') {
                 navigate("/admin");
             }
        }, 500); 
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Blobs - Dark/Yellow Theme for Admin */}
            <div className="absolute top-1/4 -left-12 w-80 h-80 bg-zinc-800 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute bottom-1/4 -right-12 w-80 h-80 bg-yellow-900 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            <motion.div 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-700 p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10"
            >
                <div className="flex justify-center mb-6">
                   <div className="p-3 bg-yellow-500/10 rounded-full">
                     <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                   </div>
                </div>
                <h1 className='text-3xl font-extrabold text-center text-white tracking-tight'>
                    Admin Secured Login
                </h1>
                
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                        <label className='block text-sm font-semibold text-zinc-400 mb-1'>
                            Admin Email
                        </label>
                        <input
                            type='email'
                            placeholder='admin@example.com'
                            className='w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800/50 text-white placeholder-zinc-500 focus:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all shadow-inner'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-semibold text-zinc-400 mb-1'>
                            Password
                        </label>
                        <input
                            type='password'
                            placeholder='••••••••'
                            className='w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800/50 text-white placeholder-zinc-500 focus:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all shadow-inner'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            className='w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-zinc-900 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 focus:ring-offset-zinc-900 shadow-[0_0_15px_rgba(250,204,21,0.3)] transform transition hover:-translate-y-0.5 disabled:opacity-50'
                            disabled={loading}
                        >
                            {loading ? <span className='animate-spin mr-2 border-b-2 border-zinc-900 rounded-full w-4 h-4 inline-block'></span> : "Access System"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};
export default AdminLogin;
