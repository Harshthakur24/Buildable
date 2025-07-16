/* eslint-disable react/prop-types */
import { useState } from 'react'
import { ExternalLink, Github, Calendar, Users, Star } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { ProjectCategories } from '../../constants'

const ProjectCard = ({ project, onRate }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showRating, setShowRating] = useState(false)
  
  // Calculate average rating - handle both old and new data structures
  const avgRating = project.averageRating || 
    (project.ratings?.length > 0 
      ? project.ratings.reduce((sum, r) => sum + r.rating, 0) / project.ratings.length
      : 0)
    
  // Get category info
  const category = ProjectCategories.find(cat => 
    project.projectCategories?.some(pc => pc.category.name === cat.name)
  ) || ProjectCategories[0]

  const formatDate = (date) => {
    const now = new Date()
    const projectDate = new Date(date)
    const diffTime = Math.abs(now - projectDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays} days ago`
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return projectDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const handleRating = (rating) => {
    if (onRate) {
      // Ensure rating is a number
      const numericRating = Number(rating)
      console.log('Rating being sent:', numericRating, typeof numericRating)
      onRate(project.id, numericRating)
      setShowRating(false)
    }
  }


  
  return (
    <div 
      className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
      }}
    >
      {/* Project Image/Preview */}
      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {/* Project profile image */}
        {(project.profileImage || project.image) ? (
          <img 
            src={project.profileImage || project.image} 
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        
        {/* Fallback for missing/broken images */}
        <div 
          className={`absolute inset-0 flex items-center justify-center ${(project.profileImage || project.image) ? 'hidden' : 'flex'}`}
          style={{ background: `linear-gradient(135deg, ${category.color}20, ${category.color}40)` }}
        >
          <div 
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg"
            style={{ backgroundColor: category.color }}
          >
            {category.icon}
          </div>
        </div>
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-10">
          <div 
            className="px-3 py-1.5 rounded-full text-xs font-semibold text-white backdrop-blur-sm shadow-lg"
            style={{ backgroundColor: `${category.color}e6` }}
          >
            {category.icon} {category.name}
          </div>
        </div>

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 right-3 z-10">
            <div className="px-2.5 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full text-xs font-bold text-white shadow-lg">
              ⭐ Featured
            </div>
          </div>
        )}

        {/* Action buttons on hover */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-3 transition-all duration-300 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          {project.demoUrl && (
            <a 
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:bg-[#f84f39] hover:text-white transition-all duration-200 shadow-lg hover:scale-110"
              onClick={(e) => e.stopPropagation()}
              title="Live Demo"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
          {project.githubUrl && (
            <a 
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:bg-gray-900 hover:text-white transition-all duration-200 shadow-lg hover:scale-110"
              onClick={(e) => e.stopPropagation()}
              title="Source Code"
            >
              <Github className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
      
      {/* Project Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#f84f39] transition-colors line-clamp-1 mb-2">
            {project.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>
        
        {/* Tech Stack */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techStack.slice(0, 3).map((tech, index) => (
              <span 
                key={index}
                className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 3 && (
              <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs rounded-lg font-medium">
                +{project.techStack.length - 3}
              </span>
            )}
          </div>
        )}
        
        {/* Stats Row */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(project.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{project.totalRatings || project.ratings?.length || 0}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{avgRating.toFixed(1)}</span>
          </div>
        </div>
        
        {/* Author and Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {(project.author?.avatar || project.user?.avatar) ? (
              <img 
                src={project.author?.avatar || project.user?.avatar} 
                alt={project.author?.name || project.user?.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
            ) : null}
            <div 
              className={`w-8 h-8 bg-gradient-to-br from-[#f84f39] to-[#6b66da] rounded-full flex items-center justify-center ${(project.author?.avatar || project.user?.avatar) ? 'hidden' : 'flex'}`}
            >
              <span className="text-white text-xs font-bold">
                {(project.author?.name || project.user?.name)?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 line-clamp-1">
                {project.author?.name || project.user?.name || 'Anonymous'}
              </p>
            </div>
          </div>
          
          {/* Rating Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowRating(!showRating)
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-[#f84f39] hover:text-white rounded-lg transition-all duration-200 text-sm font-medium group/rate"
          >
            <Star className="w-4 h-4 group-hover/rate:fill-current" />
            <span>Rate</span>
          </button>
        </div>
              </div>
        
        {/* Simple Rating Bar */}
        {showRating && (
          <div className="absolute inset-x-0 bottom-0 bg-white border-t border-gray-200 p-4 rounded-b-2xl">
            <SimpleRatingBar onRate={handleRating} />
          </div>
        )}
      </div>
    )
  }

  // Simple Rating Bar Component
  const SimpleRatingBar = ({ onRate }) => {
    const { isAuthenticated } = useAuth()
    const [hoveredRating, setHoveredRating] = useState(0)
    
    if (!isAuthenticated) {
      return (
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-3">Sign in to rate this project</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 bg-[#f84f39] text-white rounded-lg hover:bg-[#d63027] transition-colors text-sm"
          >
            Sign In
          </button>
        </div>
      )
    }

    return (
      <div className="text-center">
        <p className="text-sm text-gray-700 mb-3">Rate this project</p>
        <div 
          className="flex items-center justify-center gap-1"
          onMouseLeave={() => setHoveredRating(0)}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoveredRating(star)}
              onClick={() => onRate(star)}
              className="p-1 hover:scale-110 transition-transform"
            >
              <Star
                className={`w-6 h-6 ${
                  star <= hoveredRating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 hover:text-yellow-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    )
  }

export default ProjectCard 