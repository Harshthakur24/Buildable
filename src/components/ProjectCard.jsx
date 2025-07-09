/* eslint-disable react/prop-types */
import { useState } from 'react'
import StarRating from './StarRating'
import { ProjectCategories } from '../../constants'

const ProjectCard = ({ project, onRate }) => {
  const [isHovered, setIsHovered] = useState(false)
  
  // Calculate average rating
  const avgRating = project.ratings?.length > 0 
    ? project.ratings.reduce((sum, r) => sum + r.rating, 0) / project.ratings.length
    : 0
    
  // Get category info
  const category = ProjectCategories.find(cat => 
    project.projectCategories?.some(pc => pc.category.name === cat.name)
  ) || ProjectCategories[0]
  
  return (
    <div 
      className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Project Image/Preview */}
      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {project.image ? (
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
              style={{ backgroundColor: category.color }}
            >
              {category.icon}
            </div>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <div 
            className="px-3 py-1 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: category.color }}
          >
            {category.icon} {category.name}
          </div>
        </div>
        
        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 right-3">
            <div className="px-2 py-1 bg-yellow-400 rounded-full text-xs font-bold text-yellow-900">
              ⭐ Featured
            </div>
          </div>
        )}
      </div>
      
      {/* Project Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#f84f39] transition-colors line-clamp-1">
            {project.title}
          </h3>
          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <a 
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            )}
            {project.demoUrl && (
              <a 
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#f84f39] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
        
        {/* Tech Stack */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
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
                +{project.techStack.length - 3} more
              </span>
            )}
          </div>
        )}
        
        {/* Author and Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#f84f39] to-[#6b66da] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {project.user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{project.user?.name || 'Anonymous'}</p>
              <p className="text-xs text-gray-500">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <StarRating rating={avgRating} readonly size="sm" />
            <span className="text-xs text-gray-500 mt-1">
              {project.ratings?.length || 0} rating{project.ratings?.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
      
      {/* Hover Actions */}
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-white rounded-lg shadow-lg p-4 m-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <StarRating 
              rating={0}
              onRatingChange={onRate}
              size="lg"
            />
            <p className="text-sm text-gray-600 text-center mt-2">Rate this project</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectCard 