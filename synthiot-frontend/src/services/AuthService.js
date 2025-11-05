// src/services/AuthService.js
import API from "../api";

export const registerUser = async (userData) => {
  const response = await API.post("/users/create-users", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await API.post("/users/get-users", credentials);
  return response.data;
};