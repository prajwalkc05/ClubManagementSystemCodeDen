import api from './api';

export const checklistService = {
  getByEvent: (eventId) => api.get(`/checklists/event/${eventId}`),
  create: (eventId, items) => api.post(`/checklists/event/${eventId}`, { items }),
  update: (checklistId, items) => api.put(`/checklists/${checklistId}`, { items }),
  uploadDocument: (checklistItemId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/checklists/item/${checklistItemId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  lock: (checklistId) => api.patch(`/checklists/${checklistId}/lock`)
};
