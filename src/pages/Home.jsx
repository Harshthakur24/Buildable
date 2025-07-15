import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { projectsAPI, ratingsAPI } from '../utils/api'
import Footer from "../components/Footer"
import HeroSection from "../components/HeroSection"
import HeroSection2 from "../components/HeroSection2"
import List from "../components/List"
import Navbar from "../components/Navbar"
import OverlapCard from "../components/OverlapCard"
import ProjectSubmission from "../components/ProjectSubmission"
import ProjectGallery from "../components/ProjectGallery"
import toast from 'react-hot-toast'

const Home = () => {
  const { isAuthenticated } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await projectsAPI.getProjects()
        setProjects(response.data || [])
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

  const handleProjectRate = async (projectId, rating) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to rate projects')
      window.location.href = '/login'
      return
    }

    try {
      // Check if user has already rated this project
      let isUpdate = false
      try {
        await ratingsAPI.getMyRating(projectId)
        isUpdate = true
      } catch {
        // Rating doesn't exist, we'll create a new one
        isUpdate = false
      }

      // Ensure rating is a number and valid range
      const numericRating = Number(rating)
      console.log('API call - Rating value:', numericRating, 'Type:', typeof numericRating)
      
      // Validate rating range
      if (!numericRating || numericRating < 1 || numericRating > 5) {
        toast.error('Invalid rating. Please select a rating between 1 and 5 stars.')
        return
      }
      
      // Submit rating
      if (isUpdate) {
        await ratingsAPI.updateRating(projectId, { rating: numericRating })
        toast.success(`Updated rating to ${numericRating} star${numericRating !== 1 ? 's' : ''}!`)
      } else {
        await ratingsAPI.rateProject(projectId, { rating: numericRating })
        toast.success(`Rated ${numericRating} star${numericRating !== 1 ? 's' : ''}!`)
      }
      
      // Refresh projects to get updated ratings from server
      const response = await projectsAPI.getProjects()
      setProjects(response.data || [])
      
    } catch (err) {
      console.error('Failed to rate project:', err)
      
      // Handle specific error messages
      const errorMessage = err.response?.data?.error || 'Failed to submit rating. Please try again.'
      
      if (errorMessage.includes('cannot rate your own project')) {
        toast.error('You cannot rate your own project')
      } else if (errorMessage.includes('already rated')) {
        toast.error('You have already rated this project')
      } else {
        toast.error(errorMessage)
      }
    }
  }

  return (
    <main>
      <Navbar />
      <HeroSection />
      <HeroSection2 />
      <OverlapCard />
      
      {/* Project Gallery Section */}
      <div className="bg-gray-50 py-16">
        <ProjectGallery 
          projects={projects}
          onProjectRate={handleProjectRate}
          loading={loading}
          error={error}
        />
      </div>
      
      <List/>
      <ProjectSubmission />
      <Footer />
    </main>
  )
}

export default Home 