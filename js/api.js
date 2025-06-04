// API Integration for Clothing Shop

// Base API URL
const API_BASE_URL = '/api';

// Authentication API
const AuthAPI = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  // Login user
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      // If login successful, store token in localStorage
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return { data, status: response.status };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Get user profile
  getProfile: async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return await response.json();
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },
  
  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
  
  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  },
  
  // Check if user is logged in
  isLoggedIn: () => {
    return localStorage.getItem('token') !== null;
  },
  
  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

// Products API
const ProductsAPI = {
  // Get all products
  getProducts: async (filters = {}) => {
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.featured) queryParams.append('featured', filters.featured);
      if (filters.new) queryParams.append('new', filters.new);
      if (filters.sale) queryParams.append('sale', filters.sale);
      if (filters.search) queryParams.append('search', filters.search);
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/products/${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  },
  
  // Get single product
  getProduct: async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`);
      return await response.json();
    } catch (error) {
      console.error(`Get product ${productId} error:`, error);
      throw error;
    }
  },
  
  // Get all categories
  getCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/categories`);
      return await response.json();
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  },
  
  // Get featured products
  getFeaturedProducts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/featured`);
      return await response.json();
    } catch (error) {
      console.error('Get featured products error:', error);
      throw error;
    }
  },
  
  // Get new products
  getNewProducts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/new`);
      return await response.json();
    } catch (error) {
      console.error('Get new products error:', error);
      throw error;
    }
  },
  
  // Get sale products
  getSaleProducts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/sale`);
      return await response.json();
    } catch (error) {
      console.error('Get sale products error:', error);
      throw error;
    }
  }
};

// Orders API
const OrdersAPI = {
  // Create new order
  createOrder: async (orderData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  },
  
  // Get user orders
  getUserOrders: async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return await response.json();
    } catch (error) {
      console.error('Get user orders error:', error);
      throw error;
    }
  },
  
  // Get single order
  getOrder: async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return await response.json();
    } catch (error) {
      console.error(`Get order ${orderId} error:`, error);
      throw error;
    }
  },
  
  // Cancel order
  cancelOrder: async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return await response.json();
    } catch (error) {
      console.error(`Cancel order ${orderId} error:`, error);
      throw error;
    }
  }
};

// Cart functionality
const CartAPI = {
  // Get cart from localStorage
  getCart: () => {
    const cartStr = localStorage.getItem('cart');
    return cartStr ? JSON.parse(cartStr) : [];
  },
  
  // Add item to cart
  addToCart: (product, quantity = 1) => {
    const cart = CartAPI.getCart();
    
    // Check if product is already in cart
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex > -1) {
      // Product exists, increase quantity
      cart[existingProductIndex].quantity += quantity;
    } else {
      // Add new product to cart
      cart.push({
        id: product.id,
        name: product.name,
        price: product.sale_price || product.price,
        image_url: product.image_url,
        category: product.category,
        quantity: quantity
      });
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Dispatch custom event for cart update
    window.dispatchEvent(new CustomEvent('cart-updated'));
    
    return cart;
  },
  
  // Update cart item quantity
  updateCartItem: (productId, quantity) => {
    const cart = CartAPI.getCart();
    
    // Find product in cart
    const productIndex = cart.findIndex(item => item.id === productId);
    
    if (productIndex > -1) {
      if (quantity > 0) {
        // Update quantity
        cart[productIndex].quantity = quantity;
      } else {
        // Remove item if quantity is 0 or less
        cart.splice(productIndex, 1);
      }
      
      // Save cart to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Dispatch custom event for cart update
      window.dispatchEvent(new CustomEvent('cart-updated'));
    }
    
    return cart;
  },
  
  // Remove item from cart
  removeFromCart: (productId) => {
    const cart = CartAPI.getCart();
    
    // Filter out the product
    const updatedCart = cart.filter(item => item.id !== productId);
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Dispatch custom event for cart update
    window.dispatchEvent(new CustomEvent('cart-updated'));
    
    return updatedCart;
  },
  
  // Clear cart
  clearCart: () => {
    localStorage.removeItem('cart');
    
    // Dispatch custom event for cart update
    window.dispatchEvent(new CustomEvent('cart-updated'));
    
    return [];
  },
  
  // Get cart total
  getCartTotal: () => {
    const cart = CartAPI.getCart();
    
    return cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  },
  
  // Get cart item count
  getCartItemCount: () => {
    const cart = CartAPI.getCart();
    
    return cart.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  }
};

// Export APIs
window.AuthAPI = AuthAPI;
window.ProductsAPI = ProductsAPI;
window.OrdersAPI = OrdersAPI;
window.CartAPI = CartAPI;
