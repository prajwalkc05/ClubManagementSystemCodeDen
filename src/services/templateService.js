import api from './api';

export const templateService = {
  getAll: () => api.get('/templates'),
  upload: (formData) => api.post('/templates/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/templates/${id}`)
};
