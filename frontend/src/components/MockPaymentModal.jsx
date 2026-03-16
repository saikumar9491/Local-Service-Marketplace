import { useState } from "react";

const MockPaymentModal = ({ isOpen, onClose, booking, onPaymentSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen || !booking) return null;

    const handlePay = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`/api/payments/${booking._id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            onPaymentSuccess(booking._id);
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

            <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative z-10 transform transition-all pt-1">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400"></div>

                <div className="px-8 py-6 flex justify-between items-center border-b border-slate-100 bg-slate-50">
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Secure Checkout</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-full transition-all">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div className="p-8">
                    <div className="mb-8 text-center">
                        <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <p className="text-slate-500 mb-1 font-medium">Payment for service from</p>
                        <p className="text-2xl font-black text-slate-900">{booking.workerId?.userId?.name || "the worker"}</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-5 mb-8 border border-slate-100 flex justify-between items-center shadow-inner">
                        <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Total Amount</span>
                        <span className="text-3xl font-black text-emerald-600">${booking.price}</span>
                    </div>

                    {error && <div className="mb-6 text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-200 font-medium text-center">{error}</div>}

                    <button 
                        onClick={handlePay}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 text-lg tracking-wide flex justify-center items-center border border-emerald-400"
                    >
                        {loading ? (
                            <><span className="animate-spin mr-2 border-b-2 border-white rounded-full w-5 h-5 inline-block"></span> Processing...</>
                        ) : `Pay $${booking.price} (Mock)`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MockPaymentModal;
