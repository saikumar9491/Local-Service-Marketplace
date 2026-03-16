import { useState, useEffect } from "react";
import useLogout from "../hooks/useLogout";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const AdminDashboard = () => {
    const [pendingWorkers, setPendingWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { logout } = useLogout();

    const fetchPendingWorkers = async () => {
        try {
            const res = await fetch("/api/workers/pending");
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setPendingWorkers(data);
        } catch (error) {
            console.error(error);
            alert("Failed to fetch pending workers");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchPendingWorkers();
    }, []);

    const handleApprove = async (workerId) => {
        try {
            const res = await fetch(`/api/workers/approve/${workerId}`, {
                method: "POST",
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            
            // Remove approved worker from list
            setPendingWorkers(pendingWorkers.filter(w => w._id !== workerId));
            // alert("Worker approved successfully");
        } catch (error) {
            alert(error.message);
        }
    };

    const handleReject = async (workerId) => {
        if (!window.confirm("Are you sure you want to reject this worker application?")) return;
        
        try {
            const res = await fetch(`/api/workers/reject/${workerId}`, {
                method: "POST",
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            
            // Remove rejected worker from list
            setPendingWorkers(pendingWorkers.filter(w => w._id !== workerId));
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans pb-12">
            {/* Background Blobs */}
            <div className="absolute top-1/4 -left-12 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute bottom-1/4 -right-12 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                        <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900 tracking-tight">Admin Dashboard</h1>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex gap-3">
                        <Link to="/" className="text-sm bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-medium shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
                            Home
                        </Link>
                        <button onClick={logout} className="text-sm bg-slate-800 text-white px-4 py-2 rounded-xl font-medium shadow-sm hover:bg-slate-900 transition-all">
                            Logout
                        </button>
                    </motion.div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 mt-8 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white p-8"
                >
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-200">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Pending Approvals</h2>
                            <p className="text-slate-500 text-sm font-medium mt-1">Review and manage worker registration requests.</p>
                        </div>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center items-center py-20 text-blue-600">
                             <span className="animate-spin mr-3 border-b-2 border-blue-600 rounded-full w-8 h-8 inline-block"></span>
                             <span className="font-semibold text-lg text-slate-600">Loading requests...</span>
                        </div>
                    ) : pendingWorkers.length === 0 ? (
                        <div className="text-center py-16 bg-slate-50/50 rounded-2xl border border-slate-100 border-dashed">
                            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <p className="text-xl font-bold text-slate-700">All caught up!</p>
                            <p className="text-slate-500 mt-2">There are no pending worker registrations to review right now.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-200 text-sm">
                                        <th className="p-4 font-bold text-slate-700 uppercase tracking-wider">Applicant</th>
                                        <th className="p-4 font-bold text-slate-700 uppercase tracking-wider">Service</th>
                                        <th className="p-4 font-bold text-slate-700 uppercase tracking-wider">Rate / Hr</th>
                                        <th className="p-4 font-bold text-slate-700 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {pendingWorkers.map((worker) => (
                                            <motion.tr 
                                                initial={{ opacity: 0, backgroundColor: "#f8fafc" }} 
                                                animate={{ opacity: 1, backgroundColor: "#ffffff" }} 
                                                exit={{ opacity: 0, x: -20, backgroundColor: "#f1f5f9" }}
                                                key={worker._id} 
                                                className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group"
                                            >
                                                <td className="p-4">
                                                    <div className="font-bold text-slate-900">{worker.userId?.name}</div>
                                                    <div className="text-xs text-slate-500 font-medium">{worker.userId?.email}</div>
                                                    <div className="text-xs text-slate-500 mt-0.5">Experience: <span className="font-bold text-slate-700">{worker.experienceYears}y</span></div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold capitalize bg-blue-50 text-blue-700 border border-blue-100">
                                                        {worker.serviceType}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-bold text-emerald-600">${worker.hourlyRate}</div>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex gap-2 justify-end">
                                                        <button 
                                                            onClick={() => handleApprove(worker._id)}
                                                            className="bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-600 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button 
                                                            onClick={() => handleReject(worker._id)}
                                                            className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
};

export default AdminDashboard;
