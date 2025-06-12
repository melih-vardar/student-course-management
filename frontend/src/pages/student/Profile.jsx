import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { userService } from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { displayDateOnly, toUTCString, isValidAge, isDateInFuture, getCurrentDateForInput } from '../../utils/dateUtils';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const StudentProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const result = await userService.getProfile();
      
      if (result.success) {
        setUserProfile(result.data);
        
        setValue('firstName', result.data.firstName);
        setValue('lastName', result.data.lastName);
        setValue('email', result.data.email);
        setValue('dateOfBirth', result.data.dateOfBirth.split('T')[0]); // Convert to YYYY-MM-DD format
      } else {
        showError(result.message || 'Failed to load profile');
      }
    } catch (error) {
      showError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (!isValidAge(data.dateOfBirth)) {
        showError('You must be at least 18 years old');
        setSaving(false);
        return;
      }

      if (isDateInFuture(data.dateOfBirth)) {
        showError('Date of birth cannot be in the future');
        setSaving(false);
        return;
      }

      const updateData = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: toUTCString(data.dateOfBirth)
      };

      const result = await userService.updateProfile(updateData);
      
      if (result.success) {
        showSuccess('Profile updated successfully!');
        setEditing(false);
        
        setUserProfile(prev => ({
          ...prev,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: toUTCString(data.dateOfBirth)
        }));
      } else {
        showError(result.message || 'Failed to update profile');
      }
    } catch (error) {
      showError('An error occurred while updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading your profile..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-2 text-gray-600">View and edit your personal information</p>
        </div>

        <div className="bg-white shadow rounded-lg">
          {/* Header */}
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {userProfile?.firstName?.charAt(0)}{userProfile?.lastName?.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {userProfile?.firstName} {userProfile?.lastName}
                  </h2>
                  <p className="text-sm text-gray-500">{userProfile?.email}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {userProfile?.role}
                  </span>
                </div>
              </div>
              <div className="flex space-x-3">
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditing(false)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profil Bilgileri */}
          <div className="px-4 py-5 sm:p-6">
            {!editing ? (
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">First Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{userProfile?.firstName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{userProfile?.lastName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">{userProfile?.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {displayDateOnly(userProfile?.dateOfBirth)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {displayDateOnly(userProfile?.createdAt)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Enrolled Courses</dt>
                  <dd className="mt-1 text-sm text-gray-900">{userProfile?.enrolledCoursesCount || 0} courses</dd>
                </div>
              </dl>
            ) : (
              /* Düzenleme Modu */
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                      placeholder="Enter your first name"
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
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
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
                      placeholder="Enter your email"
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
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className={`
                      inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                      ${saving 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                      }
                    `}
                  >
                    {saving ? (
                      <div className="flex items-center">
                        <LoadingSpinner size="sm" />
                        <span className="ml-2">Saving...</span>
                      </div>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile; 