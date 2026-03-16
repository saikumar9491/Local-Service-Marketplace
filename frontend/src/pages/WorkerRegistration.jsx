import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";

const WorkerRegistration = () => {
    const { authUser } = useAuthContext();
    const { logout } = useLogout();
    const navigate = useNavigate();
    
    const [inputs, setInputs] = useState({
        serviceType: "plumber",
        experienceYears: 1,
        hourlyRate: 20,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!navigator.geolocation) {
           setError("Geolocation is not supported by your browser");
           setLoading(false);
           return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const coordinates = [position.coords.longitude, position.coords.latitude];
                
                try {
                    const res = await fetch("/api/workers/register", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...inputs, coordinates })
                    });
                    
                    const data = await res.json();
                    
                    if (data.error) {
                        throw new Error(data.error);
                    }
                    
                    setSuccess(true);
                    setTimeout(() => {
                        navigate("/");
                    }, 3000);
                    
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                setError(`Geolocation Error: ${err.message}. Please allow location access.`);
                setLoading(false);
            }
        );
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Submitted!</h2>
                    <p className="text-gray-600">Your worker profile has been submitted and is currently pending admin approval. You will be redirected shortly.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            
            <div className="w-full flex justify-end max-w-4xl mb-6 gap-4">
                 <Link to="/" className="btn bg-white border-gray-300 text-gray-700 px-4 py-2 rounded shadow hover:bg-gray-50 transition">
                            Back to Home
                </Link>
                <button onClick={logout} className="btn bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition">
                            Logout
                </button>
            </div>

            <div className='w-full max-w-md p-8 rounded-lg shadow-lg bg-white border border-gray-100'>
                <h1 className='text-2xl font-bold text-center text-gray-800 mb-2'>
                    Become a Worker
                </h1>
                <p className="text-center text-gray-500 text-sm mb-6">Complete your profile to start accepting jobs in your area.</p>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm border border-red-200">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Service Type</label>
                        <select
                            className='w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
                            value={inputs.serviceType}
                            onChange={(e) => setInputs({ ...inputs, serviceType: e.target.value })}
                        >
                            <option value="plumber">Plumber</option>
                            <option value="electrician">Electrician</option>
                            <option value="tutor">Tutor</option>
                            <option value="cleaner">Cleaner</option>
                            <option value="carpenter">Carpenter</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Experience (Years)</label>
                        <input
                            type='number'
                            min="0"
                            className='w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={inputs.experienceYears}
                            onChange={(e) => setInputs({ ...inputs, experienceYears: parseInt(e.target.value) || 0 })}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Hourly Rate ($)</label>
                        <input
                            type='number'
                            min="5"
                            className='w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={inputs.hourlyRate}
                            onChange={(e) => setInputs({ ...inputs, hourlyRate: parseInt(e.target.value) || 0 })}
                            required
                        />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-md mb-6 border border-blue-100">
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> We will access your browser's location to match you with nearby users. Please allow location access when prompted.
                        </p>
                    </div>

                    <button
                        type="submit"
                        className='w-full bg-blue-600 text-white rounded-md py-2.5 font-semibold hover:bg-blue-700 transition duration-200 flex justify-center items-center'
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </span>
                        ) : "Register as Worker"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WorkerRegistration;
