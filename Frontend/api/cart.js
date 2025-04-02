const API_BASE = 'http://localhost:5000/api';

export const getCart = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/cart`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    return await response.json();
};

export const addToCart = async (productId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/cart`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId }),
    });
    return await response.json();
};