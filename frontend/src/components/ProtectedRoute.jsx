// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute() {
  const { isAuth } = useAuth()
  return isAuth ? <Outlet /> : <Navigate to="/admin/login" replace />
}