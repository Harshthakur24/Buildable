import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, Github, Twitter, Globe, ArrowLeft } from 'lucide-react'

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register: registerUser, loading } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      github: '',
      website: '',
      twitter: ''
    }
  })

  const password = watch('password')

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
    // Clear form fields on mount (unless filled by password manager)
    setTimeout(() => {
      reset({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        github: '',
        website: '',
        twitter: ''
      })
    }, 100)
  }, [reset])

  const onSubmit = async (data) => {
    try {
      const result = await registerUser(data)
      if (result.success) {
        navigate('/')
      }
    } catch (error) {
      console.error('Signup error:', error)
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
              Join Buildable
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#72718a] text-lg"
            >
              Start showcasing your projects to the world
            </motion.p>
          </div>

          {/* Signup Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-[#26253b] mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:border-transparent transition-all text-[#26253b]"
                  placeholder="Your full name"
                />
                {errors.name && <p className="mt-2 text-sm text-[#f84f39]">{errors.name.message}</p>}
              </div>

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
                    autoComplete="new-password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    })}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:border-transparent transition-all text-[#26253b]"
                    placeholder="Create a strong password"
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

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#26253b] mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) => value === password || 'Passwords do not match',
                    })}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:border-transparent transition-all text-[#26253b]"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#72718a] hover:text-[#f84f39] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-2 text-sm text-[#f84f39]">{errors.confirmPassword.message}</p>}
              </div>

              {/* Optional Social Links */}
              <div className="border-t border-gray-100 pt-6">
                <p className="text-sm font-semibold text-[#26253b] mb-4">Optional: Connect your profiles</p>
                
                <div className="space-y-4">
                  <div className="relative">
                    <Github className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#72718a]" />
                    <input
                      type="text"
                      autoComplete="off"
                      {...register('github')}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:border-transparent transition-all text-[#26253b]"
                      placeholder="GitHub username"
                    />
                  </div>
                  
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#72718a]" />
                    <input
                      type="url"
                      autoComplete="off"
                      {...register('website')}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:border-transparent transition-all text-[#26253b]"
                      placeholder="Your website URL"
                    />
                  </div>
                  
                  <div className="relative">
                    <Twitter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#72718a]" />
                    <input
                      type="text"
                      autoComplete="off"
                      {...register('twitter')}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:border-transparent transition-all text-[#26253b]"
                      placeholder="Twitter username"
                    />
                  </div>
                </div>
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
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </motion.button>

              {/* Login Link */}
              <div className="text-center pt-4">
                <p className="text-[#72718a]">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-[#f84f39] hover:text-[#d63027] font-semibold transition-colors"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default SignUp 