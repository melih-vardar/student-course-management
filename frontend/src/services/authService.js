import api from './api';

export const authService = {

  async login(email, password) {
    try {
      const response = await api.post('/Auth/login', {
        email,
        password
      });

      if (response.data && response.data.token) {
        const { token, email: userEmail, firstName, lastName, role, ...otherUserData } = response.data;
        
        const user = {
          email: userEmail,
          firstName,
          lastName,
          role,
          ...otherUserData
        };

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Gelecekteki istekler için default auth header
        // Her seferinde authorization: Bearer token diye eklemek zorunda kalmıyoruz.
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        return {
          success: true,
          data: {
            token,
            user
          }
        };
      } else {
        return {
          success: false,
          message: 'Invalid response from server'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      const message = error.response?.data?.message || 
                     error.response?.data?.error ||
                     error.message || 
                     'Login failed';
      
      return {
        success: false,
        message
      };
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/Auth/register', userData);
      
      if (response.data && response.data.token) {
        const { token, email: userEmail, firstName, lastName, role, ...otherUserData } = response.data;
        
        const user = {
          email: userEmail,
          firstName,
          lastName,
          role,
          ...otherUserData
        };

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        return {
          success: true,
          data: {
            token,
            user
          }
        };
      } else {
        return {
          success: false,
          message: 'Invalid response from server'
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      const message = error.response?.data?.message || 
                     error.response?.data?.error ||
                     error.message || 
                     'Registration failed';
      
      return {
        success: false,
        message
      };
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  },

  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token && !this.isTokenExpired();
  },

  isTokenExpired() {
    const token = localStorage.getItem('token');
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  }
}; 