import React, { useState, useEffect } from 'react';
import { courseService } from '../../services/courseService';
import { enrollmentService } from '../../services/enrollmentService';
import { useToast } from '../../components/ui/Toast';
import { displayDate } from '../../utils/dateUtils';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Pagination from '../../components/ui/Pagination';

const AvailableCourses = () => {
  const [allCourses, setAllCourses] = useState([]); // Store all available courses
  const [courses, setCourses] = useState([]); // Store filtered/paginated courses
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState({});
  const [myEnrollments, setMyEnrollments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFiltersAndPagination();
  }, [allCourses, searchTerm, currentPage]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [coursesResult, enrollmentsResult] = await Promise.all([
        courseService.getAvailableCourses(),
        enrollmentService.getMyEnrollments()
      ]);

      if (coursesResult.success) {
        setAllCourses(coursesResult.data || []);
      } else {
        showError('Failed to load available courses');
      }

      if (enrollmentsResult.success) {
        setMyEnrollments(enrollmentsResult.data || []);
      }
    } catch (error) {
      showError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndPagination = () => {
    let filteredCourses = allCourses;

    if (searchTerm.trim()) {
      filteredCourses = allCourses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Hesaplamalar
    const totalFiltered = filteredCourses.length;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

    setCourses(paginatedCourses);
    setTotalCount(totalFiltered);
    setTotalPages(Math.ceil(totalFiltered / pageSize));
    setHasNextPage(endIndex < totalFiltered);
    setHasPreviousPage(currentPage > 1);
  };

  // Arama yapıldığında sayfa sıfırlaması
  const handleSearch = () => {
    setCurrentPage(1);
  };

  const isEnrolled = (courseId) => {
    return myEnrollments.some(enrollment => enrollment.courseId === courseId);
  };

  const handleEnroll = async (courseId) => {
    if (isEnrolled(courseId)) {
      showError('You are already enrolled in this course');
      return;
    }

    setEnrolling(prev => ({ ...prev, [courseId]: true }));
    try {
      const result = await enrollmentService.enrollInCourse(courseId);
      
      if (result.success) {
        showSuccess('Successfully enrolled in course!');
        setMyEnrollments(prev => [...prev, result.data]);
      } else {
        showError(result.message || 'Failed to enroll in course');
      }
    } catch (error) {
      showError('Failed to enroll in course');
    } finally {
      setEnrolling(prev => ({ ...prev, [courseId]: false }));
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading available courses..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Available Courses</h1>
          <p className="mt-2 text-gray-600">Browse and enroll in available courses</p>
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
                {totalCount} courses available
              </span>
            </div>
          </div>
        </div>

        {/* Ders */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {courses.map((course) => (
              <div key={course.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 truncate">
                      {course.name}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {course.credits} Credits
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                    {course.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Enrolled Students:</span>
                      <span className="font-medium">
                        {course.enrolledStudentsCount || 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Created:</span>
                      <span className="font-medium">
                        {displayDate(course.createdAt, 'dd/MM/yyyy')}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {isEnrolled(course.id) ? (
                      <span className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-green-50 cursor-default">
                        ✓ Enrolled
                      </span>
                    ) : (
                      <button
                        onClick={() => handleEnroll(course.id)}
                        disabled={enrolling[course.id]}
                        className={`
                          flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                          ${enrolling[course.id]
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                          }
                        `}
                      >
                        {enrolling[course.id] ? (
                          <div className="flex items-center">
                            <LoadingSpinner size="sm" />
                            <span className="ml-2">Enrolling...</span>
                          </div>
                        ) : (
                          'Enroll Now'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {searchTerm ? 'No courses found' : 'No courses available'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm 
                ? 'Try adjusting your search terms.' 
                : 'Check back later for new courses.'
              }
            </p>
            {searchTerm && (
              <div className="mt-6">
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        )}

        {!searchTerm && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            totalCount={totalCount}
            pageSize={pageSize}
          />
        )}
      </div>
    </div>
  );
};

export default AvailableCourses; 