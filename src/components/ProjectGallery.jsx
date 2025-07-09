/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import ProjectCard from './ProjectCard'
import { ProjectCategories } from '../../constants'

const ProjectGallery = ({ projects = [], onProjectRate }) => {
  const [filteredProjects, setFilteredProjects] = useState(projects)
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    let filtered = [...projects]
    
    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(project => 
        project.projectCategories?.some(pc => pc.category.name === activeCategory)
      )
    }
    
    // Sort projects
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        break
      case 'rating':
        filtered.sort((a, b) => {
          const avgA = a.ratings?.length > 0 ? a.ratings.reduce((sum, r) => sum + r.rating, 0) / a.ratings.length : 0
          const avgB = b.ratings?.length > 0 ? b.ratings.reduce((sum, r) => sum + r.rating, 0) / b.ratings.length : 0
          return avgB - avgA
        })
        break
      default:
        break
    }
    
    setFilteredProjects(filtered)
  }, [projects, activeCategory, sortBy])

  const handleCategoryChange = (category) => {
    setActiveCategory(category)
  }

  const handleSortChange = (sort) => {
    setSortBy(sort)
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Developer Projects</h2>
        <p className="text-gray-600">Discover amazing projects built by the community</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === 'all' 
                ? 'bg-[#f84f39] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Projects
          </button>
          {ProjectCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category.name
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: activeCategory === category.name ? category.color : undefined
              }}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onRate={(rating) => onProjectRate && onProjectRate(project.id, rating)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600 mb-4">
            {activeCategory === 'all' 
              ? "Be the first to submit a project!" 
              : `No projects found in ${activeCategory} category.`
            }
          </p>
          <button className="px-6 py-3 bg-[#f84f39] text-white rounded-lg font-medium hover:bg-[#d63027] transition-colors">
            Submit Your Project
          </button>
        </div>
      )}

      {/* Project Count */}
      {filteredProjects.length > 0 && (
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Showing {filteredProjects.length} of {projects.length} projects
            {activeCategory !== 'all' && ` in ${activeCategory}`}
          </p>
        </div>
      )}
    </div>
  )
}

export default ProjectGallery 