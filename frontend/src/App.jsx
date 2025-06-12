import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import ProtectedRoute, { AdminRoute, StudentRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import AdminDashboard from './pages/admin/Dashboard';
import StudentsPage from './pages/admin/StudentsPage';
import CoursesPage from './pages/admin/CoursesPage';
import EnrollmentsPage from './pages/admin/EnrollmentsPage';

import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import AvailableCourses from './pages/student/AvailableCourses';
import MyEnrollments from './pages/student/MyEnrollments';

const DashboardRedirect = () => {
  const { isAdmin } = useAuth();
  
  return <Navigate to={isAdmin() ? '/admin/dashboard' : '/student/dashboard'} replace />;
};

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Page Not Found</h3>
        <p className="text-sm text-gray-500 mb-4">
          The page you're looking for doesn't exist.
        </p>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Herkese açık sayfalar */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected */}
              <Route path="/*" element={
                <ProtectedRoute>
                  <div>
                    <Navbar />
                    <main className="flex-1">
                      <Routes>
                        {/* Role göre default yönlendirme */}
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<DashboardRedirect />} />
                        
                        {/* Admin sayfaları */}
                        <Route path="/admin/dashboard" element={
                          <AdminRoute>
                            <AdminDashboard />
                          </AdminRoute>
                        } />
                        <Route path="/admin/students" element={
                          <AdminRoute>
                            <StudentsPage />
                          </AdminRoute>
                        } />
                        <Route path="/admin/courses" element={
                          <AdminRoute>
                            <CoursesPage />
                          </AdminRoute>
                        } />
                        <Route path="/admin/enrollments" element={
                          <AdminRoute>
                            <EnrollmentsPage />
                          </AdminRoute>
                        } />
                        
                        {/* Student sayfaları */}
                        <Route path="/student/dashboard" element={
                          <StudentRoute>
                            <StudentDashboard />
                          </StudentRoute>
                        } />
                        <Route path="/student/profile" element={
                          <StudentRoute>
                            <StudentProfile />
                          </StudentRoute>
                        } />
                        <Route path="/student/courses" element={
                          <StudentRoute>
                            <AvailableCourses />
                          </StudentRoute>
                        } />
                        <Route path="/student/my-courses" element={
                          <StudentRoute>
                            <MyEnrollments />
                          </StudentRoute>
                        } />
                        
                        {/* Hata sayfası */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                  </div>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
