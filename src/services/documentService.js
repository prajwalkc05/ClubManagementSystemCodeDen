import api from './api';

export const documentService = {
  getByEvent: (eventId) => api.get(`/documents/event/${eventId}`),
  upload: (formData) => api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  approve: (id) => api.patch(`/documents/${id}/approve`),
  reject: (id, reason) => api.patch(`/documents/${id}/reject`, { reason }),
  updateStatus: (id, status, remark) => {
    if (status === 'Approved') {
      return api.patch(`/documents/${id}/approve`, { remark });
    } else if (status === 'Rejected') {
      return api.patch(`/documents/${id}/reject`, { reason: remark });
    }
    return Promise.reject('Invalid status');
  },
  download: (id) => api.get(`/documents/${id}/download`, { responseType: 'blob' })
};
