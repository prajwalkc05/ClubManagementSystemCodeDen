import api from './api';

export const authService = {
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    return data;
  },
  
  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  },
  
  getRole: () => localStorage.getItem('role'),
  
  isAuthenticated: () => !!localStorage.getItem('token')
};
