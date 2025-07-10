import { createContext, useContext, useReducer, useEffect } from 'react'
import { authAPI, tokenUtils } from '../utils/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

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

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
}

/* eslint-disable react/prop-types */
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

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
          
          if (error.response?.status === 401) {
            console.log('Token expired or invalid, clearing stored credentials')
            tokenUtils.removeToken()
            localStorage.removeItem('user')
          }
          
          dispatch({ type: 'SET_USER', payload: null })
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    initializeAuth()
  }, [])

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

  const logout = () => {
    tokenUtils.removeToken()
    localStorage.removeItem('user')
    dispatch({ type: 'LOGOUT' })
    toast.success('Logged out successfully')
  }

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
    ...state,
    login,
    register,
    logout,
    updateProfile,
    updateUser: updateProfile,
    changePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext 