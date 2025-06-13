import api from './api';

export const courseService = {

  getCourses: async (page = 1, pageSize = 10) => {
    try {
      const response = await api.get(`/Course?page=${page}&pageSize=${pageSize}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch courses',
        errors: error.response?.data?.errors || []
      };
    }
  },

  getCourseById: async (courseId) => {
    try {
      const response = await api.get(`/Course/${courseId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch course',
        errors: error.response?.data?.errors || []
      };
    }
  },

  getCourseInfo: async (courseId) => {
    try {
      const response = await api.get(`/Course/${courseId}/info`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch course info',
        errors: error.response?.data?.errors || []
      };
    }
  },

  createCourse: async (courseData) => {
    try {
      const response = await api.post('/Course', courseData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create course',
        errors: error.response?.data?.errors || []
      };
    }
  },

  updateCourse: async (courseId, courseData) => {
    try {
      const response = await api.put(`/Course/${courseId}`, courseData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update course',
        errors: error.response?.data?.errors || []
      };
    }
  },

  deleteCourse: async (courseId) => {
    try {
      const response = await api.delete(`/Course/${courseId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete course',
        errors: error.response?.data?.errors || []
      };
    }
  },

  getAvailableCourses: async () => {
    try {
      const response = await api.get('/Course/available');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch available courses',
        errors: error.response?.data?.errors || []
      };
    }
  },

  getCourseEnrollments: async (courseId) => {
    try {
      const response = await api.get(`/Course/${courseId}/enrollments`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch course enrollments',
        errors: error.response?.data?.errors || []
      };
    }
  }
};

export default courseService; 