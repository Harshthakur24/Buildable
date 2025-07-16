import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Github, Globe, Upload, X, Plus, Send, Tags, Loader } from 'lucide-react'
import { api } from '../utils/api'
import { uploadToCloudinary } from '../utils/cloudinary'
import { projectsAPI } from '../utils/api'
import toast from 'react-hot-toast'

const SubmitProject = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editProjectId = searchParams.get('edit')
  const isEditMode = !!editProjectId
  
  const [loading, setLoading] = useState(false)
  const [loadingProject, setLoadingProject] = useState(isEditMode)
  const [message, setMessage] = useState('')
  const [techStack, setTechStack] = useState([])
  const [currentTech, setCurrentTech] = useState('')
  const [projectImage, setProjectImage] = useState('') // Changed from images array to single image
  const [uploadingImage, setUploadingImage] = useState(null) // Changed from array to single object

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm()

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/login')
  }

  // Fetch project data for editing
  useEffect(() => {
    const fetchProject = async () => {
      if (!isEditMode || !editProjectId) {
        setLoadingProject(false)
        return
      }

      try {
        setLoadingProject(true)
        const response = await projectsAPI.getProject(editProjectId)
        const project = response.data

        // Pre-fill form fields
        setValue('title', project.title || '')
        setValue('description', project.description || '')
        setValue('githubUrl', project.githubUrl || '')
        setValue('demoUrl', project.demoUrl || '')
        setValue('category', project.category || '')
        
        // Pre-fill tech stack
        setTechStack(project.techStack || [])
        
        // Pre-fill project image (use profileImage from backend)
        if (project.profileImage) {
          setProjectImage(project.profileImage)
        } else if (project.images && Array.isArray(project.images) && project.images.length > 0) {
          setProjectImage(project.images[0])
        } else if (project.image) {
          setProjectImage(project.image)
        }

      } catch (error) {
        console.error('Failed to fetch project:', error)
        toast.error('Failed to load project data')
        navigate('/profile')
      } finally {
        setLoadingProject(false)
      }
    }

    fetchProject()
  }, [isEditMode, editProjectId, setValue, navigate])

  const addTech = () => {
    if (currentTech.trim() && !techStack.includes(currentTech.trim())) {
      setTechStack([...techStack, currentTech.trim()])
      setCurrentTech('')
    }
  }

  const removeTech = (tech) => {
    setTechStack(techStack.filter(t => t !== tech))
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // If there's already an image, replace it
    if (projectImage) {
      setProjectImage('')
    }

    // Validate file type and size
    const isValidType = file.type.startsWith('image/')
    const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit

    if (!isValidType) {
      toast.error(`${file.name} is not a valid image file`)
      return
    }
    if (!isValidSize) {
      toast.error(`${file.name} is too large. Maximum size is 10MB`)
      return
    }

    // Create upload object
    const uploadObj = {
      id: Date.now(),
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'uploading'
    }

    setUploadingImage(uploadObj)

    try {
      const response = await uploadToCloudinary(file, (progress) => {
        setUploadingImage(prev => prev ? { ...prev, progress } : null)
      })

      // Update to completed
      setUploadingImage(prev => prev ? { ...prev, progress: 100, status: 'completed', url: response.url } : null)

      // Set the project image
      setProjectImage(response.url)
      toast.success(`${file.name} uploaded successfully!`)

      // Remove from uploading after a delay
      setTimeout(() => {
        setUploadingImage(null)
        URL.revokeObjectURL(uploadObj.preview)
      }, 1000)

    } catch (error) {
      console.error('Cloudinary upload failed:', error)
      
      setUploadingImage(prev => prev ? { ...prev, status: 'error', progress: 0 } : null)
      toast.error(`Failed to upload ${file.name}`)

      // Remove failed upload after delay
      setTimeout(() => {
        setUploadingImage(null)
        URL.revokeObjectURL(uploadObj.preview)
      }, 3000)
    }

    // Clear the input
    event.target.value = ''
  }

  const removeImage = () => {
    setProjectImage('')
  }

  const removeUploadingImage = () => {
    if (uploadingImage) {
      URL.revokeObjectURL(uploadingImage.preview)
      setUploadingImage(null)
    }
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      setMessage('')
      
      const projectData = {
        ...data,
        techStack,
        profileImage: projectImage // Send as profileImage to match backend schema
      }

      let response
      if (isEditMode) {
        response = await projectsAPI.updateProject(editProjectId, projectData)
        toast.success('Project updated successfully!')
      } else {
        response = await api.post('/projects', projectData)
        toast.success('Project submitted successfully!')
      }
      
      if (response.data.success) {
        setMessage(`Project ${isEditMode ? 'updated' : 'submitted'} successfully! Redirecting...`)
        setTimeout(() => {
          navigate('/profile')
        }, 2000)
        
        if (!isEditMode) {
          reset()
          setTechStack([])
          setProjectImage('')
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || `Failed to ${isEditMode ? 'update' : 'submit'} project`
      setMessage(errorMessage)
      toast.error(errorMessage)
      setTimeout(() => setMessage(''), 5000)
    } finally {
      setLoading(false)
    }
  }

  // Show loading spinner while fetching project data
  if (loadingProject) {
    return (
      <div className="min-h-screen bg-[#f4f3fa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#f84f39] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#72718a]">Loading project data...</p>
        </div>
      </div>
    )
  }

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
          to="/profile" 
          className="flex items-center gap-2 text-[#72718a] hover:text-[#f84f39] transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
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
              {isEditMode ? 'Edit Your Project' : 'Submit Your Project'}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#72718a] text-lg"
            >
              {isEditMode 
                ? 'Update your project information and showcase your latest work'
                : 'Share your amazing work with the Buildable community'
              }
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Project Information */}
              <div>
                <h3 className="text-xl font-bold text-[#26253b] mb-6">Project Details</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#26253b] mb-2">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      {...register('title', {
                        required: 'Project title is required',
                        minLength: { value: 3, message: 'Title must be at least 3 characters' }
                      })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:border-transparent transition-all text-[#26253b]"
                      placeholder="Enter your project title"
                    />
                    {errors.title && <p className="mt-2 text-sm text-[#f84f39]">{errors.title.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#26253b] mb-2">
                      Description *
                    </label>
                    <textarea
                      {...register('description', {
                        required: 'Project description is required',
                        minLength: { value: 20, message: 'Description must be at least 20 characters' }
                      })}
                      rows={5}
                      placeholder="Describe your project, what it does, and what makes it special..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:border-transparent transition-all text-[#26253b] resize-none"
                    />
                    {errors.description && <p className="mt-2 text-sm text-[#f84f39]">{errors.description.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#26253b] mb-2">
                        Category *
                      </label>
                      <select
                        {...register('category', { required: 'Please select a category' })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:border-transparent transition-all text-[#26253b]"
                      >
                        <option value="">Select category</option>
                        <option value="web-app">Web Application</option>
                        <option value="mobile-app">Mobile Application</option>
                        <option value="desktop-app">Desktop Application</option>
                        <option value="library">Library/Framework</option>
                        <option value="tool">Developer Tool</option>
                        <option value="game">Game</option>
                        <option value="ai-ml">AI/Machine Learning</option>
                        <option value="blockchain">Blockchain</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.category && <p className="mt-2 text-sm text-[#f84f39]">{errors.category.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#26253b] mb-2">
                        Status
                      </label>
                      <select
                        {...register('status')}
                        defaultValue="completed"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:border-transparent transition-all text-[#26253b]"
                      >
                        <option value="completed">Completed</option>
                        <option value="in-progress">In Progress</option>
                        <option value="prototype">Prototype</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <h3 className="text-xl font-bold text-[#26253b] mb-4">Technology Stack</h3>
                
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentTech}
                      onChange={(e) => setCurrentTech(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                      placeholder="Add technology (e.g., React, Node.js, Python)"
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:border-transparent transition-all text-[#26253b]"
                    />
                    <button
                      type="button"
                      onClick={addTech}
                      className="px-4 py-3 bg-[#f84f39] text-white rounded-xl hover:bg-[#d63027] transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                  
                  {techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {techStack.map((tech, index) => (
                        <div key={index} className="flex items-center gap-2 bg-[#f84f39] text-white px-3 py-1 rounded-full text-sm">
                          <Tags className="w-3 h-3" />
                          {tech}
                          <button
                            type="button"
                            onClick={() => removeTech(tech)}
                            className="hover:bg-white hover:text-[#f84f39] rounded-full p-1 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Links */}
              <div>
                <h3 className="text-xl font-bold text-[#26253b] mb-6">Project Links</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <Github className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#72718a]" />
                    <input
                      type="url"
                      {...register('githubUrl')}
                      placeholder="GitHub repository URL"
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:border-transparent transition-all text-[#26253b]"
                    />
                  </div>
                  
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#72718a]" />
                    <input
                      type="url"
                      {...register('demoUrl')}
                      placeholder="Live demo URL"
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:border-transparent transition-all text-[#26253b]"
                    />
                  </div>
                </div>
              </div>

              {/* Project Image */}
              <div>
                <h3 className="text-xl font-bold text-[#26253b] mb-4">Project Image</h3>
                
                <div className="space-y-4">
                  {/* File Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#f84f39] transition-colors">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center gap-4"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-700 mb-1">
                          Choose an image or drag and drop
                        </p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG, GIF up to 10MB (uploaded to Cloudinary)
                        </p>
                      </div>
                      
                    </label>
                  </div>

                  {/* Uploading Image */}
                  {uploadingImage && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-700">Uploading...</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <img
                            src={uploadingImage.preview}
                            alt="Upload preview"
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-700 truncate">
                              {uploadingImage.file.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    uploadingImage.status === 'error' 
                                      ? 'bg-red-500' 
                                      : uploadingImage.status === 'completed'
                                      ? 'bg-green-500'
                                      : 'bg-[#f84f39]'
                                  }`}
                                  style={{ width: `${uploadingImage.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500">
                                {uploadingImage.status === 'error' 
                                  ? 'Failed' 
                                  : uploadingImage.status === 'completed'
                                  ? 'Done'
                                  : `${uploadingImage.progress}%`
                                }
                              </span>
                            </div>
                          </div>
                          {uploadingImage.status === 'uploading' && (
                            <Loader className="w-4 h-4 text-[#f84f39] animate-spin" />
                          )}
                          <button
                            type="button"
                            onClick={removeUploadingImage}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Project Image Preview */}
                  {projectImage && (
                    <div className="relative group w-80">
                      <img 
                        src={projectImage} 
                        alt="Project profile image"
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4='
                        }}
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
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
                disabled={loading || uploadingImage}
                className="w-full bg-[#f84f39] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-[#d63027] focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isEditMode ? 'Updating...' : 'Submitting...'}
                  </>
                ) : uploadingImage ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Uploading Image...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {isEditMode ? 'Update Project' : 'Submit Project'}
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default SubmitProject 