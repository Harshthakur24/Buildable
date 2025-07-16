import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { projectsAPI } from '../utils/api'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { 
  Compass, Zap, Users, Star, Rocket, Target, BookOpen,
  Clock, MessageCircle, Map, Search, Atom, Trophy, TrendingUp, Calendar
} from 'lucide-react'
import toast from 'react-hot-toast'

const Explore = () => {
  // eslint-disable-next-line no-unused-vars
  const { user, isAuthenticated } = useAuth()
  const [activeSection, setActiveSection] = useState('activity')
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([])
  const [techStats, setTechStats] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [featuredContent, setFeaturedContent] = useState({
    project: null,
    developer: null,
    technology: null
  })

  // Learning paths data
  const learningPaths = [
    {
      id: 1,
      title: "Frontend Mastery",
      description: "Master modern frontend development",
      icon: "🎨",
      difficulty: "Beginner to Advanced",
      projects: 24,
      skills: ["React", "CSS", "JavaScript", "TypeScript"],
      color: "from-blue-500 to-purple-600"
    },
    {
      id: 2,
      title: "Backend Engineering",
      description: "Build scalable server-side applications",
      icon: "⚙️",
      difficulty: "Intermediate",
      projects: 18,
      skills: ["Node.js", "Python", "Databases", "APIs"],
      color: "from-green-500 to-teal-600"
    },
    {
      id: 3,
      title: "Full-Stack Journey",
      description: "Complete end-to-end development",
      icon: "🚀",
      difficulty: "Advanced",
      projects: 31,
      skills: ["React", "Node.js", "MongoDB", "AWS"],
      color: "from-orange-500 to-red-600"
    },
    {
      id: 4,
      title: "AI/ML Explorer",
      description: "Dive into artificial intelligence",
      icon: "🤖",
      difficulty: "Advanced",
      projects: 15,
      skills: ["Python", "TensorFlow", "PyTorch", "Data Science"],
      color: "from-purple-500 to-pink-600"
    }
  ]

  // Community challenges
  const challenges = [
    {
      id: 1,
      title: "30 Days of Code",
      description: "Build something new every day",
      participants: 156,
      timeLeft: "12 days left",
      difficulty: "All Levels",
      prize: "Featured spotlight + swag",
      icon: "🏆"
    },
    {
      id: 2,
      title: "Green Code Challenge",
      description: "Build eco-friendly applications",
      participants: 89,
      timeLeft: "3 weeks left",
      difficulty: "Intermediate",
      prize: "$500 + recognition",
      icon: "🌱"
    }
  ]

  // Fetch data
  useEffect(() => {
    const fetchExploreData = async () => {
      try {
        setLoading(true)
        const response = await projectsAPI.getProjects()
        const projectsData = response.data || []
        setProjects(projectsData)
        
        // Process tech stack statistics
        const techCount = {}
        projectsData.forEach(project => {
          project.techStack?.forEach(tech => {
            techCount[tech] = (techCount[tech] || 0) + 1
          })
        })
        
        const topTechs = Object.entries(techCount)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 12)
          .map(([name, count]) => ({ name, count, growth: Math.random() * 40 + 10 }))
        
        setTechStats(topTechs)
        
        // Generate mock recent activity
        const activities = [
          { type: 'project', user: 'Sarah Chen', action: 'submitted', item: 'AI Todo Assistant', time: '2 min ago', rating: 4.8 },
          { type: 'rating', user: 'Mike Johnson', action: 'rated', item: 'React Dashboard', time: '5 min ago', rating: 5 },
          { type: 'comment', user: 'Alex Rivera', action: 'commented on', item: 'Vue E-commerce', time: '8 min ago' },
          { type: 'project', user: 'Emma Davis', action: 'updated', item: 'Python ML Model', time: '12 min ago', rating: 4.6 },
          { type: 'achievement', user: 'David Wilson', action: 'earned', item: 'Full Stack Badge', time: '15 min ago' },
          { type: 'collaboration', user: 'Lisa Park', action: 'joined team for', item: 'Open Source CLI', time: '18 min ago' }
        ]
        
        setRecentActivity(activities)
        
        // Set featured content
        if (projectsData.length > 0) {
          const featuredProject = projectsData.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))[0]
          setFeaturedContent({
            project: featuredProject,
            developer: { name: "Alex Rodriguez", projects: 12, rating: 4.9, specialty: "Full-Stack" },
            technology: topTechs[0]
          })
        }
        
      } catch (err) {
        console.error('Failed to fetch explore data:', err)
        toast.error('Failed to load explore data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchExploreData()
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  /* eslint-disable react/prop-types */
  const TechBubble = ({ tech, index }) => (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: index * 0.1, type: "spring" }}
      whileHover={{ scale: 1.1, y: -5 }}
      className="relative group cursor-pointer"
    >
      <div className={`
        w-${12 + (tech.count / 5)} h-${12 + (tech.count / 5)} 
        bg-gradient-to-br from-blue-400 to-purple-600 
        rounded-full flex items-center justify-center text-white font-bold text-sm
        shadow-lg hover:shadow-2xl transition-all duration-300
        ${tech.count > 10 ? 'w-20 h-20' : tech.count > 5 ? 'w-16 h-16' : 'w-12 h-12'}
      `}>
        {tech.name.slice(0, 2).toUpperCase()}
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-black text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
          <div className="font-semibold">{tech.name}</div>
          <div className="text-green-400">+{tech.growth.toFixed(1)}% growth</div>
          <div>{tech.count} projects</div>
        </div>
      </div>
    </motion.div>
  )
 
  const ActivityItem = ({ activity, index }) => {
    const getIcon = () => {
      switch (activity.type) {
        case 'project': return <Rocket className="w-5 h-5 text-blue-500" />
        case 'rating': return <Star className="w-5 h-5 text-yellow-500" />
        case 'comment': return <MessageCircle className="w-5 h-5 text-green-500" />
        case 'achievement': return <Trophy className="w-5 h-5 text-purple-500" />
        case 'collaboration': return <Users className="w-5 h-5 text-orange-500" />
        default: return <Zap className="w-5 h-5 text-gray-500" />
      }
    }

    return (
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: index * 0.1 }}
        className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900">
            <span className="font-semibold">{activity.user}</span> {activity.action}{' '}
            <span className="font-medium text-[#f84f39]">{activity.item}</span>
            {activity.rating && (
              <span className="ml-2 inline-flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{activity.rating}</span>
              </span>
            )}
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {activity.time}
          </p>
        </div>
      </motion.div>
    )
  }
  /* eslint-enable react/prop-types */

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <Search className="w-12 h-12 text-blue-400" />
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Explore
              </h1>
              <Compass className="w-12 h-12 text-purple-400" />
            </div>
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
              Discover amazing projects, connect with talented developers, learn new technologies, 
              and find your next coding adventure in our thriving community
            </p>
            
            {/* Quick stats */}
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{projects.length}+</div>
                <div className="text-sm opacity-75">Projects to Explore</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{techStats.length}+</div>
                <div className="text-sm opacity-75">Technologies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400">24/7</div>
                <div className="text-sm opacity-75">Community Activity</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'activity', label: 'Live Activity', icon: Zap },
              { id: 'tech', label: 'Tech Galaxy', icon: Atom },
              { id: 'featured', label: 'Featured', icon: Star },
              { id: 'learning', label: 'Learning Paths', icon: Map },
              { id: 'challenges', label: 'Challenges', icon: Target }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeSection === tab.id
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
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {/* Live Activity Section */}
          {activeSection === 'activity' && (
            <motion.div
              key="activity"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Feed */}
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-3 mb-6">
                    <Zap className="w-6 h-6 text-[#f84f39]" />
                    <h2 className="text-2xl font-bold text-gray-900">Live Community Activity</h2>
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Live
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <ActivityItem key={index} activity={activity} index={index} />
                    ))}
                  </div>
                </div>
                
                {/* Trending Sidebar */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-orange-500" />
                      Trending Now
                    </h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-white rounded-xl shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            #1
                          </div>
                          <span className="font-medium">React 18 Features</span>
                        </div>
                        <p className="text-sm text-gray-600">Exploring the latest React updates</p>
                      </div>
                      
                      <div className="p-4 bg-white rounded-xl shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            #2
                          </div>
                          <span className="font-medium">AI/ML Projects</span>
                        </div>
                        <p className="text-sm text-gray-600">Machine learning implementations</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tech Galaxy Section */}
          {activeSection === 'tech' && (
            <motion.div
              key="tech"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                  <Atom className="w-8 h-8 text-[#f84f39]" />
                  Technology Galaxy
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Explore the constellation of technologies powering our community projects. 
                  Larger bubbles represent more popular technologies.
                </p>
              </div>
              
              <div className="relative bg-gradient-to-br from-gray-900 to-purple-900 rounded-3xl p-12 min-h-96 overflow-hidden">
                {/* Galaxy background */}
                <div className="absolute inset-0">
                  {[...Array(100)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`
                      }}
                    />
                  ))}
                </div>
                
                {/* Tech bubbles arranged in a galaxy pattern */}
                <div className="relative z-10 flex flex-wrap justify-center items-center gap-8">
                  {techStats.map((tech, index) => (
                    <TechBubble key={tech.name} tech={tech} index={index} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Featured Section */}
          {activeSection === 'featured' && (
            <motion.div
              key="featured"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                  <Star className="w-8 h-8 text-[#f84f39]" />
                  Featured Discoveries
                </h2>
                <p className="text-gray-600">Handpicked highlights from our amazing community</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Featured Project */}
                <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                    <div className="absolute top-4 left-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm font-medium">
                        🏆 Project of the Week
                      </div>
                    </div>
                    {(featuredContent.project?.profileImage || featuredContent.project?.image) && (
                      <img 
                        src={featuredContent.project.profileImage || featuredContent.project.image} 
                        alt={featuredContent.project.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {featuredContent.project?.title || 'Amazing Project'}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {featuredContent.project?.description || 'A revolutionary project that showcases innovation'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {featuredContent.project?.averageRating?.toFixed(1) || '5.0'}
                        </span>
                      </div>
                      <Link 
                        to="/projects"
                        className="text-[#f84f39] text-sm font-medium hover:underline"
                      >
                        View Project →
                      </Link>
                    </div>
                  </div>
                </motion.div>

                {/* Featured Developer */}
                <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="text-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-purple-600 text-sm font-medium mb-4 inline-block">
                      👑 Developer Spotlight
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                      {featuredContent.developer?.name?.charAt(0) || 'A'}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {featuredContent.developer?.name || 'Alex Rodriguez'}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {featuredContent.developer?.specialty || 'Full-Stack'} Developer
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-[#f84f39]">
                          {featuredContent.developer?.projects || 12}
                        </div>
                        <div className="text-xs text-gray-500">Projects</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {featuredContent.developer?.rating || 4.9}
                        </div>
                        <div className="text-xs text-gray-500">Rating</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Trending Technology */}
                <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="text-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-green-600 text-sm font-medium mb-4 inline-block">
                      🚀 Trending Tech
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-lg font-bold">
                      {featuredContent.technology?.name?.slice(0, 2) || 'JS'}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {featuredContent.technology?.name || 'JavaScript'}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      +{featuredContent.technology?.growth?.toFixed(1) || '15.3'}% growth this month
                    </p>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {featuredContent.technology?.count || 42}
                      </div>
                      <div className="text-xs text-gray-500">Projects using this tech</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Learning Paths Section */}
          {activeSection === 'learning' && (
            <motion.div
              key="learning"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                  <Map className="w-8 h-8 text-[#f84f39]" />
                  Learning Paths
                </h2>
                <p className="text-gray-600">Structured journeys to master new skills through real projects</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {learningPaths.map((path) => (
                  <motion.div
                    key={path.id}
                    variants={itemVariants}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                  >
                    <div className={`h-32 bg-gradient-to-br ${path.color} relative`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl">{path.icon}</span>
                      </div>
                      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm">
                        {path.difficulty}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{path.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{path.description}</p>
                      
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {path.projects} projects
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {path.skills.map((skill) => (
                          <span 
                            key={skill}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      
                      <button className="w-full bg-gradient-to-r from-[#f84f39] to-[#d63027] text-white py-3 rounded-xl font-medium hover:shadow-lg transition-shadow">
                        Start Learning Path
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Challenges Section */}
          {activeSection === 'challenges' && (
            <motion.div
              key="challenges"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                  <Target className="w-8 h-8 text-[#f84f39]" />
                  Community Challenges
                </h2>
                <p className="text-gray-600">Join exciting challenges and compete with developers worldwide</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {challenges.map((challenge) => (
                  <motion.div
                    key={challenge.id}
                    variants={itemVariants}
                    className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="text-center mb-6">
                      <div className="text-6xl mb-4">{challenge.icon}</div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{challenge.title}</h3>
                      <p className="text-gray-600">{challenge.description}</p>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Participants</span>
                        <span className="font-semibold">{challenge.participants} developers</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Time left</span>
                        <span className="font-semibold text-orange-600">{challenge.timeLeft}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Difficulty</span>
                        <span className="font-semibold">{challenge.difficulty}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Prize</span>
                        <span className="font-semibold text-green-600">{challenge.prize}</span>
                      </div>
                    </div>
                    
                    <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-shadow">
                      Join Challenge
                    </button>
                  </motion.div>
                ))}
              </div>
              
              {/* Upcoming challenges teaser */}
              <motion.div 
                variants={itemVariants}
                className="mt-12 bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white text-center"
              >
                <Calendar className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">More Challenges Coming Soon!</h3>
                <p className="opacity-90 mb-4">
                  Stay tuned for hackathons, coding competitions, and collaborative projects
                </p>
                <button className="bg-white text-purple-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  Get Notified
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <Footer />
    </div>
  )
}

export default Explore 