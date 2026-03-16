import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import useLogout from "../hooks/useLogout";
import MockPaymentModal from "../components/MockPaymentModal";
import ReviewModal from "../components/ReviewModal";
import { motion, AnimatePresence } from "framer-motion";

const Bookings = () => {
    const { authUser } = useAuthContext();
    const { logout } = useLogout();
    
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modals state
    const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);
    const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);

    const isWorker = authUser?.role === 'user' && bookings.length > 0 && bookings[0].workerId?.userId?._id === authUser._id; 
    // Wait, the API specifies `/api/bookings/user` vs `/api/bookings/worker`.
    // It's better to check if we are rendering worker view or user view based on a toggle or fetch.
    const [viewMode, setViewMode] = useState("user"); // "user" or "worker"

    const fetchBookings = async (mode) => {
        setLoading(true);
        try {
            const endpoint = mode === "worker" ? "/api/bookings/worker" : "/api/bookings/user";
            const res = await fetch(endpoint);
            const data = await res.json();
            
            if (!data.error) {
                setBookings(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings(viewMode);
    }, [viewMode]);

    const updateBookingStatus = async (bookingId, newStatus) => {
        try {
            const res = await fetch(`/api/bookings/${bookingId}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await res.json();
            if (!data.error) {
                // Refresh list
                fetchBookings(viewMode);
            }
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const handlePaymentSuccess = (bookingId) => {
        fetchBookings(viewMode);
    };

    const handleReviewSuccess = () => {
        alert("Review submitted successfully!");
        fetchBookings(viewMode);
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'pending': return 'bg-yellow-50 text-yellow-600 border border-yellow-200';
            case 'accepted': return 'bg-blue-50 text-blue-600 border border-blue-200';
            case 'completed': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
            case 'rejected': 
            case 'cancelled': return 'bg-red-50 text-red-600 border border-red-200';
            default: return 'bg-slate-100 text-slate-700 border border-slate-200';
        }
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };
    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen bg-soft-white relative overflow-hidden font-sans text-slate-900">
            {/* Background Image and Overlays */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-soft-white pointer-events-none">
                <img 
                    src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop" 
                    alt="Background" 
                    className="w-full h-full object-cover opacity-[0.03] animate-ken-burns mix-blend-multiply"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-soft-white/90 via-soft-white/70 to-soft-white/95 z-10"></div>
            </div>

            {/* Glowing Blobs */}
            <div className="absolute top-20 -left-20 w-96 h-96 bg-yellow-300 rounded-full filter blur-[120px] opacity-40 animate-blob pointer-events-none z-10"></div>
            <div className="absolute bottom-20 -right-20 w-96 h-96 bg-amber-200 rounded-full filter blur-[120px] opacity-40 animate-blob animation-delay-2000 pointer-events-none z-10"></div>

            <header className="bg-white/70 backdrop-blur-2xl shadow-sm border-b border-slate-200 sticky top-0 z-40 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                        <Link to="/" className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-amber-500 tracking-tight">ServiceMarket</Link>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-4">
                        <Link to="/" className="text-sm border border-slate-200 text-slate-700 px-5 py-2.5 rounded-full font-bold hover:bg-slate-50 transition shadow-sm bg-white/80 backdrop-blur-md">
                            Back to Home
                         </Link>
                         <button onClick={logout} className="text-sm bg-red-50 text-red-600 border border-red-200 px-5 py-2.5 rounded-full font-bold hover:bg-red-100 transition backdrop-blur-md shadow-sm">
                            Logout
                         </button>
                    </motion.div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-10 relative z-20">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-slate-200 pb-6 gap-6">
                    <div>
                        <h2 className="text-5xl font-extrabold text-slate-900 tracking-tight drop-shadow-sm mb-2">Your Bookings</h2>
                        <p className="text-slate-500 text-lg font-medium tracking-wide">Manage your premium service appointments.</p>
                    </div>
                    
                    {/* View Toggle */}
                    <div className="flex bg-white/80 backdrop-blur-xl p-1.5 rounded-2xl border border-slate-200 shadow-sm">
                        <button 
                            onClick={() => setViewMode("user")}
                            className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${viewMode === 'user' ? 'bg-gradient-to-r from-yellow-400 to-amber-500 shadow-md text-white' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            My Requests
                        </button>
                        <button 
                            onClick={() => setViewMode("worker")}
                            className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${viewMode === 'worker' ? 'bg-gradient-to-r from-yellow-400 to-amber-500 shadow-md text-white' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            Assigned Jobs
                        </button>
                    </div>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-20 text-accent-yellow">
                        <span className="animate-spin mr-2 border-b-2 border-accent-yellow rounded-full w-10 h-10 inline-block shadow-[0_0_15px_rgba(250,204,21,0.6)]" />
                    </div>
                ) : bookings.length === 0 ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-slate-200 rounded-[2rem] p-16 text-center text-slate-600 shadow-xl">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">No bookings found</h3>
                        <p className="font-medium text-slate-500 text-lg">There are no appointments in this view currently.</p>
                    </motion.div>
                ) : (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                        <AnimatePresence>
                            {bookings.map((booking) => (
                                <motion.div 
                                    variants={itemVariants}
                                    exit={{ opacity: 0, height: 0 }}
                                    key={booking._id} 
                                    className="bg-white rounded-[2rem] shadow-xl hover:shadow-2xl transition-all border border-slate-100 p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 group relative overflow-hidden focus-within:ring-2 focus-within:ring-accent-yellow outline-none"
                                >
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-yellow-400 to-amber-500 opacity-80"></div>

                                    {/* Info Section */}
                                    <div className="flex-1 pl-4">
                                        <div className="flex items-center gap-4 mb-5">
                                            <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors tracking-tight">
                                                {viewMode === 'user' ? booking.workerId?.userId?.name : booking.userId?.name}
                                            </h3>
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${getStatusColor(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                            {booking.paymentStatus === 'paid' && (
                                                <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                    Paid
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm text-slate-600 bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-inner">
                                            <p className="flex items-center font-bold"><svg className="w-5 h-5 mr-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> {booking.date} at {booking.time}</p>
                                            <p className="flex items-center font-bold text-emerald-600 text-base"><svg className="w-5 h-5 mr-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ${booking.price}</p>
                                            <p className="col-span-1 sm:col-span-2 flex items-start font-medium"><svg className="w-5 h-5 mr-3 mt-0.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> {booking.address}</p>
                                        </div>
                                    </div>

                                {/* Actions Section */}
                                    <div className="flex flex-wrap gap-4 w-full lg:w-auto mt-2 lg:mt-0 pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-100 lg:pl-6 pl-4">
                                        
                                        {/* Worker Actions */}
                                        {viewMode === 'worker' && booking.status === 'pending' && (
                                            <>
                                                <button onClick={() => updateBookingStatus(booking._id, 'accepted')} className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold tracking-wide hover:shadow-lg transition transform hover:-translate-y-1 border border-emerald-400">Accept Job</button>
                                                <button onClick={() => updateBookingStatus(booking._id, 'rejected')} className="px-6 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold tracking-wide transition border border-red-200">Reject</button>
                                            </>
                                        )}

                                        {viewMode === 'worker' && booking.status === 'accepted' && booking.paymentStatus === 'paid' &&(
                                            <button onClick={() => updateBookingStatus(booking._id, 'completed')} className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold tracking-wide shadow-lg transition transform hover:-translate-y-1 flex items-center border border-emerald-400">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                Mark Completed
                                            </button>
                                        )}

                                        {/* User Actions */}
                                        {viewMode === 'user' && booking.status === 'pending' && (
                                            <button onClick={() => updateBookingStatus(booking._id, 'cancelled')} className="px-6 py-3 rounded-xl bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 font-bold tracking-wide transition shadow-sm">Cancel Request</button>
                                        )}

                                        {viewMode === 'user' && booking.status === 'accepted' && booking.paymentStatus === 'pending' && (
                                            <button onClick={() => setSelectedBookingForPayment(booking)} className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold shadow-lg transition transform hover:-translate-y-1 hover:scale-105 animate-pulse flex items-center border border-emerald-400 uppercase tracking-widest">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                                                Pay Now
                                            </button>
                                        )}

                                        {viewMode === 'user' && booking.status === 'completed' && (
                                             <button onClick={() => setSelectedBookingForReview(booking)} className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-bold tracking-wide transition shadow-lg flex items-center transform hover:-translate-y-1 border border-yellow-300">
                                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                                Leave Review
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </main>

            <MockPaymentModal 
                isOpen={!!selectedBookingForPayment}
                onClose={() => setSelectedBookingForPayment(null)}
                booking={selectedBookingForPayment}
                onPaymentSuccess={handlePaymentSuccess}
            />

            <ReviewModal 
                isOpen={!!selectedBookingForReview}
                onClose={() => setSelectedBookingForReview(null)}
                booking={selectedBookingForReview}
                onReviewSuccess={handleReviewSuccess}
            />

        </div>
    );
};

export default Bookings;
