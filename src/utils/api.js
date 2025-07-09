import axios from 'axios'
import toast from 'react-hot-toast'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const message = error.response?.data?.error || error.message || 'Something went wrong'
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Don't show "Session expired" message for the /auth/me endpoint during initialization
      // This is handled more gracefully in the AuthContext
      const isAuthMeRequest = error.config?.url?.includes('/auth/me')
      
      if (!isAuthMeRequest) {
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
        
        // Only redirect to home if not already on login/signup pages
        const currentPath = window.location.pathname
        if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
          window.location.href = '/'
        }
        
        toast.error('Session expired. Please login again.')
      }
    } else if (error.response?.status === 429) {
      toast.error('Too many requests. Please try again later.')
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.')
    } else if (error.response?.status !== 401) {
      // Don't show toast for 401 errors as they're handled above
      toast.error(message)
    }
    
    return Promise.reject(error)
  }
)

// Auth API functions
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData)
    return response.data
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/auth/password', passwordData)
    return response.data
  },
}

// Projects API functions
export const projectsAPI = {
  // Get all projects with filters
  getProjects: async (params = {}) => {
    const response = await api.get('/projects', { params })
    return response.data
  },

  // Get single project
  getProject: async (id) => {
    const response = await api.get(`/projects/${id}`)
    return response.data
  },

  // Create new project
  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData)
    return response.data
  },

  // Update project
  updateProject: async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData)
    return response.data
  },

  // Delete project
  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}`)
    return response.data
  },

  // Get featured projects
  getFeatured: async () => {
    const response = await api.get('/projects/featured')
    return response.data
  },

  // Search projects
  search: async (query) => {
    const response = await api.get(`/projects/search?q=${encodeURIComponent(query)}`)
    return response.data
  },
}

// Ratings API functions
export const ratingsAPI = {
  // Rate a project
  rateProject: async (projectId, rating) => {
    const response = await api.post('/ratings', { projectId, rating })
    return response.data
  },

  // Get project ratings
  getProjectRatings: async (projectId) => {
    const response = await api.get(`/ratings/project/${projectId}`)
    return response.data
  },

  // Get user ratings
  getUserRatings: async (userId) => {
    const response = await api.get(`/ratings/user/${userId}`)
    return response.data
  },
}

// Categories API functions
export const categoriesAPI = {
  // Get all categories
  getCategories: async () => {
    const response = await api.get('/categories')
    return response.data
  },

  // Create category (admin only)
  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData)
    return response.data
  },
}

// Analytics API functions
export const analyticsAPI = {
  // Get user stats
  getUserStats: async (userId) => {
    const response = await api.get(`/analytics/user/${userId}`)
    return response.data
  },

  // Get platform stats
  getPlatformStats: async () => {
    const response = await api.get('/analytics/platform')
    return response.data
  },

  // Get leaderboard
  getLeaderboard: async (period = 'monthly') => {
    const response = await api.get(`/analytics/leaderboard?period=${period}`)
    return response.data
  },
}

// Upload API functions
export const uploadAPI = {
  // Upload file
  uploadFile: async (file, type = 'image') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
}

// Utility functions
export const tokenUtils = {
  // Save auth token
  saveToken: (token) => {
    localStorage.setItem('authToken', token)
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem('authToken')
  },

  // Remove auth token
  removeToken: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken')
  },
}

// Export the api instance as both named and default export
export { api }
export default api 