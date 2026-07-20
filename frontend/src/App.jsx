// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useAccentColor } from './hooks/useAccentColor'
import PublicLayout from './layouts/PublicLayout'
import HomePage from './pages/HomePage'
import ProjectPage from './pages/ProjectPage'
import AdminLayout from './layouts/AdminLayout'
import LoginPage from './pages/admin/LoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  useAccentColor()

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/project/:id" element={<ProjectPage />} />
      </Route>
      <Route path="/admin/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>
    </Routes>
  )
}