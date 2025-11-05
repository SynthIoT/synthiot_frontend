import API from "../api";

export const createChat = (projectId, userId, message) =>
  API.post(`/chat/create/${projectId}/${userId}`, { message });

export const getChatList = (projectId, userId) =>
  API.get(`/chat/list/${projectId}/${userId}`);

export const getChatHistory = (projectId, chatId, userId) =>
  API.get(`/chat/history/${projectId}/${chatId}/${userId}`);

export const sendMessage = (projectId, chatId, userId, message) =>
  API.post(`/chat/send/${projectId}/${chatId}/${userId}`, { message });