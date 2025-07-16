import axios from 'axios'
import toast from 'react-hot-toast'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 20000,
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
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Something went wrong'
    
    if (error.response?.status === 401) {
      const isAuthMeRequest = error.config?.url?.includes('/auth/me')
      
      if (!isAuthMeRequest) {
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
        
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
      toast.error(message)
    }
    
    return Promise.reject(error)
  }
)

// Auth API functions
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData)
    return response.data
  },

  changePassword: async (passwordData) => {
    const response = await api.put('/auth/password', passwordData)
    return response.data
  },
}

// Projects API functions
export const projectsAPI = {
  getProjects: async (params = {}) => {
    const response = await api.get('/projects', { params })
    return response.data
  },

  getProject: async (id) => {
    const response = await api.get(`/projects/${id}`)
    return response.data
  },

  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData)
    return response.data
  },

  updateProject: async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData)
    return response.data
  },

  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}`)
    return response.data
  },

  getFeatured: async () => {
    const response = await api.get('/projects/featured')
    return response.data
  },

  search: async (query) => {
    const response = await api.get(`/projects/search?q=${encodeURIComponent(query)}`)
    return response.data
  },
}

// Ratings API functions
export const ratingsAPI = {
  // Get project rating summary with distribution
  getProjectSummary: async (projectId) => {
    const response = await api.get(`/ratings/project/${projectId}/summary`)
    return response.data
  },

  // Get ratings for a project with pagination
  getProjectRatings: async (projectId, params = {}) => {
    const response = await api.get(`/ratings/project/${projectId}`, { params })
    return response.data
  },

  // Rate a project
  rateProject: async (projectId, ratingData) => {
    const response = await api.post(`/ratings/project/${projectId}`, ratingData)
    return response.data
  },

  // Update a rating
  updateRating: async (projectId, ratingData) => {
    const response = await api.put(`/ratings/project/${projectId}`, ratingData)
    return response.data
  },

  // Delete a rating
  deleteRating: async (projectId) => {
    const response = await api.delete(`/ratings/project/${projectId}`)
    return response.data
  },

  // Get user's rating for a project
  getMyRating: async (projectId) => {
    const response = await api.get(`/ratings/project/${projectId}/my-rating`)
    return response.data
  },

  // Get all ratings by current user
  getMyRatings: async (params = {}) => {
    const response = await api.get('/ratings/my-ratings', { params })
    return response.data
  },
}

// Categories API functions
export const categoriesAPI = {
  getCategories: async () => {
    const response = await api.get('/categories')
    return response.data
  },

  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData)
    return response.data
  },
}

// Analytics API functions
export const analyticsAPI = {
  getUserStats: async (userId) => {
    const response = await api.get(`/analytics/user/${userId}`)
    return response.data
  },

  getPlatformStats: async () => {
    const response = await api.get('/analytics/platform')
    return response.data
  },

  getLeaderboard: async (period = 'monthly') => {
    const response = await api.get(`/analytics/leaderboard?period=${period}`)
    return response.data
  },
}

// Upload API functions
export const uploadAPI = {
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

// Token utility functions
export const tokenUtils = {
  saveToken: (token) => localStorage.setItem('authToken', token),
  getToken: () => localStorage.getItem('authToken'),
  removeToken: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  },
  isAuthenticated: () => !!localStorage.getItem('authToken'),
}

export { api }