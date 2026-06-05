import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data.data;
  },

  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data.data;
  },

  googleLogin: async (idToken) => {
    const response = await api.post('/auth/google', { idToken });
    return response.data.data;
  },

  appleLogin: async (idToken) => {
    const response = await api.post('/auth/apple', { idToken });
    return response.data.data;
  },

  logout: async () => {
    // Call backend logout if needed
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
