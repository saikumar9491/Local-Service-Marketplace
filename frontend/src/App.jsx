import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import WorkerRegistration from './pages/WorkerRegistration';
import AdminDashboard from './pages/AdminDashboard';
import Bookings from './pages/Bookings';
import ForgotPassword from './pages/ForgotPassword';
import WorkerLogin from './pages/WorkerLogin';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import { useAuthContext } from './context/AuthContext';

function App() {
  const { authUser } = useAuthContext();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Routes>
          {/* Public Home Route */}
          <Route path="/" element={<Home />} />
          
          {/* General Auth */}
          <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
          <Route path="/signup" element={authUser ? <Navigate to="/" /> : <Signup />} />
          <Route path="/forgot-password" element={authUser ? <Navigate to="/" /> : <ForgotPassword />} />
          
          {/* Worker Auth & Routing */}
          <Route path="/worker/login" element={authUser ? <Navigate to="/" /> : <WorkerLogin />} />
          <Route 
            path="/register-worker" 
            element={authUser ? <WorkerRegistration /> : <Navigate to="/login" />} 
          />
          
          {/* Admin Auth & Routing */}
          <Route path="/admin/login" element={authUser ? <Navigate to="/admin" /> : <AdminLogin />} />
          <Route path="/admin/create" element={authUser ? <Navigate to="/admin" /> : <AdminSignup />} />
          <Route 
            path="/admin" 
            element={authUser?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} 
          />
          
          {/* User Routing */}
          <Route 
            path="/bookings" 
            element={authUser ? <Bookings /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
