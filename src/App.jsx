import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Navbar from './Navbar';
import Login from './Login';
import Register from './Register';
import EmployeeDashboard from './EmployeeDashboard';
import ApplyLeave from './ApplyLeave';
import LeaveHistory from './LeaveHistory';
import AdminDashboard from './AdminDashboard';
import ProtectedRoute from './ProtectedRoute';

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute role="employee"><EmployeeDashboard /></ProtectedRoute>
            } />
            <Route path="/apply" element={
              <ProtectedRoute role="employee"><ApplyLeave /></ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute role="employee"><LeaveHistory /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
