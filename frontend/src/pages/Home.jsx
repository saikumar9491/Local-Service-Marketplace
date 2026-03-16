import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import useLogout from "../hooks/useLogout";
import BookingModal from "../components/BookingModal";

const Home = () => {
    const { authUser } = useAuthContext();
    const { logout } = useLogout();
    
    const [nearbyWorkers, setNearbyWorkers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [locationAllowed, setLocationAllowed] = useState(false);
    const [serviceFilter, setServiceFilter] = useState("");
    
    // Booking Modal State
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [bookingSuccessMessage, setBookingSuccessMessage] = useState("");

    const fetchNearbyWorkers = async (lng, lat) => {
        setLoading(true);
        setError("");
        try {
            let url = `/api/workers/nearby?lng=${lng}&lat=${lat}`;
            if (serviceFilter) {
                url += `&serviceType=${serviceFilter}`;
            }
            
            const res = await fetch(url);
            const data = await res.json();
            
            if (data.error) throw new Error(data.error);
            setNearbyWorkers(data);
        } catch (error) {
            setError("Failed to fetch nearby workers.");
        } finally {
            setLoading(false);
        }
    };

    const requestLocation = () => {
        setError("");
        if (!navigator.geolocation) {
           setError("Geolocation is not supported by your browser");
           return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocationAllowed(true);
                fetchNearbyWorkers(position.coords.longitude, position.coords.latitude);
            },
            (err) => {
                setError(`Location Error: ${err.message}. We need your location to find nearby workers.`);
            }
        );
    };

    // Auto-request on load if user is an existing authUser (who is not an admin)
    // Important: Also allow guests to browse, so we request location by default to show workers
    useEffect(() => {
        if (!authUser || authUser?.role === 'user') {
            requestLocation();
        }
    }, [authUser, serviceFilter]);

    const handleBookNow = (worker) => {
        setSelectedWorker(worker);
        setIsBookingModalOpen(true);
    };

    const handleBookingSuccess = (bookingDetails) => {
        setBookingSuccessMessage(`Booking request sent to ${selectedWorker.userId?.name} successfully!`);
        setTimeout(() => setBookingSuccessMessage(""), 5000);
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };


    if (authUser?.role === 'admin') {
         return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 z-0 bg-yellow-400/10"></div>
                <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-100 relative z-10">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-800 mb-4 tracking-tight">Welcome Admin</h2>
                    <p className="text-slate-500 mb-8 font-medium">Go to your dashboard to manage the platform and approve pending worker registrations.</p>
                    <Link to="/admin" className="btn w-full bg-yellow-400 text-slate-900 rounded-xl py-3 text-center inline-block hover:bg-yellow-500 shadow-md font-bold transition transform hover:-translate-y-1">
                        Go To Admin Dashboard
                    </Link>
                    <button onClick={logout} className="mt-6 text-slate-400 hover:text-slate-600 text-sm font-semibold transition underline">
                        Logout
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-soft-white relative overflow-hidden font-sans text-slate-800">
            {/* Soft Background Blobs for White Theme */}
            <div className="absolute top-0 -left-20 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob z-0 pointer-events-none"></div>
            <div className="absolute top-1/4 -right-20 w-[30rem] h-[30rem] bg-amber-100 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-blob animation-delay-2000 z-0 pointer-events-none"></div>
            <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-yellow-50 rounded-full mix-blend-multiply filter blur-[100px] opacity-80 animate-blob animation-delay-4000 z-0 pointer-events-none"></div>

            <header className="bg-white/80 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border-b border-slate-100 sticky top-0 z-40 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                        <Link to="/" className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                             <div className="w-8 h-8 rounded-lg bg-accent-yellow shadow-sm flex items-center justify-center">
                                 <svg className="w-5 h-5 text-slate-900" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                             </div>
                             ServiceMarket
                        </Link>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-4 sm:gap-6">
                        {authUser ? (
                           <>
                             <span className="text-slate-500 font-medium hidden sm:inline-block">Hi, <span className="font-bold text-slate-800 tracking-wide">{authUser.name}</span></span>
                             
                             {authUser.role === 'user' && !nearbyWorkers.some(w => w.userId?._id === authUser._id) && (
                                 <Link to="/register-worker" className="text-sm bg-accent-yellow/10 text-yellow-700 px-5 py-2.5 rounded-full font-bold hover:bg-accent-yellow/20 transition duration-300">
                                     Become a Pro
                                 </Link>
                             )}
                             {authUser.role === 'user' && (
                                 <Link to="/bookings" className="text-sm border border-slate-200 text-slate-600 bg-white px-5 py-2.5 rounded-full font-bold hover:bg-slate-50 transition duration-300 shadow-sm hidden md:block">
                                     My Bookings
                                 </Link>
                             )}
                             <button onClick={logout} className="text-sm bg-slate-900 text-white px-5 py-2.5 rounded-full font-bold hover:bg-slate-800 transition shadow-md">
                                 Logout
                             </button>
                           </>
                        ) : (
                           <>
                             <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition mr-2">Login</Link>
                             <Link to="/signup" className="text-sm bg-accent-yellow text-slate-900 px-6 py-2.5 rounded-full font-bold hover:bg-yellow-500 transition shadow-[0_4px_14px_rgba(250,204,21,0.39)] transform hover:-translate-y-0.5">Sign Up</Link>
                           </>
                        )}
                    </motion.div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-20">
                <AnimatePresence>
                    {bookingSuccessMessage && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            className="mb-8 bg-green-50 backdrop-blur-sm text-green-800 p-4 rounded-xl shadow-sm border border-green-200 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <span className="font-bold">{bookingSuccessMessage}</span>
                            </div>
                            {authUser && (
                               <Link to="/bookings" className="font-semibold text-green-700 hover:text-green-900 bg-white px-4 py-2 rounded-lg text-sm shadow-sm transition border border-green-100">View Bookings &rarr;</Link>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div 
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}
                    className="mb-16 text-center pt-8 md:pt-12"
                >
                    <h2 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight drop-shadow-sm leading-tight">
                        Premium Services, <br className="hidden md:block"/><span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-yellow to-orange-400">Delivered Fast.</span>
                    </h2>
                    <p className="text-slate-500 text-lg md:text-2xl max-w-3xl mx-auto font-medium">Instantly connect with top-rated local professionals. Quality service at your doorstep, exactly when you need it.</p>
                </motion.div>

                {/* Filters */}
                {locationAllowed && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white p-5 sm:p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 mb-16 flex flex-col sm:flex-row justify-between items-center gap-6 relative z-20 max-w-4xl mx-auto"
                    >
                        <div className="flex items-center gap-5 w-full sm:w-auto">
                            <label className="font-bold text-slate-400 tracking-wide uppercase text-xs">Filter Services</label>
                            <select 
                                value={serviceFilter} 
                                onChange={(e) => setServiceFilter(e.target.value)}
                                className="w-full sm:w-72 bg-slate-50 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent-yellow focus:border-transparent transition-all border border-slate-200 cursor-pointer appearance-none font-bold shadow-sm"
                            >
                                <option value="">🎯 All Premium Services</option>
                                <option value="plumber">🔧 Master Plumber</option>
                                <option value="electrician">⚡ Certified Electrician</option>
                                <option value="tutor">📚 Private Tutor</option>
                                <option value="cleaner">✨ Deep Cleaner</option>
                                <option value="carpenter">🔨 Custom Carpenter</option>
                            </select>
                        </div>
                        <button 
                            onClick={requestLocation}
                            className="flex items-center gap-2 text-sm text-slate-600 font-bold transition-all bg-slate-100 hover:bg-slate-200 px-6 py-3 rounded-xl"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            Refresh Area
                        </button>
                    </motion.div>
                )}

                {/* Content Area */}
                {error ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-100 rounded-3xl p-10 text-center max-w-2xl mx-auto mt-12 shadow-lg">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                             <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        </div>
                        <p className="text-red-800 font-bold mb-6 text-lg">{error}</p>
                        <button onClick={requestLocation} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl transition font-bold shadow-md">
                            Try Again
                        </button>
                    </motion.div>
                ) : loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="relative w-20 h-20 mb-6">
                             <div className="absolute inset-0 rounded-full border-t-4 border-accent-yellow animate-spin"></div>
                             <div className="absolute inset-2 rounded-full border-b-4 border-slate-900 animate-spin animation-delay-500 direction-reverse"></div>
                        </div>
                        <p className="font-extrabold text-xl tracking-wider text-slate-600">Locating Experts...</p>
                    </div>
                ) : !locationAllowed ? (
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-white text-center p-12 md:p-16 rounded-[3rem] max-w-3xl mx-auto shadow-xl mt-10 relative overflow-hidden border border-slate-100"
                     >
                         <div className="w-24 h-24 bg-accent-yellow/10 rounded-full flex items-center justify-center mx-auto mb-8">
                             <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                         </div>
                         <h3 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Discover Nearby Pros</h3>
                         <p className="text-slate-500 mb-10 text-xl font-medium">Allow location access to instantly view top-tier professionals within a 10km radius of your home.</p>
                         <button onClick={requestLocation} className="bg-accent-yellow hover:bg-yellow-500 text-slate-900 px-10 py-4 rounded-2xl shadow-[0_8px_20px_rgba(250,204,21,0.3)] transform transition hover:-translate-y-1 font-extrabold text-lg tracking-wide border border-yellow-300">
                             Grant Location Access &rarr;
                        </button>
                    </motion.div>
                ) : nearbyWorkers.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-slate-100 rounded-[2.5rem] p-16 text-center max-w-3xl mx-auto mt-12 shadow-xl">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
                        </div>
                        <h3 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">No experts found</h3>
                        <p className="text-slate-500 text-xl mb-8 font-medium">There are currently no approved professionals matching your criteria nearby.</p>
                        {serviceFilter && (
                            <button onClick={() => setServiceFilter("")} className="text-accent-yellow font-bold hover:text-yellow-600 transition underline tracking-wide">
                                Clear Service Filters
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10"
                    >
                        {nearbyWorkers.map((worker) => (
                            <motion.div 
                                variants={itemVariants}
                                key={worker._id} 
                                className="bg-white rounded-[2rem] shadow-[0_4px_25px_rgb(0,0,0,0.05)] border border-slate-100 overflow-hidden hover:shadow-2xl hover:border-yellow-200 transition-all duration-500 transform hover:-translate-y-2 flex flex-col group relative"
                            >
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-accent-yellow"></div>
                                
                                <div className="p-8 flex-grow">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">{worker.userId?.name}</h3>
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex items-center bg-slate-100 text-slate-600 text-xs px-3 py-1.5 rounded-md font-bold uppercase tracking-wider">
                                                    {worker.serviceType}
                                                </span>
                                                {worker.reviewsCount > 0 && (
                                                    <span className="flex items-center text-xs font-bold text-yellow-700 bg-yellow-50 px-2.5 py-1.5 rounded-md border border-yellow-100">
                                                        <svg className="w-3.5 h-3.5 text-accent-yellow mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                                        {worker.rating.toFixed(1)} <span className="text-yellow-600/70 ml-1">({worker.reviewsCount})</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="bg-green-50 text-green-700 font-extrabold px-4 py-2 rounded-xl text-sm whitespace-nowrap border border-green-100">
                                            ${worker.hourlyRate} <span className="text-xs font-semibold text-green-600/60">/hr</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8">
                                        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-0.5">Experience</p>
                                                <p className="font-extrabold text-slate-800">{worker.experienceYears} Years Master</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-50 px-8 py-5 border-t border-slate-100 flex justify-between items-center group-hover:bg-yellow-50/50 transition-colors duration-500">
                                    <span className="text-[10px] text-green-600 font-extrabold flex items-center gap-2 uppercase tracking-widest">
                                         <span className="w-2.5 h-2.5 bg-green-500 rounded-full inline-block animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span>
                                         Local Match
                                    </span>
                                    <button 
                                        onClick={() => handleBookNow(worker)}
                                        className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold tracking-wide hover:bg-accent-yellow hover:text-slate-900 transition-all shadow-md transform group-hover:scale-105"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </main>

            {/* Modals */}
            <BookingModal 
                isOpen={isBookingModalOpen} 
                onClose={() => setIsBookingModalOpen(false)} 
                worker={selectedWorker}
                onBookingSuccess={handleBookingSuccess}
            />
        </div>
    );
};

export default Home;
