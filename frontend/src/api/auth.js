import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const registerUser = async ({ email, username, password, confirm_password }) => {
  const { data } = await axios.post(`${BASE}/auth/register`, {
    email,
    username,
    password,
    confirm_password,
  });
  return data;
};

export const loginUser = async ({ email, password }) => {
  const { data } = await axios.post(`${BASE}/auth/login`, { email, password });
  return data;
};