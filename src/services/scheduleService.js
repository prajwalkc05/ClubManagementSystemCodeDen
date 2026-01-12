import api from './api';

export const scheduleService = {
  getAll: () => api.get('/schedules'),
  getByClub: (clubId) => api.get(`/schedules/club/${clubId}`),
  create: (data) => api.post('/schedules', data),
  update: (id, data) => api.put(`/schedules/${id}`, data),
  delete: (id) => api.delete(`/schedules/${id}`)
};
