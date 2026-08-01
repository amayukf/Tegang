import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import ProviderProfile from './pages/ProviderProfile';
import PostJob from './pages/PostJob';
import JobStatus from './pages/JobStatus';
import MyRequests from './pages/MyRequests';
import IncomingRequests from './pages/IncomingRequests';
import Review from './pages/Review';

import Profile from './pages/Profile';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role') || localStorage.getItem('userRole');

  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to={role === 'customer' ? '/home' : '/dashboard'} replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role') || localStorage.getItem('userRole');
  if (token) {
    if (role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to={role === 'customer' ? '/home' : '/dashboard'} replace />;
  }
  return children;
};

const RootRoute = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role') || localStorage.getItem('userRole');
  if (token) {
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'provider') return <Navigate to="/dashboard" replace />;
    return <Navigate to="/home" replace />;
  }
  return <Landing />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/signup"  element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/login"   element={<PublicRoute><Login /></PublicRoute>} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin"       element={<AdminDashboard />} />

        <Route path="/home"            element={<ProtectedRoute allowedRoles={['customer']}><Home /></ProtectedRoute>} />
        <Route path="/provider/:id" element={<ProtectedRoute allowedRoles={['customer']}><ProviderProfile /></ProtectedRoute>} />
        <Route path="/post-job"    element={<ProtectedRoute allowedRoles={['customer']}><PostJob /></ProtectedRoute>} />
        <Route path="/requests"    element={<ProtectedRoute allowedRoles={['customer']}><MyRequests /></ProtectedRoute>} />
        <Route path="/job/:id"     element={<ProtectedRoute><JobStatus /></ProtectedRoute>} />
        <Route path="/review/:id"  element={<ProtectedRoute allowedRoles={['customer']}><Review /></ProtectedRoute>} />
        <Route path="/profile"     element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['provider']}><Dashboard /></ProtectedRoute>} />
        <Route path="/incoming"  element={<ProtectedRoute allowedRoles={['provider']}><IncomingRequests /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
