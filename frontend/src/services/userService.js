import api from './api';

export const userService = {

  getUsers: async (page = 1, pageSize = 10) => {
    try {
      const response = await api.get(`/User?page=${page}&pageSize=${pageSize}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch users'
      };
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await api.get(`/User/${userId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user'
      };
    }
  },

  createUser: async (userData) => {
    try {
      const response = await api.post('/User', userData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create user'
      };
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/User/${userId}`, userData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update user'
      };
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/User/${userId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete user'
      };
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/User/profile');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch profile'
      };
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await api.put('/User/profile', userData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile'
      };
    }
  },

  getStudents: async (page = 1, pageSize = 10) => {
    try {
      const response = await api.get(`/User/students?page=${page}&pageSize=${pageSize}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch students'
      };
    }
  },

  getAdmins: async (page = 1, pageSize = 10) => {
    try {
      const response = await api.get(`/User/admins?page=${page}&pageSize=${pageSize}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch admins'
      };
    }
  },

  getUserEnrollments: async (userId) => {
    try {
      const response = await api.get(`/User/${userId}/enrollments`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user enrollments'
      };
    }
  }
};

export default userService; 