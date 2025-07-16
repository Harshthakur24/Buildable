/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProjectCard from './ProjectCard'
import { ProjectCategories } from '../../constants'

const ProjectGallery = ({ projects = [], onProjectRate, loading = false, error = null }) => {
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

  // Loading skeleton component
  const ProjectSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-5">
        <div className="h-6 bg-gray-200 rounded mb-3"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="flex gap-1 mb-4">
          <div className="h-6 bg-gray-200 rounded-md w-16"></div>
          <div className="h-6 bg-gray-200 rounded-md w-20"></div>
          <div className="h-6 bg-gray-200 rounded-md w-14"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
     

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load projects</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#f84f39] text-white rounded-lg font-medium hover:bg-[#d63027] transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <>
          {/* Skeleton Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              <div className="h-10 bg-gray-200 rounded-full w-24 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-full w-20 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-full w-28 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-full w-24 animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded-md w-32 ml-auto animate-pulse"></div>
          </div>
          
          {/* Skeleton Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, index) => (
              <ProjectSkeleton key={index} />
            ))}
          </div>
        </>
      )}

      {/* Content - Only show when not loading and no error */}
      {!loading && !error && (
        <>
         {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Projects</h2>
        <p className="text-gray-600">These are the amazing projects built by you</p>
      </div>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === 'all' 
                    ? 'bg-[#f84f39] text-white shadow-lg transform scale-105' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                }`}
              >
                All Projects
              </button>
              {ProjectCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    activeCategory === category.name
                      ? 'text-white shadow-lg transform scale-105'
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
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:border-transparent transition-all"
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
          {filteredProjects.length === 0 && projects.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-600 mb-4">Be the first to submit a project to the community!</p>
              <Link 
                to="/submit-project"
                className="inline-flex px-6 py-3 bg-[#f84f39] text-white rounded-lg font-medium hover:bg-[#d63027] transition-colors"
              >
                Submit Your Project
              </Link>
            </div>
          )}

          {/* No Results State (when filtered) */}
          {filteredProjects.length === 0 && projects.length > 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600 mb-4">
                No projects found in {activeCategory} category. Try a different filter.
              </p>
              <button 
                onClick={() => handleCategoryChange('all')}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Show All Projects
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
        </>
      )}
    </div>
  )
}

export default ProjectGallery 