import api from './api';

export const enrollmentService = {

  getMyEnrollments: async () => {
    try {
      const response = await api.get('/Enrollment/my-enrollments');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch enrollments',
        errors: error.response?.data?.errors || []
      };
    }
  },

  enrollInCourse: async (courseId) => {
    try {
      const requestData = {
        courseId: parseInt(courseId)
      };
      
      const response = await api.post('/Enrollment/enroll', requestData);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('API Error - Enroll in Course:', error.response?.data);
      
      return {
        success: false,
        message: error.response?.data?.message || error.response?.data?.Message || 'Failed to enroll in course',
        errors: error.response?.data?.errors || []
      };
    }
  },

  withdrawFromCourse: async (courseId) => {
    try {
      const courseIdInt = parseInt(courseId);
      const response = await api.delete(`/Enrollment/unenroll/${courseIdInt}`);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('API Error - Withdraw from Course:', error.response?.data);
      
      return {
        success: false,
        message: error.response?.data?.message || error.response?.data?.Message || 'Failed to withdraw from course',
        errors: error.response?.data?.errors || []
      };
    }
  },

  getAllEnrollments: async (page = 1, pageSize = 10) => {
    try {
      const response = await api.get(`/Enrollment?page=${page}&pageSize=${pageSize}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch enrollments',
        errors: error.response?.data?.errors || []
      };
    }
  },

  adminEnrollStudent: async (studentId, courseId) => {
    try {
      const requestData = {
        studentId: studentId,
        courseId: parseInt(courseId)
      };
      
      const response = await api.post('/Enrollment/admin-enroll', requestData);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('API Error - Admin Enroll Student:', error.response?.data);
      
      return {
        success: false,
        message: error.response?.data?.message || error.response?.data?.Message || 'Failed to enroll student',
        errors: error.response?.data?.errors || []
      };
    }
  },

  removeEnrollment: async (enrollmentId) => {
    try {
      const enrollmentIdInt = parseInt(enrollmentId);
      const response = await api.delete(`/Enrollment/${enrollmentIdInt}`);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('API Error - Remove Enrollment:', error.response?.data);
      
      return {
        success: false,
        message: error.response?.data?.message || error.response?.data?.Message || 'Failed to remove enrollment',
        errors: error.response?.data?.errors || []
      };
    }
  }
};

export default enrollmentService; 