import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import App from '../App';
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';
import { useAdmin } from '../contexts/AdminContext';

const AdminRoute: React.FC = () => {
  const { isAuthenticated } = useAdmin();
  
  if (!isAuthenticated) {
    return <AdminLogin />;
  }
  
  return <AdminDashboard />;
};

export const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};