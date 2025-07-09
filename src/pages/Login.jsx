import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  })

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
    // Clear form fields on mount (unless filled by password manager)
    setTimeout(() => {
      reset({
        email: '',
        password: ''
      })
    }, 100)
  }, [reset])

  const onSubmit = async (data) => {
    try {
      const result = await login(data)
      if (result.success) {
        navigate('/')
      }
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f3fa] flex flex-col">
      {/* Header */}
      <div className="p-[3px] bg-[#f84f39]"></div>
      <nav className="flex px-[40px] pt-[30px] pb-[25px] w-full items-center justify-between bg-[#f4f3fa]">
        <Link to="/" className="flex items-center gap-[20px]">
          <div className="w-[25px] h-[25px] bg-[#f84f39] rounded-lg flex items-center justify-center text-white font-bold text-sm">B</div>
          <div className="text-xl font-bold text-[#26253b]">Buildable</div>
        </Link>
        <Link 
          to="/" 
          className="flex items-center gap-2 text-[#72718a] hover:text-[#f84f39] transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-bold text-[#26253b] mb-4"
            >
              Welcome Back
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#72718a] text-lg"
            >
              Continue building amazing projects
            </motion.p>
          </div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#26253b] mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Please enter a valid email address',
                    },
                  })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:border-transparent transition-all text-[#26253b]"
                  placeholder="your@email.com"
                />
                {errors.email && <p className="mt-2 text-sm text-[#f84f39]">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-[#26253b] mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    {...register('password', {
                      required: 'Password is required',
                    })}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:border-transparent transition-all text-[#26253b]"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#72718a] hover:text-[#f84f39] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-2 text-sm text-[#f84f39]">{errors.password.message}</p>}
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-[#72718a] hover:text-[#f84f39] transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-[#f84f39] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-[#d63027] focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </motion.button>

              {/* Signup Link */}
              <div className="text-center pt-4">
                <p className="text-[#72718a]">
                  Don&apos;t have an account?{' '}
                  <Link
                    to="/signup"
                    className="text-[#f84f39] hover:text-[#d63027] font-semibold transition-colors"
                  >
                    Create Account
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>

          {/* Features Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-center"
          >
            <div className="flex items-center justify-center space-x-8">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-[#f84f39] rounded-full flex items-center justify-center mb-2">
                  <span className="text-white font-bold">🚀</span>
                </div>
                <p className="text-xs text-[#72718a] font-medium">Showcase Projects</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-[#6b66da] rounded-full flex items-center justify-center mb-2">
                  <span className="text-white font-bold">⭐</span>
                </div>
                <p className="text-xs text-[#72718a] font-medium">Get Rated</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-[#2a966f] rounded-full flex items-center justify-center mb-2">
                  <span className="text-white font-bold">🤝</span>
                </div>
                <p className="text-xs text-[#72718a] font-medium">Join Community</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login 