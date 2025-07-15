import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { projectsAPI } from '../utils/api'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProjectCard from '../components/ProjectCard'
import { ProjectCategories } from '../../constants'
import { Search, Grid, List } from 'lucide-react'
import toast from 'react-hot-toast'

const Projects = () => {
  const { isAuthenticated } = useAuth()
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Filter and sort states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('rating') // rating, newest, popular, alphabetical
  const [viewMode, setViewMode] = useState('grid') // grid or list

  // Stats
  const [, setStats] = useState({
    totalProjects: 0,
    totalRatings: 0,
    averageRating: 0,
    topCategories: []
  })

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await projectsAPI.getProjects()
        const projectsData = response.data || []
        setProjects(projectsData)
        
        // Calculate stats
        const totalRatings = projectsData.reduce((sum, p) => sum + (p.totalRatings || 0), 0)
        const totalStars = projectsData.reduce((sum, p) => sum + (p.totalStars || 0), 0)
        const avgRating = totalRatings > 0 ? totalStars / totalRatings : 0
        
        // Get top categories
        const categoryCount = {}
        projectsData.forEach(project => {
          project.projectCategories?.forEach(pc => {
            const categoryName = pc.category?.name
            if (categoryName) {
              categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1
            }
          })
        })
        
        const topCategories = Object.entries(categoryCount)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3)
          .map(([name, count]) => ({ name, count }))

        setStats({
          totalProjects: projectsData.length,
          totalRatings,
          averageRating: avgRating,
          topCategories
        })
        
      } catch (err) {
        console.error('Failed to fetch projects:', err)
        setError('Failed to load projects. Please try again.')
        toast.error('Failed to load projects')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Handle project rating
  // eslint-disable-next-line no-unused-vars
  const handleProjectRate = async (projectId, rating) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to rate projects')
      return
    }

    try {
      // This will be handled by the existing logic in Home.jsx
      // For now, just refresh the projects
      const response = await projectsAPI.getProjects()
      setProjects(response.data || [])
    } catch (err) {
      console.error('Failed to rate project:', err)
      toast.error('Failed to submit rating')
    }
  }

  // Filter and sort projects
  useEffect(() => {
    let filtered = [...projects]
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(project =>
        project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.techStack?.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project =>
        project.projectCategories?.some(pc => pc.category?.name === selectedCategory)
      )
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => {
          const avgA = a.averageRating || 0
          const avgB = b.averageRating || 0
          if (avgA === avgB) {
            return (b.totalRatings || 0) - (a.totalRatings || 0)
          }
          return avgB - avgA
        })
        break
      case 'popular':
        filtered.sort((a, b) => (b.totalRatings || 0) - (a.totalRatings || 0))
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case 'alphabetical':
        filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
        break
      default:
        break
    }
    
    setFilteredProjects(filtered)
  }, [projects, searchQuery, selectedCategory, sortBy])

  // Loading skeleton
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
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#f84f39] via-[#f84f39] to-[#d63027] text-white">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="text-center mb-2">
            <h1 className="text-5xl font-bold mb-4">Discover Amazing Projects</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Explore the best projects built by our community, ordered by ratings and popularity
            </p>
          </div>
          
          
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects, technologies, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:border-transparent"
              />
            </div>
            
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {ProjectCategories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:border-transparent"
            >
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="alphabetical">A-Z</option>
            </select>
            
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-sm text-[#f84f39]' : 'text-gray-500'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-sm text-[#f84f39]' : 'text-gray-500'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredProjects.length} of {projects.length} projects
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(12).fill(0).map((_, index) => (
              <ProjectSkeleton key={index} />
            ))}
          </div>
        )}

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

        {/* Projects Grid/List */}
        {!loading && !error && (
          <>
            {filteredProjects.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onRate={handleProjectRate}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || selectedCategory !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'No projects have been submitted yet'
                  }
                </p>
                {(searchQuery || selectedCategory !== 'all') && (
                  <button 
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('all')
                    }}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors mr-4"
                  >
                    Clear Filters
                  </button>
                )}
                <Link 
                  to="/submit-project"
                  className="inline-flex px-6 py-3 bg-[#f84f39] text-white rounded-lg font-medium hover:bg-[#d63027] transition-colors"
                >
                  Submit Your Project
                </Link>
              </div>
            )}
          </>
        )}
      </div>
      
      <Footer />
    </div>
  )
}

export default Projects 