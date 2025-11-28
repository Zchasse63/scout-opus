import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PartnerApprovals from './pages/PartnerApprovals';
import SupportTickets from './pages/SupportTickets';
import ContentModeration from './pages/ContentModeration';
import Financials from './pages/Financials';
import Users from './pages/Users';
import Analytics from './pages/Analytics';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';

function AppRoutes() {
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
        <Route path="partners" element={<PartnerApprovals />} />
        <Route path="tickets" element={<SupportTickets />} />
        <Route path="moderation" element={<ContentModeration />} />
        <Route path="financials" element={<Financials />} />
        <Route path="users" element={<Users />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
