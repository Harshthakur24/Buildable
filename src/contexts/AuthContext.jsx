import { createContext, useContext, useReducer, useEffect } from 'react'
import { authAPI, tokenUtils } from '../utils/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

// Auth reducer for managing state
const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload, loading: false }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, loading: false }
    default:
      return state
  }
}

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
}

/* eslint-disable react/prop-types */
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = tokenUtils.getToken()
      if (token) {
        try {
          const userData = await authAPI.getMe()
          dispatch({ type: 'SET_USER', payload: userData.data })
          localStorage.setItem('user', JSON.stringify(userData.data))
        } catch (error) {
          console.error('Auth initialization failed:', error)
          
          // If it's a 401 error (token expired/invalid), silently clear tokens
          if (error.response?.status === 401) {
            console.log('Token expired or invalid, clearing stored credentials')
            tokenUtils.removeToken()
            localStorage.removeItem('user')
          }
          
          // Set user as null (not authenticated)
          dispatch({ type: 'SET_USER', payload: null })
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    initializeAuth()
  }, [])

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })

      const response = await authAPI.login(credentials)
      const { data: user, token } = response

      tokenUtils.saveToken(token)
      localStorage.setItem('user', JSON.stringify(user))
      dispatch({ type: 'SET_USER', payload: user })

      toast.success('Welcome back! 🎉')
      return { success: true, user }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })

      const response = await authAPI.register(userData)
      const { data: user, token } = response

      tokenUtils.saveToken(token)
      localStorage.setItem('user', JSON.stringify(user))
      dispatch({ type: 'SET_USER', payload: user })

      toast.success('Welcome to Buildable! 🚀')
      return { success: true, user }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Logout function
  const logout = () => {
    tokenUtils.removeToken()
    localStorage.removeItem('user')
    dispatch({ type: 'LOGOUT' })
    toast.success('Logged out successfully')
  }

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await authAPI.updateProfile(profileData)
      const updatedUser = response.data

      localStorage.setItem('user', JSON.stringify(updatedUser))
      dispatch({ type: 'SET_USER', payload: updatedUser })

      toast.success('Profile updated successfully')
      return { success: true, user: updatedUser }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Profile update failed'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Change password function
  const changePassword = async (passwordData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      await authAPI.changePassword(passwordData)

      toast.success('Password changed successfully')
      dispatch({ type: 'SET_LOADING', payload: false })
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Password change failed'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const value = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    updateProfile,
    updateUser: updateProfile, // Alias for updateProfile
    changePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext 