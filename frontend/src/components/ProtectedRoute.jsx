import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './ui/LoadingSpinner';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading, isAdmin, isStudent } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    let hasRequiredRole = false;
    
    if (requiredRole === 'Admin') {
      hasRequiredRole = isAdmin();
    } else if (requiredRole === 'Student') {
      hasRequiredRole = isStudent();
    }

    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 19.5c.77.833 1.732 2.5 1.732 2.5z" />
                </svg>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                  Access Denied
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                  You don't have permission to access this page.
                </p>
                <p className="mt-1 text-center text-xs text-gray-500">
                  Required: {requiredRole} | Current: {user?.role || 'Unknown'}
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => window.history.back()}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return children;
};

// Role göre yönlendirme
export const AdminRoute = ({ children }) => (
  <ProtectedRoute requiredRole="Admin">
    {children}
  </ProtectedRoute>
);

export const StudentRoute = ({ children }) => (
  <ProtectedRoute requiredRole="Student">
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute; 