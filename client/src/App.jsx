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

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={role === 'customer' ? '/' : '/dashboard'} replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (token) {
    return <Navigate to={role === 'customer' ? '/' : '/dashboard'} replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/signup"  element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/login"   element={<PublicRoute><Login /></PublicRoute>} />

        <Route path="/"            element={<ProtectedRoute allowedRoles={['customer']}><Home /></ProtectedRoute>} />
        <Route path="/provider/:id" element={<ProtectedRoute allowedRoles={['customer']}><ProviderProfile /></ProtectedRoute>} />
        <Route path="/post-job"    element={<ProtectedRoute allowedRoles={['customer']}><PostJob /></ProtectedRoute>} />
        <Route path="/requests"    element={<ProtectedRoute allowedRoles={['customer']}><MyRequests /></ProtectedRoute>} />
        <Route path="/job/:id"     element={<ProtectedRoute><JobStatus /></ProtectedRoute>} />
        <Route path="/review/:id"  element={<ProtectedRoute allowedRoles={['customer']}><Review /></ProtectedRoute>} />

        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['provider']}><Dashboard /></ProtectedRoute>} />
        <Route path="/incoming"  element={<ProtectedRoute allowedRoles={['provider']}><IncomingRequests /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
