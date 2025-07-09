import { motion, useScroll, useTransform } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ProjectCategories } from '../../constants'

const ProjectSubmission = () => {
  const [hover, setHover] = useState("rgb(248,79,57)")
  const [signupHover, setSignupHover] = useState("rgb(248,79,57)")
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    demoUrl: '',
    githubUrl: '',
    techStack: [],
    categories: [],
    image: ''
  })
  
  const { scrollYProgress } = useScroll()
  const scale = useTransform(scrollYProgress, [0.93, 0.98], [1, 0.75])
  const borderRadius = useTransform(scrollYProgress, [0.92, 0.97], ["120px", "450px"])

  const colors = [
    "rgb(248,79,57)",  // Red
    "rgb(34,129,217)", // Blue
    "rgb(42,150,111)", // Green
    "rgb(107,102,218)" // Purple
  ]
  
  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const handleMouseEnter = () => {
    setHover(getRandomColor())
  }

  const handleSignupMouseEnter = () => {
    setSignupHover(getRandomColor())
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleTechStackChange = (e) => {
    const techList = e.target.value.split(',').map(tech => tech.trim()).filter(tech => tech)
    setFormData(prev => ({
      ...prev,
      techStack: techList
    }))
  }

  const handleCategoryToggle = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    
    console.log('Project submitted by:', user?.name)
    console.log('Project data:', formData)
    // TODO: Implement actual submission logic with API
  }

  return (
    <>
      {/* Project Submission Form - No scroll scaling */}
      
      <div>
      <div className='bg-[#20202e] flex flex-col pb-[10vh] pt-[50px] min-h-screen w-[100%] items-center justify-start'>
        <div 
          style={{
            backgroundColor: hover,
          }}
          onMouseEnter={handleMouseEnter}
          className='max-h-none min-h-[80vh] w-full max-w-4xl mx-4 flex flex-col justify-start items-center text-center text-[#f8f8f8] font-semibold rounded-[40px]'
        >
          <div className="w-full p-12">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl lg:text-6xl font-bold mb-4">Submit Your Project</h1>
              <p className="text-lg lg:text-xl opacity-90">Share your work with the developer community</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
              {/* Project Title */}
              <div className="text-left">
                <label className="block text-sm font-medium mb-2">Project Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="My Awesome Project"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                />
              </div>

              {/* Description */}
              <div className="text-left">
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe what your project does, the problem it solves, and what makes it special..."
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-left">
                  <label className="block text-sm font-medium mb-2">Demo URL</label>
                  <input
                    type="url"
                    name="demoUrl"
                    value={formData.demoUrl}
                    onChange={handleInputChange}
                    placeholder="https://myproject.com"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                  />
                </div>
                <div className="text-left">
                  <label className="block text-sm font-medium mb-2">GitHub URL</label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    placeholder="https://github.com/username/repo"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Tech Stack */}
              <div className="text-left">
                <label className="block text-sm font-medium mb-2">Tech Stack</label>
                <input
                  type="text"
                  onChange={handleTechStackChange}
                  placeholder="React, Node.js, MongoDB, TypeScript (comma separated)"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                />
                {formData.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.techStack.map((tech, index) => (
                      <span key={index} className="px-2 py-1 bg-white/20 rounded-md text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Categories */}
              <div className="text-left">
                <label className="block text-sm font-medium mb-3">Categories</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {ProjectCategories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleCategoryToggle(category.id)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        formData.categories.includes(category.id)
                          ? 'bg-white/20 border-white/40 text-white'
                          : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-lg mb-1">{category.icon}</div>
                      <div className="text-xs">{category.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Project Image */}
              <div className="text-left">
                <label className="block text-sm font-medium mb-2">Project Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/project-screenshot.png"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full py-4 bg-white text-gray-900 rounded-lg font-bold text-lg hover:bg-white/90 transition-all transform hover:scale-105 active:scale-95"
                >
                  🚀 Submit Project
                </button>
              </div>
            </form>

            {/* Guidelines */}
            <div className="mt-8 text-center text-sm opacity-75">
              <p>By submitting, you agree to our community guidelines.</p>
              <p>Projects are reviewed before being published to ensure quality.</p>
            </div>
          </div>
        </div>
      </div>
      </div>
      

      {/* Sign Up Section - With scroll scaling like original */}
      <div className='bg-[#20202e] pr-6 pl-6 flex flex-col pb-[15vh] pt-[20vh] min-h-auto w-[100%] items-center justify-start'>
        <motion.div 
          style={{
            scale: scale,
            borderRadius: borderRadius,
            backgroundColor: signupHover,
          }}
          onMouseEnter={handleSignupMouseEnter}
          onClick={() => !isAuthenticated && navigate('/signup')}
          className='max-h-[600px] gg:min-h-[80vh] mm:min-h-[70vh] ss:min-h-[300px] mm:w-[100%] ss:w-[300px] flex flex-col justify-center items-center leading-[55px] gg:text-[70px] ll:text-[50px] mm:text-[55px] text-center text-[#f8f8f8] font-semibold cursor-pointer'
        >
          <div>{isAuthenticated ? `Welcome back, ${user?.name}!` : 'Sign up for free'}</div>
        </motion.div>
      </div>
    </>
  )
}

export default ProjectSubmission 