import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { ArrowLeft, Github, Twitter, Globe, Camera, Save, Pencil, Trash2, Star, Rocket, Plus } from 'lucide-react'
import { api } from '../utils/api'
import { uploadToCloudinary } from '../utils/cloudinary'
import { projectsAPI } from '../utils/api'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [userProjects, setUserProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [initialValues, setInitialValues] = useState({}) // Track initial form values

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm()

  useEffect(() => {
    if (user) {
      const initialData = {
        name: user.name || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
        github: user.github || '',
        website: user.website || '',
        twitter: user.twitter || ''
      }
      
      // Set form values
      Object.keys(initialData).forEach(key => {
        setValue(key, initialData[key])
      })
      
      // Store initial values for comparison
      setInitialValues(initialData)
    }
  }, [user, setValue])

  // Fetch user's projects
  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        setProjectsLoading(true)
        const response = await projectsAPI.getProjects({ userId: user?.id })
        setUserProjects(response.data || [])
      } catch (err) {
        console.error('Failed to fetch user projects:', err)
        toast.error('Failed to load your projects')
      } finally {
        setProjectsLoading(false)
      }
    }

    if (user?.id) {
      fetchUserProjects()
    }
  }, [user?.id])

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      setMessage('')
      
      // First, sanitize all form data to ensure no null/undefined values
      const sanitizedData = {}
      Object.keys(data).forEach(key => {
        const value = data[key]
        sanitizedData[key] = (value === null || value === undefined || value === '') ? '' : String(value).trim()
      })
      
      // Only send fields that have changed (comparing sanitized values)
      const changedFields = {}
      Object.keys(sanitizedData).forEach(key => {
        const currentValue = sanitizedData[key]
        const initialValue = initialValues[key] || ''
        if (currentValue !== initialValue) {
          changedFields[key] = currentValue
        }
      })

      
      // If no fields changed, don't make API call
      if (Object.keys(changedFields).length === 0) {
        setMessage('No changes to save')
        setTimeout(() => setMessage(''), 3000)
        return
      }
      
      const response = await api.put('/auth/profile', changedFields)
      
      if (response.data.success) {
        updateUser(response.data.data)
        // Update initial values with new data
        setInitialValues(prev => ({ ...prev, ...changedFields }))
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

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
      setUploadingImage(true)
      setUploadProgress(0)

      const result = await uploadToCloudinary(file, (progress) => {
        setUploadProgress(progress)
      })

      setValue('avatar', result.url)
      
      // Only send the avatar field that changed
      const response = await api.put('/auth/profile', { avatar: result.url })
      
      if (response.data.success) {
        updateUser(response.data.data)
        // Update initial values
        setInitialValues(prev => ({ ...prev, avatar: result.url }))
        toast.success('Profile picture updated successfully!')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploadingImage(false)
      setUploadProgress(0)
    }
  }

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return

    try {
      await projectsAPI.deleteProject(projectId)
      setUserProjects(projects => projects.filter(p => p.id !== projectId))
      toast.success('Project deleted successfully')
    } catch (error) {
      console.error('Failed to delete project:', error)
      toast.error('Failed to delete project')
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
                    <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                      {uploadingImage ? (
                        <div className="w-8 h-8 flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-[#f84f39] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : (
                        <Camera className="w-4 h-4 text-[#72718a]" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                  
                  {uploadingImage && (
                    <div className="w-full mt-2">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#f84f39] transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-center text-[#72718a] mt-1">
                        Uploading... {uploadProgress.toFixed(0)}%
                      </p>
                    </div>
                  )}
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

          {/* My Projects Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-[#26253b]">My Projects</h2>
              <Link
                to="/submit-project"
                className="flex items-center bg-[#f84f39] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#d63027] transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" /> Submit New Project
              </Link>
            </div>

            {projectsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-5">
                      <div className="h-6 bg-gray-200 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : userProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                    whileHover={{ y: -5 }}
                  >
                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                      {(project.profileImage || project.image) ? (
                        <img 
                          src={project.profileImage || project.image} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-4xl">🚀</div>
                        </div>
                      )}
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Link
                          to={`/submit-project?edit=${project.id}`}
                          className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors"
                        >
                          <Pencil className="w-4 h-4 text-[#f84f39]" />
                        </Link>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                                           <div className="p-6">
                         <h3 className="text-xl font-bold text-[#26253b] mb-2">{project.title}</h3>
                         <p className="text-[#72718a] text-sm mb-4 line-clamp-2">{project.description}</p>
                         
                         {/* Tech Stack */}
                         {project.techStack && project.techStack.length > 0 && (
                           <div className="flex flex-wrap gap-1 mb-3">
                             {project.techStack.slice(0, 3).map((tech, index) => (
                               <span 
                                 key={index}
                                 className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium"
                               >
                                 {tech}
                               </span>
                             ))}
                             {project.techStack.length > 3 && (
                               <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                                 +{project.techStack.length - 3}
                               </span>
                             )}
                           </div>
                         )}
                         
                         <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2">
                             <div className="flex items-center">
                               <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                               <span className="ml-1 font-semibold">{project.averageRating?.toFixed(1) || '0.0'}</span>
                             </div>
                             <span className="text-sm text-[#72718a]">({project.totalRatings || 0} ratings)</span>
                           </div>
                           <Link
                             to={`/projects/${project.id}`}
                             className="text-[#f84f39] text-sm font-medium hover:underline"
                           >
                             View Details →
                           </Link>
                         </div>
                       </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Rocket className="w-8 h-8 text-[#72718a]" />
                </div>
                <h3 className="text-xl font-semibold text-[#26253b] mb-2">No Projects Yet</h3>
                <p className="text-[#72718a] mb-6">Share your amazing work with the community</p>
                <Link
                  to="/submit-project"
                  className="bg-[#f84f39] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#d63027] transition-colors"
                >
                  Submit Your First Project
                </Link>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile 