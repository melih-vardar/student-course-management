import React, { useState, useEffect } from 'react';
import { enrollmentService } from '../../services/enrollmentService';
import { courseService } from '../../services/courseService';
import { userService } from '../../services/userService';
import { useToast } from '../../components/ui/Toast';
import { displayDate, displayDateOnly } from '../../utils/dateUtils';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Pagination from '../../components/ui/Pagination';

const EnrollmentsPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourseForEnroll, setSelectedCourseForEnroll] = useState('');
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    loadData();
  }, [currentPage]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [enrollmentsResult, coursesResult, studentsResult] = await Promise.all([
        enrollmentService.getAllEnrollments(currentPage, pageSize),
        courseService.getCourses(1, 100),
        userService.getUsers(1, 100)
      ]);

      if (enrollmentsResult.success) {
        setEnrollments(enrollmentsResult.data.data || []);
        setTotalPages(enrollmentsResult.data.totalPages || 1);
        setTotalCount(enrollmentsResult.data.totalCount || 0);
        setHasNextPage(enrollmentsResult.data.hasNextPage || false);
        setHasPreviousPage(enrollmentsResult.data.hasPreviousPage || false);
      } else {
        showError('Failed to load enrollments');
      }

      if (coursesResult.success) {
        setCourses(coursesResult.data.data || []);
      }

      if (studentsResult.success) {
        const studentsOnly = studentsResult.data.data.filter(user => user.role === 'Student');
        setStudents(studentsOnly);
      }
    } catch (error) {
      showError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Aktif filtreleme
  const filteredEnrollments = enrollments.filter(enrollment => {
    if (searchTerm) {
      const matchesSearch = 
        enrollment.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.studentEmail?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
    }

    if (selectedCourse) {
      const selectedCourseId = parseInt(selectedCourse);
      if (enrollment.courseId !== selectedCourseId) return false;
    }

    return true;
  });

  const handleEnrollStudent = async () => {
    if (!selectedStudent || !selectedCourseForEnroll) {
      showError('Please select both student and course');
      return;
    }

    setActionLoading(prev => ({ ...prev, enroll: true }));
    try {
      const result = await enrollmentService.adminEnrollStudent(selectedStudent, selectedCourseForEnroll);
      
      if (result.success) {
        showSuccess('Student enrolled successfully!');
        setShowEnrollModal(false);
        setSelectedStudent('');
        setSelectedCourseForEnroll('');
        loadData();
      } else {
        if (result.errors && result.errors.length > 0) {
          const errorList = result.errors.map(error => `• ${error}`).join('\n');
          showError(`Failed to enroll student:\n${errorList}`, 8000);
        } else {
          showError(result.message || 'Failed to enroll student');
        }
      }
    } catch (error) {
      showError('Failed to enroll student: ' + (error.message || 'Unknown error'));
    } finally {
      setActionLoading(prev => ({ ...prev, enroll: false }));
    }
  };

  const handleWithdrawStudent = async (enrollmentId, studentName, courseName) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to withdraw "${studentName}" from "${courseName}"?\n\nThis action cannot be undone.`
    );

    if (!isConfirmed) return;

    setActionLoading(prev => ({ ...prev, [enrollmentId]: true }));
    try {
      const result = await enrollmentService.removeEnrollment(enrollmentId);
      
      if (result.success) {
        showSuccess(`${studentName} withdrawn from ${courseName} successfully`);
        loadData(); 
      } else {
        if (result.errors && result.errors.length > 0) {
          const errorList = result.errors.map(error => `• ${error}`).join('\n');
          showError(`Failed to withdraw student:\n${errorList}`, 8000);
        } else {
          showError(result.message || 'Failed to withdraw student');
        }
      }
    } catch (error) {
      showError('Failed to withdraw student');
    } finally {
      setActionLoading(prev => ({ ...prev, [enrollmentId]: false }));
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeEnrollModal = () => {
    setShowEnrollModal(false);
    setSelectedStudent('');
    setSelectedCourseForEnroll('');
  };

  const getEnrollmentStats = () => {
    const courseStats = {};
    filteredEnrollments.forEach(enrollment => {
      if (!courseStats[enrollment.courseId]) {
        courseStats[enrollment.courseId] = {
          courseName: enrollment.courseName,
          count: 0
        };
      }
      courseStats[enrollment.courseId].count++;
    });
    return courseStats;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading enrollments..." />
      </div>
    );
  }

  const enrollmentStats = getEnrollmentStats();

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="sm:flex sm:items-center mb-8">
          <div className="sm:flex-auto">
            <h1 className="text-3xl font-bold text-gray-900">Enrollments Management</h1>
            <p className="mt-2 text-gray-600">Monitor and manage all student course enrollments</p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={() => setShowEnrollModal(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              Enroll Student
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Enrollments
                    </dt>
                    <dd className="text-3xl font-bold text-gray-900">
                      {totalCount}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active Courses
                    </dt>
                    <dd className="text-3xl font-bold text-gray-900">
                      {Object.keys(enrollmentStats).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Avg per Course
                    </dt>
                    <dd className="text-lg font-bold text-gray-900">
                      {Object.keys(enrollmentStats).length > 0 
                        ? Math.round(totalCount / Object.keys(enrollmentStats).length * 10) / 10 
                        : 0} students
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Students
                    </dt>
                    <dd className="text-3xl font-bold text-gray-900">
                      {students.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtreleme */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="sr-only">Search enrollments</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by student name, email, or course..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="sm:w-64">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Courses</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {filteredEnrollments.length} enrollments {searchTerm || selectedCourse ? 'found' : 'total'}
              </span>
            </div>
          </div>
        </div>

        {/* Enrollments Tablosu */}
        {filteredEnrollments.length > 0 ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enrollment Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEnrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                              <span className="text-sm font-bold text-white">
                                {enrollment.studentName?.charAt(0) || 'S'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {enrollment.studentName || 'Unknown Student'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {enrollment.studentEmail || 'No email'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {enrollment.courseName || 'Unknown Course'}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: #{enrollment.courseId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {displayDate(enrollment.enrollmentDate, 'dd/MM/yyyy HH:mm')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {displayDateOnly(enrollment.enrollmentDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleWithdrawStudent(
                            enrollment.id, 
                            enrollment.studentName, 
                            enrollment.courseName
                          )}
                          disabled={actionLoading[enrollment.id]}
                          className={`font-medium ${actionLoading[enrollment.id] 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-red-600 hover:text-red-900'
                          }`}
                        >
                          {actionLoading[enrollment.id] ? 'Withdrawing...' : 'Withdraw'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg">
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {searchTerm || selectedCourse ? 'No matching enrollments' : 'No enrollments yet'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedCourse
                  ? 'Try adjusting your search terms or filters.' 
                  : 'Start by enrolling students in courses.'
                }
              </p>
              <div className="mt-6">
                {searchTerm || selectedCourse ? (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCourse('');
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Clear Filters
                  </button>
                ) : (
                  <button
                    onClick={() => setShowEnrollModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Enroll First Student
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!searchTerm && !selectedCourse && totalPages > 1 && (
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

        {/* Öğrenci Derse Kayıt */}
        {showEnrollModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Enroll Student in Course</h3>
                  <button
                    onClick={closeEnrollModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Select Student</label>
                    <select
                      value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Choose a student...</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.firstName} {student.lastName} ({student.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Select Course</label>
                    <select
                      value={selectedCourseForEnroll}
                      onChange={(e) => setSelectedCourseForEnroll(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Choose a course...</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.name} ({course.credits} credits)
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeEnrollModal}
                      className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEnrollStudent}
                      disabled={actionLoading.enroll || !selectedStudent || !selectedCourseForEnroll}
                      className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                    >
                      {actionLoading.enroll ? (
                        <div className="flex items-center">
                          <LoadingSpinner size="sm" />
                          <span className="ml-2">Enrolling...</span>
                        </div>
                      ) : (
                        'Enroll Student'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrollmentsPage;