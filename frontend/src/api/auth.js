import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const registerUser = async ({ email, username, password }) => {
    const { data } = await axios.post(`${BASE}/auth/register`, {
        email,
        username,
        password,
    });
    return data; // { access_token, token_type }
};

export const loginUser = async ({ email, password }) => {
    const { data } = await axios.post(`${BASE}/auth/login`, {
        email,
        password,
    });
    return data;
};
