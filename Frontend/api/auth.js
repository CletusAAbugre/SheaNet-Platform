// Auth API Service
const API_BASE = 'http://localhost:5000/api/auth';

export const register = async (userData) => {
    const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    return await response.json();
};

export const login = async (email, password) => {
    const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // For cookies
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.token) localStorage.setItem('token', data.token); // Store JWT
    return data;
};

export const logout = async () => {
    localStorage.removeItem('token'); // Clear JWT
};