const API_BASE = 'http://localhost:5000/api';

export const fetchProducts = async () => {
    const response = await fetch(`${API_BASE}/products`);
    return await response.json();
};

export const fetchProductById = async (id) => {
    const response = await fetch(`${API_BASE}/products/${id}`);
    return await response.json();
};