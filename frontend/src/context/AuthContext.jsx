import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import axios from 'axios';

const AuthContext = createContext();

// Configure axios defaults
const API_URL =  'https://doctors-2g6m.onrender.com/api';

axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

// Add token to requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get('/auth/me');
      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData);
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
        toast.success('Registration successful!');
        return { success: true };
      } else {
        toast.error(response.data.message || 'Registration failed');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Login
  const login = async (credentials) => {
    try {
      const response = await axios.post('/auth/login', credentials);
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
        toast.success('Login successful!');
        return { success: true };
      } else {
        toast.error(response.data.message || 'Login failed');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await axios.post('/auth/logout');
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Update Profile
  const updateProfile = async (data) => {
    try {
      const response = await axios.put('/auth/update-profile', data);
      if (response.data.success) {
        setUser(response.data.user);
        toast.success('Profile updated successfully!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    register,
    login,
    logout,
    updateProfile,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Additional API functions for other features

// Publications API
export const publicationsAPI = {
  getAll: async (params) => {
    try {
      const response = await axios.get('/publications', { params });
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch publications');
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`/publications/${id}`);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch publication');
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await axios.post('/publications', data);
      toast.success('Publication created successfully!');
      return response.data;
    } catch (error) {
      toast.error('Failed to create publication');
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await axios.put(`/publications/${id}`, data);
      toast.success('Publication updated successfully!');
      return response.data;
    } catch (error) {
      toast.error('Failed to update publication');
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await axios.delete(`/publications/${id}`);
      toast.success('Publication deleted successfully!');
      return response.data;
    } catch (error) {
      toast.error('Failed to delete publication');
      throw error;
    }
  },
};

// Clinical Trials API
// export const trialsAPI = {
//   getAll: async (params) => {
//     try {
//       const response = await axios.get('/trials/', { params });
//       return response.data;
//     } catch (error) {
//       toast.error('Failed to fetch trials');
//       throw error;
//     }
//   },

//   getById: async (id) => {
//     try {
//       const response = await axios.get(`/trials/${id}`);
//       return response.data;
//     } catch (error) {
//       toast.error('Failed to fetch trial');
//       throw error;
//     }
//   },

//   create: async (data) => {
//     try {
//       const response = await axios.post('/', data);
//       toast.success('Trial created successfully!');
//       return response.data;
//     } catch (error) {
//       toast.error('Failed to create trial');
//       throw error;
//     }
//   },

//   update: async (id, data) => {
//     try {
//       const response = await axios.put(`/trials/${id}`, data);
//       toast.success('Trial updated successfully!');
//       return response.data;
//     } catch (error) {
//       toast.error('Failed to update trial');
//       throw error;
//     }
//   },

//   delete: async (id) => {
//     try {
//       const response = await axios.delete(`/trials/${id}`);
//       toast.success('Trial deleted successfully!');
//       return response.data;
//     } catch (error) {
//       toast.error('Failed to delete trial');
//       throw error;
//     }
//   },
// };

export const trialsAPI = {
  // ✅ Get all trials
  getAll: async (params) => {
    try {
      const response = await axios.get('/trials', { params });
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch trials');
      throw error;
    }
  },

  // ✅ Get a single trial by ID
  getById: async (id) => {
    try {
      const response = await axios.get(`/trials/${id}`);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch trial');
      throw error;
    }
  },

  // ✅ Create a new trial (requires researcher auth)
  create: async (data, token) => {
    try {
      const response = await axios.post('/trials', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Trial created successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create trial');
      throw error;
    }
  },

  // ✅ Update a trial (requires researcher auth)
  update: async (id, data, token) => {
    try {
      const response = await axios.put(`/trials/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Trial updated successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update trial');
      throw error;
    }
  },

  // ✅ Delete a trial (requires researcher auth)
  delete: async (id, token) => {
    try {
      const response = await axios.delete(`/trials/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Trial deleted successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete trial');
      throw error;
    }
  },
};

// Forum API
export const forumAPI = {
  getPosts: async (params) => {
    try {
      const response = await axios.get('/forum', { params });
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch posts');
      throw error;
    }
  },
    getPostById: async (id) => {
    try {
      const response = await axios.get(`/forum/${id}`);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch post');
      throw error;
    }
  },

  createPost: async (data) => {
    try {
      const response = await axios.post('/forum', data,{
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials:true
      });
      
      toast.success('Post created successfully!');
      return response.data;
    } catch (error) {
      toast.error('Failed to create post');
      throw error;
    }
  },

  updatePost: async (id, data) => {
    try {
      const response = await axios.put(`/forum/${id}`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials:true
      });
      toast.success('Post updated successfully!');
      return response.data;
    } catch (error) {
      toast.error('Failed to update post');
      throw error;
    }
  },


  

  toggleReaction: async (id, type) => {
    try {
      const response = await axios.put(`/forum/${id}/react`,{ type }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials:true
    });
      return response.data;
    } catch (error) {
      toast.error('Failed to react to post');
      throw error;
    }
  },

addReply: async (id, content) => {
  try {
    const response = await axios.post(
      `/forum/${id}/reply`,
      { content }, // ✅ Body first
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true, // ✅ Config last
      }
    );

    toast.success('Reply added successfully!');
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to add reply');
    throw error;
  }
},


  deletePost: async (id) => {
    try {
      const response = await axios.delete(`/forum/${id}`,{
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials:true
      });
      toast.success('Post deleted successfully!');
      return response.data;
    } catch (error) {
      toast.error('Failed to delete post');
      throw error;
    }
  },
};

export default AuthContext;
