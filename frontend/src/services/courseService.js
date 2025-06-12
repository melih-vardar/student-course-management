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
        message: error.response?.data?.message || 'Failed to fetch courses'
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
        message: error.response?.data?.message || 'Failed to fetch course'
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
        message: error.response?.data?.message || 'Failed to fetch course info'
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
        message: error.response?.data?.message || 'Failed to create course'
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
        message: error.response?.data?.message || 'Failed to update course'
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
        message: error.response?.data?.message || 'Failed to delete course'
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
        message: error.response?.data?.message || 'Failed to fetch available courses'
      };
    }
  }
};

export default courseService; 