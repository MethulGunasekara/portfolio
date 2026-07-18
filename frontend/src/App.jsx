import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import Home from './pages/Home';

// Admin Pages & Layout
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminProjects from './pages/AdminProjects';
import AdminSkills from './pages/AdminSkills';
import AdminMessages from './pages/AdminMessages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Portfolio Route */}
        <Route path="/" element={<Home />} />

        {/* Admin Authentication */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Protected Admin Routes Wrapped in the Persistent Layout */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/admin/skills" element={<AdminSkills />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;