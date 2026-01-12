import api from './api';

export const chatService = {
  getMessages: (clubId) => api.get(`/chat/${clubId}`),
  sendMessage: (clubId, message) => api.post(`/chat/${clubId}`, { message }),
  updateMessage: (messageId, message) => api.put(`/chat/message/${messageId}`, { message }),
  deleteMessage: (messageId) => api.delete(`/chat/message/${messageId}`)
};
