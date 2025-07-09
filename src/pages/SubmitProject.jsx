import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Github, Globe, Image, X, Plus, Send, Tags } from 'lucide-react'
import { api } from '../utils/api'

const SubmitProject = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [techStack, setTechStack] = useState([])
  const [currentTech, setCurrentTech] = useState('')
  const [images, setImages] = useState([])
  const [currentImage, setCurrentImage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f4f3fa] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#26253b] mb-4">Authentication Required</h2>
          <p className="text-[#72718a] mb-6">Please sign in to submit a project.</p>
          <Link 
            to="/login"
            className="bg-[#f84f39] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#d63027] transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  const addTech = () => {
    if (currentTech.trim() && !techStack.includes(currentTech.trim())) {
      setTechStack([...techStack, currentTech.trim()])
      setCurrentTech('')
    }
  }

  const removeTech = (tech) => {
    setTechStack(techStack.filter(t => t !== tech))
  }

  const addImage = () => {
    if (currentImage.trim() && !images.includes(currentImage.trim())) {
      setImages([...images, currentImage.trim()])
      setCurrentImage('')
    }
  }

  const removeImage = (image) => {
    setImages(images.filter(img => img !== image))
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      setMessage('')
      
      const projectData = {
        ...data,
        techStack,
        images
      }
      
      const response = await api.post('/projects', projectData)
      
      if (response.data.success) {
        setMessage('Project submitted successfully!')
        reset()
        setTechStack([])
        setImages([])
        setTimeout(() => {
          navigate('/')
        }, 2000)
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to submit project')
      setTimeout(() => setMessage(''), 5000)
    } finally {
      setLoading(false)
    }
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
              Submit Your Project
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#72718a] text-lg"
            >
              Share your amazing work with the Buildable community
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

              {/* Images */}
              <div>
                <h3 className="text-xl font-bold text-[#26253b] mb-4">Project Images</h3>
                
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={currentImage}
                      onChange={(e) => setCurrentImage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                      placeholder="Add image URL"
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:border-transparent transition-all text-[#26253b]"
                    />
                    <button
                      type="button"
                      onClick={addImage}
                      className="px-4 py-3 bg-[#f84f39] text-white rounded-xl hover:bg-[#d63027] transition-colors flex items-center gap-2"
                    >
                      <Image className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                  
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={image} 
                            alt={`Project image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4='
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(image)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
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
                disabled={loading}
                className="w-full bg-[#f84f39] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-[#d63027] focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Project
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