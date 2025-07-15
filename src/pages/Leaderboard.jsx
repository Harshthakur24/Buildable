import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { projectsAPI } from '../utils/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { 
  Crown, Trophy, Medal, Star, TrendingUp, Zap, 
   Target, Users, Github, ExternalLink,
  Sparkles, Code, Rocket,
  ChevronRight
} from 'lucide-react'
import toast from 'react-hot-toast'

const Leaderboard = () => {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('projects') // projects, developers, categories
  
  // Leaderboard data
  const [topProjects, setTopProjects] = useState([])
  const [topDevelopers, setTopDevelopers] = useState([])
  const [topCategories, setTopCategories] = useState([])
  const [stats, setStats] = useState({})

  // Fetch and process data
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true)
        const response = await projectsAPI.getProjects()
        const projectsData = response.data || []
        
        // Process top projects
        const sortedProjects = [...projectsData]
          .filter(p => p.averageRating > 0)
          .sort((a, b) => {
            if (b.averageRating === a.averageRating) {
              return (b.totalRatings || 0) - (a.totalRatings || 0)
            }
            return (b.averageRating || 0) - (a.averageRating || 0)
          })
          .slice(0, 10)
        
        setTopProjects(sortedProjects)
        
        // Process top developers
        const developerStats = {}
        projectsData.forEach(project => {
          const authorId = project.user?.id || project.authorId
          const authorName = project.user?.name || 'Anonymous'
          
          if (!developerStats[authorId]) {
            developerStats[authorId] = {
              id: authorId,
              name: authorName,
              avatar: project.user?.avatar,
              projectCount: 0,
              totalRatings: 0,
              totalStars: 0,
              averageRating: 0,
              projects: []
            }
          }
          
          developerStats[authorId].projectCount++
          developerStats[authorId].totalRatings += project.totalRatings || 0
          developerStats[authorId].totalStars += project.totalStars || 0
          developerStats[authorId].projects.push(project)
        })
        
        const topDevs = Object.values(developerStats)
          .map(dev => ({
            ...dev,
            averageRating: dev.totalRatings > 0 ? dev.totalStars / dev.totalRatings : 0
          }))
          .sort((a, b) => {
            const scoreA = a.averageRating * a.projectCount + a.totalRatings * 0.1
            const scoreB = b.averageRating * b.projectCount + b.totalRatings * 0.1
            return scoreB - scoreA
          })
          .slice(0, 10)
        
        setTopDevelopers(topDevs)
        
        // Process top categories
        const categoryStats = {}
        projectsData.forEach(project => {
          project.projectCategories?.forEach(pc => {
            const categoryName = pc.category?.name
            if (categoryName) {
              if (!categoryStats[categoryName]) {
                categoryStats[categoryName] = {
                  name: categoryName,
                  projectCount: 0,
                  totalRatings: 0,
                  averageRating: 0,
                  totalStars: 0
                }
              }
              categoryStats[categoryName].projectCount++
              categoryStats[categoryName].totalRatings += project.totalRatings || 0
              categoryStats[categoryName].totalStars += project.totalStars || 0
            }
          })
        })
        
        const topCats = Object.values(categoryStats)
          .map(cat => ({
            ...cat,
            averageRating: cat.totalRatings > 0 ? cat.totalStars / cat.totalRatings : 0
          }))
          .sort((a, b) => b.projectCount - a.projectCount)
          .slice(0, 8)
        
        setTopCategories(topCats)
        
        // Calculate overall stats
        setStats({
          totalProjects: projectsData.length,
          totalDevelopers: Object.keys(developerStats).length,
          totalRatings: projectsData.reduce((sum, p) => sum + (p.totalRatings || 0), 0),
          averageRating: projectsData.length > 0 ? 
            projectsData.reduce((sum, p) => sum + (p.averageRating || 0), 0) / projectsData.length : 0
        })
        
      } catch (err) {
        console.error('Failed to fetch leaderboard data:', err)
        toast.error('Failed to load leaderboard data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchLeaderboardData()
  }, [])

  // Get rank icon/badge
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />
      case 2: return <Trophy className="w-6 h-6 text-gray-400" />
      case 3: return <Medal className="w-6 h-6 text-orange-500" />
      default: return <span className="text-lg font-bold text-gray-500">#{rank}</span>
    }
  }

  // Get rank background
  const getRankBg = (rank) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500'
      case 3: return 'bg-gradient-to-r from-orange-400 to-orange-600'
      default: return 'bg-gradient-to-r from-gray-100 to-gray-200'
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  /* eslint-disable react/prop-types */
  const ProjectCard = ({ project, rank }) => (
    <motion.div
      variants={itemVariants}
      className="relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
      whileHover={{ y: -5 }}
    >
      {/* Rank Badge */}
      <div className={`absolute top-4 left-4 z-10 w-12 h-12 rounded-full ${getRankBg(rank)} flex items-center justify-center shadow-lg`}>
        {getRankIcon(rank)}
      </div>
      
      {/* Featured Badge for top 3 */}
      {rank <= 3 && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Featured
          </div>
        </div>
      )}
      
      {/* Project Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {project.image ? (
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Code className="w-16 h-16 text-gray-400" />
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Action buttons */}
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" 
               className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
              <ExternalLink className="w-5 h-5 text-gray-700" />
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
               className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
              <Github className="w-5 h-5 text-gray-700" />
            </a>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {project.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-lg">{project.averageRating?.toFixed(1) || '0.0'}</span>
          </div>
          <span className="text-gray-500 text-sm">({project.totalRatings} ratings)</span>
        </div>
        
        {/* Author */}
        <div className="flex items-center gap-3">
          {project.user?.avatar ? (
            <img src={project.user.avatar} alt={project.user.name} className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-[#f84f39] to-[#6b66da] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {project.user?.name?.charAt(0) || 'U'}
              </span>
            </div>
          )}
          <span className="text-sm font-medium text-gray-900">
            {project.user?.name || 'Anonymous'}
          </span>
        </div>
      </div>
    </motion.div>
  )
  /* eslint-enable react/prop-types */

  /* eslint-disable react/prop-types */
  const DeveloperCard = ({ developer, rank }) => (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300"
      whileHover={{ y: -3 }}
    >
      <div className="flex items-center gap-4 mb-4">
        {/* Rank */}
        <div className={`w-12 h-12 rounded-full ${getRankBg(rank)} flex items-center justify-center shadow-lg`}>
          {getRankIcon(rank)}
        </div>
        
        {/* Avatar */}
        {developer.avatar ? (
          <img src={developer.avatar} alt={developer.name} className="w-16 h-16 rounded-full border-4 border-white shadow-lg" />
        ) : (
          <div className="w-16 h-16 bg-gradient-to-br from-[#f84f39] to-[#6b66da] rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-xl font-bold">
              {developer.name?.charAt(0) || 'U'}
            </span>
          </div>
        )}
        
        {/* Name and stats */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">{developer.name}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
            <span className="flex items-center gap-1">
              <Code className="w-4 h-4" />
              {developer.projectCount} projects
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              {developer.averageRating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-[#f84f39]">{developer.totalRatings}</div>
          <div className="text-xs text-gray-500">Total Ratings</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-500">{developer.totalStars}</div>
          <div className="text-xs text-gray-500">Total Stars</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">{developer.projectCount}</div>
          <div className="text-xs text-gray-500">Projects</div>
        </div>
      </div>
    </motion.div>
  )
  /* eslint-enable react/prop-types */

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800">
          <div className="absolute inset-0 bg-black/20" />
          {/* Floating particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, 20, -20],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 text-white text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Trophy className="w-12 h-12 text-yellow-400" />
              <h1 className="text-6xl font-bold">Leaderboard</h1>
              <Crown className="w-12 h-12 text-yellow-400" />
            </div>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Discover the top projects, developers, and rising stars in our community
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        {/* Stats Overview */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Code className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalProjects}</div>
            <div className="text-gray-600">Projects</div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalDevelopers}</div>
            <div className="text-gray-600">Developers</div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalRatings}</div>
            <div className="text-gray-600">Ratings</div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.averageRating?.toFixed(1) || '0.0'}</div>
            <div className="text-gray-600">Avg Rating</div>
          </motion.div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2 mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'projects', label: 'Top Projects', icon: Trophy },
              { id: 'developers', label: 'Top Developers', icon: Users },
              { id: 'categories', label: 'Popular Categories', icon: Target }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#f84f39] to-[#d63027] text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 border-4 border-[#f84f39] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading leaderboard data...</p>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Top Projects */}
              {activeTab === 'projects' && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                      <Trophy className="w-8 h-8 text-[#f84f39]" />
                      Top Rated Projects
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <TrendingUp className="w-4 h-4" />
                      Ranked by rating & popularity
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {topProjects.map((project, index) => (
                      <ProjectCard key={project.id} project={project} rank={index + 1} />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Top Developers */}
              {activeTab === 'developers' && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                      <Users className="w-8 h-8 text-[#f84f39]" />
                      Top Developers
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Zap className="w-4 h-4" />
                      Based on project quality & quantity
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topDevelopers.map((developer, index) => (
                      <DeveloperCard key={developer.id} developer={developer} rank={index + 1} />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Top Categories */}
              {activeTab === 'categories' && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                      <Target className="w-8 h-8 text-[#f84f39]" />
                      Popular Categories
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <TrendingUp className="w-4 h-4" />
                      Most active categories
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {topCategories.map((category, index) => (
                      <motion.div
                        key={category.name}
                        variants={itemVariants}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-2xl transition-all duration-300"
                        whileHover={{ y: -5 }}
                      >
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${getRankBg(index + 1)}`}>
                          <span className="text-2xl">
                            {index === 0 && '🚀'}
                            {index === 1 && '⚡'}
                            {index === 2 && '🎨'}
                            {index === 3 && '📱'}
                            {index === 4 && '🌐'}
                            {index === 5 && '🔧'}
                            {index === 6 && '🎮'}
                            {index >= 7 && '💡'}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Projects:</span>
                            <span className="font-semibold">{category.projectCount}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Avg Rating:</span>
                            <span className="font-semibold">{category.averageRating.toFixed(1)} ⭐</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Total Ratings:</span>
                            <span className="font-semibold">{category.totalRatings}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call to Action */}
        <motion.div 
          className="bg-gradient-to-r from-[#f84f39] to-[#d63027] rounded-3xl p-12 text-center text-white mt-16 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <Rocket className="w-16 h-16 mx-auto mb-6" />
          <h3 className="text-3xl font-bold mb-4">Ready to Join the Leaderboard?</h3>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Submit your amazing projects and compete with the best developers in our community
          </p>
          <Link 
            to="/submit-project"
            className="inline-flex items-center gap-3 bg-white text-[#f84f39] px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            <Sparkles className="w-6 h-6" />
            Submit Your Project
            <ChevronRight className="w-6 h-6" />
          </Link>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  )
}

export default Leaderboard 