import { useState } from "react";

const BookingModal = ({ isOpen, onClose, worker, onBookingSuccess }) => {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen || !worker) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    workerId: worker._id,
                    date,
                    time,
                    address
                })
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            onBookingSuccess(data);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Blur overlay */}
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={onClose}></div>
            
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-md overflow-hidden relative z-10 transform transition-all">
                
                {/* Header */}
                <div className="px-8 py-6 flex justify-between items-center border-b border-white/5 bg-white/5">
                    <h3 className="text-2xl font-extrabold text-white tracking-tight">Book <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{worker.userId?.name}</span></h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8 bg-slate-950/50 p-4 rounded-2xl border border-white/5 shadow-inner">
                        <div className="text-sm">
                            <span className="text-slate-400 uppercase tracking-widest font-bold text-[10px] block mb-1">Service</span>
                            <span className="font-extrabold text-white capitalize text-lg">{worker.serviceType}</span>
                        </div>
                        <div className="text-sm text-right">
                            <span className="text-slate-400 uppercase tracking-widest font-bold text-[10px] block mb-1">Rate</span>
                            <span className="font-black text-emerald-400 text-xl">${worker.hourlyRate}<span className="text-xs font-medium text-emerald-400/50">/hr</span></span>
                        </div>
                    </div>

                    {error && <div className="mb-6 text-sm text-red-200 bg-red-500/20 p-4 rounded-xl border border-red-500/30 flex items-center font-medium"><svg className="w-5 h-5 mr-2 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Date</label>
                                <input 
                                    type="date" 
                                    required
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 outline-none transition-all shadow-inner font-medium [color-scheme:dark]" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Time</label>
                                <input 
                                    type="time" 
                                    required
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 outline-none transition-all shadow-inner font-medium [color-scheme:dark]" 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Service Address</label>
                            <textarea 
                                required
                                rows="3"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter full address..."
                                className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 outline-none resize-none transition-all shadow-inner font-medium placeholder-slate-600"
                            ></textarea>
                        </div>

                        <div className="mt-8 pt-2">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all transform hover:-translate-y-1 flex justify-center items-center tracking-wide text-lg"
                            >
                                {loading ? (
                                    <><span className="animate-spin mr-2 border-b-2 border-white rounded-full w-5 h-5 inline-block"></span> Confirming...</>
                                ) : "Confirm Booking"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
