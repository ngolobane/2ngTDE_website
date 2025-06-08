const API_BASE_URL = '/api';

// Auth API
const AuthAPI = {
  login: async (credentials) => {
    const res = await fetch(${API_BASE_URL}/login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return await res.json();
  },
  // Add your other methods...
};

// Products API
const ProductsAPI = {
  getProducts: async () => {
    const res = await fetch(${API_BASE_URL}/products);
    return await res.json();
  },
  // Add your other methods...
};

// Cart API (using localStorage)
const CartAPI = {
  getCart: () => {
    return JSON.parse(localStorage.getItem('cart')) || [];
  },
  // Add your other methods...
};
