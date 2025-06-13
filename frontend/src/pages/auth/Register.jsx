import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { isValidAge, isDateInFuture, toUTCString, getCurrentDateForInput } from '../../utils/dateUtils';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [backendErrors, setBackendErrors] = useState([]);
  const { register: registerUser } = useAuth();
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (!isValidAge(data.dateOfBirth)) {
        showError('You must be at least 18 years old to register');
        setIsLoading(false);
        return;
      }

      if (isDateInFuture(data.dateOfBirth)) {
        showError('Date of birth cannot be in the future');
        setIsLoading(false);
        return;
      }

      const userData = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: toUTCString(data.dateOfBirth) // Convert to UTC
      };

      const result = await registerUser(userData);
      
      if (result.success) {
        // Automatically log in the user after successful registration
        const { token, user } = result.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        showSuccess('Registration successful! Redirecting...');
        navigate('/student/dashboard');
      } else {
        console.error('Registration failed:', result.message);
        if (result.errors && result.errors.length > 0) {
          // Format errors as a list with line breaks
          const errorList = result.errors.map(error => `• ${error}`).join('\n');
          showError(`Registration failed:\n${errorList}`, 8000); // Show longer for multiple errors
        } else {
          showError(result.message || 'Registration failed');
        }
      }
    } catch (error) {
      showError('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  {...register('firstName', {
                    required: 'First name is required',
                    minLength: {
                      value: 3,
                      message: 'First name must be at least 3 characters'
                    }
                  })}
                  type="text"
                  className={`
                    mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
                    focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                    ${errors.firstName ? 'border-red-300' : 'border-gray-300'}
                  `}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  {...register('lastName', {
                    required: 'Last name is required',
                    minLength: {
                      value: 3,
                      message: 'Last name must be at least 3 characters'
                    }
                  })}
                  type="text"
                  className={`
                    mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
                    focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                    ${errors.lastName ? 'border-red-300' : 'border-gray-300'}
                  `}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                className={`
                  mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                  ${errors.email ? 'border-red-300' : 'border-gray-300'}
                `}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                {...register('dateOfBirth', {
                  required: 'Date of birth is required',
                  validate: {
                    notFuture: (value) => !isDateInFuture(value) || 'Date cannot be in the future',
                    validAge: (value) => isValidAge(value) || 'You must be at least 18 years old'
                  }
                })}
                type="date"
                max={getCurrentDateForInput()}
                className={`
                  mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                  ${errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'}
                `}
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
                  }
                })}
                type="password"
                className={`
                  mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                  ${errors.password ? 'border-red-300' : 'border-gray-300'}
                `}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === password || 'Passwords do not match'
                })}
                type="password"
                className={`
                  mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                  ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'}
                `}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`
                group relative w-full flex justify-center py-2 px-4 border border-transparent 
                text-sm font-medium rounded-md text-white 
                ${isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }
              `}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Creating account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 