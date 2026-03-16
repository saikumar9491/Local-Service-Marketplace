import { useState } from "react";

const ReviewModal = ({ isOpen, onClose, booking, onReviewSuccess }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen || !booking) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bookingId: booking._id,
                    rating,
                    comment
                })
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            onReviewSuccess();
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
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}></div>

            <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10 transform transition-all pt-1">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-yellow-400 to-amber-500"></div>

                <div className="px-8 py-6 flex justify-between items-center border-b border-slate-100 bg-slate-50">
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Leave a Review</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-full transition-all">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div className="p-8">
                    <p className="text-slate-600 mb-8 text-center text-lg">How was your service with <br/><span className="font-extrabold text-slate-900 text-xl">{booking.workerId?.userId?.name || "this professional"}</span>?</p>
                    
                    {error && <div className="mb-6 text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-200 text-center font-medium">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider text-center">Select Rating</label>
                            <select 
                                value={rating} 
                                onChange={(e) => setRating(parseInt(e.target.value))}
                                className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 focus:ring-2 focus:ring-accent-yellow/50 focus:border-accent-yellow outline-none transition-all shadow-sm font-black text-center text-lg appearance-none cursor-pointer"
                                style={{ textAlignLast: 'center' }}
                            >
                                <option value={5} className="bg-white">⭐⭐⭐⭐⭐ (5) - Excellent</option>
                                <option value={4} className="bg-white">⭐⭐⭐⭐ (4) - Good</option>
                                <option value={3} className="bg-white">⭐⭐⭐ (3) - Average</option>
                                <option value={2} className="bg-white">⭐⭐ (2) - Poor</option>
                                <option value={1} className="bg-white">⭐ (1) - Terrible</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Your Experience</label>
                            <textarea
                                required
                                rows="4"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Write your thoughts..."
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-accent-yellow/50 focus:border-accent-yellow outline-none resize-none transition-all shadow-sm font-medium placeholder-slate-400"
                            ></textarea>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-black py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 mt-4 text-lg tracking-wide flex justify-center items-center border border-yellow-300"
                        >
                            {loading ? (
                                <><span className="animate-spin mr-2 border-b-2 border-white rounded-full w-5 h-5 inline-block"></span> Submitting...</>
                            ) : "Submit Review"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
