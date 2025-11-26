import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import GymProfile from './pages/GymProfile';
import Bookings from './pages/Bookings';
import Financials from './pages/Financials';
import QRScanner from './pages/QRScanner';
import StripeOnboarding from './pages/StripeOnboarding';
import Layout from './components/Layout';

function App() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<GymProfile />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="financials" element={<Financials />} />
        <Route path="scanner" element={<QRScanner />} />
        <Route path="stripe-onboarding" element={<StripeOnboarding />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
