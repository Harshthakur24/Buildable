import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { ArrowLeft, Github, Twitter, Globe, Camera, Save } from 'lucide-react'
import { api } from '../utils/api'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm()

  useEffect(() => {
    if (user) {
      setValue('name', user.name || '')
      setValue('bio', user.bio || '')
      setValue('avatar', user.avatar || '')
      setValue('github', user.github || '')
      setValue('website', user.website || '')
      setValue('twitter', user.twitter || '')
    }
  }, [user, setValue])

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      setMessage('')
      
      const response = await api.put('/auth/profile', data)
      
      if (response.data.success) {
        updateUser(response.data.data)
        setMessage('Profile updated successfully!')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to update profile')
      setTimeout(() => setMessage(''), 5000)
    } finally {
      setLoading(false)
    }
  }

  const avatarUrl = watch('avatar')

  return (
    <div className="min-h-screen bg-[#f4f3fa] flex flex-col">
      {/* Header */}
      <div className="p-[8px] bg-[#f84f39]"></div>
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
      <div className="flex-1 flex items-start justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl"
        >
          <div className="text-center mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-bold text-[#26253b] mb-4"
            >
              My Profile
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#72718a] text-lg"
            >
              Manage your account information and preferences
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-[#26253b] mb-4">Profile Picture</h3>
                
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    {avatarUrl ? (
                      <img 
                        src={avatarUrl}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-[#f84f39]"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-32 h-32 bg-gradient-to-br from-[#f84f39] to-[#6b66da] rounded-full flex items-center justify-center ${avatarUrl ? 'hidden' : 'flex'}`}
                    >
                      <span className="text-white text-4xl font-bold">
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200">
                      <Camera className="w-4 h-4 text-[#72718a]" />
                    </div>
                  </div>
                  
                  <input
                    type="url"
                    {...register('avatar')}
                    placeholder="Enter image URL"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:border-transparent text-center text-sm"
                  />
                  <p className="text-xs text-[#72718a] mt-2 text-center">
                    Enter a URL to your profile picture
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Profile Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-xl font-bold text-[#26253b] mb-4">Basic Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#26253b] mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          {...register('name', {
                            required: 'Name is required',
                            minLength: { value: 2, message: 'Name must be at least 2 characters' }
                          })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:border-transparent transition-all text-[#26253b]"
                        />
                        {errors.name && <p className="mt-2 text-sm text-[#f84f39]">{errors.name.message}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-[#26253b] mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-[#72718a] cursor-not-allowed"
                        />
                        <p className="mt-1 text-xs text-[#72718a]">Email cannot be changed</p>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-semibold text-[#26253b] mb-2">
                      Bio
                    </label>
                    <textarea
                      {...register('bio')}
                      rows={4}
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:border-transparent transition-all text-[#26253b] resize-none"
                    />
                  </div>

                  {/* Social Profiles */}
                  <div>
                    <h3 className="text-xl font-bold text-[#26253b] mb-4">Social Profiles</h3>
                    
                    <div className="space-y-4">
                      <div className="relative">
                        <Github className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#72718a]" />
                        <input
                          type="text"
                          {...register('github')}
                          placeholder="GitHub username"
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:border-transparent transition-all text-[#26253b]"
                        />
                      </div>
                      
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#72718a]" />
                        <input
                          type="url"
                          {...register('website')}
                          placeholder="Your website URL"
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:border-transparent transition-all text-[#26253b]"
                        />
                      </div>
                      
                      <div className="relative">
                        <Twitter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#72718a]" />
                        <input
                          type="text"
                          {...register('twitter')}
                          placeholder="Twitter username"
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:border-transparent transition-all text-[#26253b]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg ${
                        message.includes('success') 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {message}
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#f84f39] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-[#d63027] focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Update Profile
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile 