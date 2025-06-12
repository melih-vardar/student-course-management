import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { courseService } from '../../services/courseService';
import { useToast } from '../../components/ui/Toast';
import { displayDate } from '../../utils/dateUtils';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Pagination from '../../components/ui/Pagination';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const { showSuccess, showError } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    loadCourses();
  }, [currentPage]);

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    } else {
      loadCourses();
    }
  }, [searchTerm]);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const result = await courseService.getCourses(currentPage, pageSize);
      if (result.success) {
        setCourses(result.data.data || []);
        setTotalPages(result.data.totalPages || 1);
        setTotalCount(result.data.totalCount || 0);
        setHasNextPage(result.data.hasNextPage || false);
        setHasPreviousPage(result.data.hasPreviousPage || false);
      } else {
        showError('Failed to load courses');
      }
    } catch (error) {
      showError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      loadCourses();
      return;
    }

    const filteredCourses = courses.filter(course =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setCourses(filteredCourses);
  };

  const handleAddCourse = async (data) => {
    setActionLoading(prev => ({ ...prev, add: true }));
    try {
      const courseData = {
        name: data.name.trim(),
        description: data.description.trim(),
        credits: parseInt(data.credits)
      };

      const result = await courseService.createCourse(courseData);
      
      if (result.success) {
        showSuccess('Course created successfully!');
        setShowAddModal(false);
        reset();
        loadCourses();
      } else {
        showError(result.message || 'Failed to create course');
      }
    } catch (error) {
      showError('Failed to create course');
    } finally {
      setActionLoading(prev => ({ ...prev, add: false }));
    }
  };

  const handleEditCourse = async (data) => {
    setActionLoading(prev => ({ ...prev, edit: true }));
    try {
      const updateData = {
        name: data.name.trim(),
        description: data.description.trim(),
        credits: parseInt(data.credits)
      };

      const result = await courseService.updateCourse(editingCourse.id, updateData);
      
      if (result.success) {
        showSuccess('Course updated successfully!');
        setShowEditModal(false);
        setEditingCourse(null);
        reset();
        loadCourses();
      } else {
        showError(result.message || 'Failed to update course');
      }
    } catch (error) {
      showError('Failed to update course');
    } finally {
      setActionLoading(prev => ({ ...prev, edit: false }));
    }
  };

  const handleDeleteCourse = async (courseId, courseName) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete "${courseName}"?\n\nThis action cannot be undone and will remove all student enrollments for this course.`
    );

    if (!isConfirmed) return;

    setActionLoading(prev => ({ ...prev, [courseId]: true }));
    try {
      const result = await courseService.deleteCourse(courseId);
      
      if (result.success) {
        showSuccess(`${courseName} deleted successfully`);
        loadCourses();
      } else {
        showError(result.message || 'Failed to delete course');
      }
    } catch (error) {
      showError('Failed to delete course');
    } finally {
      setActionLoading(prev => ({ ...prev, [courseId]: false }));
    }
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setValue('name', course.name);
    setValue('description', course.description);
    setValue('credits', course.credits);
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingCourse(null);
    reset();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading courses..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="sm:flex sm:items-center mb-8">
          <div className="sm:flex-auto">
            <h1 className="text-3xl font-bold text-gray-900">Courses Management</h1>
            <p className="mt-2 text-gray-600">Create, edit, and manage course offerings</p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              Add Course
            </button>
          </div>
        </div>

        {/* Filtreleme */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="sr-only">Search courses</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search courses by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {totalCount} courses total
              </span>
            </div>
          </div>
        </div>

        {/* Dersler */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {courses.map((course) => (
              <div key={course.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 truncate">
                      {course.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {course.credits} Credits
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {course.enrolledStudentsCount || 0} Enrolled
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Course ID:</span>
                      <span className="font-medium text-gray-900">
                        #{course.id}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Created:</span>
                      <span className="font-medium text-gray-900">
                        {displayDate(course.createdAt, 'dd/MM/yyyy')}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(course)}
                      className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Edit Course
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id, course.name)}
                      disabled={actionLoading[course.id]}
                      className={`
                        flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md
                        ${actionLoading[course.id]
                          ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                          : 'text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                        }
                      `}
                    >
                      {actionLoading[course.id] ? (
                        <div className="flex items-center">
                          <LoadingSpinner size="sm" />
                          <span className="ml-2">Deleting...</span>
                        </div>
                      ) : (
                        'Delete Course'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg">
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {searchTerm ? 'No courses found' : 'No courses yet'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm 
                  ? 'Try adjusting your search terms.' 
                  : 'Get started by creating a new course.'
                }
              </p>
              <div className="mt-6">
                {searchTerm ? (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Clear Search
                  </button>
                ) : (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create First Course
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!searchTerm && totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              totalCount={totalCount}
              pageSize={pageSize}
            />
          </div>
        )}

        {/* Ders Ekleme */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Add New Course</h3>
                  <button
                    onClick={closeModals}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleSubmit(handleAddCourse)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Course Name</label>
                    <input
                      {...register('name', {
                        required: 'Course name is required',
                        minLength: { value: 3, message: 'Minimum 3 characters' },
                        maxLength: { value: 100, message: 'Maximum 100 characters' }
                      })}
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="e.g., Introduction to Computer Science"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      {...register('description', {
                        required: 'Course description is required',
                        minLength: { value: 10, message: 'Minimum 10 characters' },
                        maxLength: { value: 500, message: 'Maximum 500 characters' }
                      })}
                      rows="3"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Describe the course content and objectives..."
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Credits</label>
                      <input
                        {...register('credits', {
                          required: 'Credits is required',
                          min: { value: 1, message: 'Minimum 1 credit' },
                          max: { value: 20, message: 'Maximum 20 credits' }
                        })}
                        type="number"
                        min="1"
                        max="20"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      {errors.credits && <p className="mt-1 text-sm text-red-600">{errors.credits.message}</p>}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModals}
                      className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading.add}
                      className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                    >
                      {actionLoading.add ? (
                        <div className="flex items-center">
                          <LoadingSpinner size="sm" />
                          <span className="ml-2">Creating...</span>
                        </div>
                      ) : (
                        'Create Course'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Ders Düzenleme */}
        {showEditModal && editingCourse && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Edit Course</h3>
                  <button
                    onClick={closeModals}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleSubmit(handleEditCourse)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Course Name</label>
                    <input
                      {...register('name', {
                        required: 'Course name is required',
                        minLength: { value: 3, message: 'Minimum 3 characters' },
                        maxLength: { value: 100, message: 'Maximum 100 characters' }
                      })}
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      {...register('description', {
                        required: 'Course description is required',
                        minLength: { value: 10, message: 'Minimum 10 characters' },
                        maxLength: { value: 500, message: 'Maximum 500 characters' }
                      })}
                      rows="3"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Credits</label>
                      <input
                        {...register('credits', {
                          required: 'Credits is required',
                          min: { value: 1, message: 'Minimum 1 credit' },
                          max: { value: 20, message: 'Maximum 20 credits' }
                        })}
                        type="number"
                        min="1"
                        max="20"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      {errors.credits && <p className="mt-1 text-sm text-red-600">{errors.credits.message}</p>}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModals}
                      className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading.edit}
                      className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                    >
                      {actionLoading.edit ? (
                        <div className="flex items-center">
                          <LoadingSpinner size="sm" />
                          <span className="ml-2">Updating...</span>
                        </div>
                      ) : (
                        'Update Course'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage; 