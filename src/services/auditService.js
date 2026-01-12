import api from './api';

export const auditService = {
  getLogs: (filters) => api.get('/audit/logs', { params: filters })
};
