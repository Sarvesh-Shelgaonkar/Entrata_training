import API from "./axios";

export const register = (name, email, password) =>
  API.post("/auth/register", { name, email, password });

export const login = (email, password) =>
  API.post("/auth/login", { email, password });

export const forgotPassword = (email) =>
  API.post("/auth/forgot-password", { email });

export const resetPassword = (email, otp, newPassword) =>
  API.post("/auth/reset-password", { email, otp, newPassword });
