/* eslint-disable react/prop-types */
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { ratingsAPI } from '../utils/api'
import toast from 'react-hot-toast'

const StarRating = ({ 
  rating = 0, 
  onRatingChange, 
  readonly = false, 
  size = "md",
  projectId = null,
  showRatingValue = true,
  enableApiSubmission = false
}) => {
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentRating, setCurrentRating] = useState(rating)
  const { isAuthenticated } = useAuth()
  
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5", 
    lg: "w-6 h-6"
  }
  
  const handleStarClick = async (starValue) => {
    if (readonly || isSubmitting) return

    // If API submission is enabled and we have a projectId
    if (enableApiSubmission && projectId) {
      if (!isAuthenticated) {
        toast.error('Please sign in to rate this project')
        return
      }

      try {
        setIsSubmitting(true)
        
        // Validate rating
        console.log('StarRating - Raw starValue:', starValue, 'Type:', typeof starValue)
        
        const numericRating = Number(starValue)
        console.log('StarRating - Numeric rating:', numericRating, 'Type:', typeof numericRating)
        
        if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
          console.error('StarRating - Invalid rating:', { starValue, numericRating })
          toast.error('Invalid rating. Please select between 1-5 stars.')
          return
        }

        console.log('Submitting rating:', { projectId, rating: numericRating })

        // Try to create a new rating first
        try {
          await ratingsAPI.rateProject(projectId, { rating: numericRating })
          toast.success(`Rated ${numericRating} star${numericRating !== 1 ? 's' : ''}!`, {
            icon: '⭐',
            duration: 3000
          })
        } catch (createError) {
          console.log('Create error:', createError.response?.data || createError.message)
          // If create fails because user already rated, try to update instead
          if (createError.response?.data?.error?.includes('already rated')) {
            console.log('User already rated, trying to update...')
            await ratingsAPI.updateRating(projectId, { rating: numericRating })
            toast.success(`Updated rating to ${numericRating} star${numericRating !== 1 ? 's' : ''}!`, {
              icon: '⭐',
              duration: 3000
            })
          } else {
            // If it's a different error, re-throw it to be handled by outer catch
            throw createError
          }
        }

        // Update local state
        setCurrentRating(numericRating)
        
        // Call parent callback if provided
        if (onRatingChange) {
          onRatingChange(numericRating)
        }

      } catch (error) {
        console.error('Failed to submit rating:', error)
        const errorMessage = error.response?.data?.error || 'Failed to submit rating'
        
        if (errorMessage.includes('cannot rate your own project')) {
          toast.error('You cannot rate your own project')
        } else if (errorMessage.includes('already rated')) {
          toast.error('You have already rated this project')
        } else {
          toast.error(errorMessage)
        }
      } finally {
        setIsSubmitting(false)
      }
    } else {
      // Fallback to parent callback (original behavior)
      const numericRating = Number(starValue)
      if (onRatingChange) {
        onRatingChange(numericRating)
      }
      setCurrentRating(numericRating)
    }
  }
  
  const handleStarHover = (starValue) => {
    if (!readonly && !isSubmitting) {
      setHoveredRating(starValue)
    }
  }
  
  const handleMouseLeave = () => {
    if (!readonly && !isSubmitting) {
      setHoveredRating(0)
    }
  }
  
  const getStarColor = (starValue) => {
    const displayRating = hoveredRating || currentRating
    if (starValue <= displayRating) {
      return "#f84f39" // Filled star
    }
    return "#e2e8f0" // Empty star
  }
  
  return (
    <div className="flex items-center gap-1" onMouseLeave={handleMouseLeave}>
      {[1, 2, 3, 4, 5].map((starValue) => (
        <svg
          key={starValue}
          className={`${sizeClasses[size]} ${!readonly && !isSubmitting ? 'cursor-pointer' : 'cursor-default'} transition-colors duration-150 ${isSubmitting ? 'opacity-50' : ''}`}
          fill={getStarColor(starValue)}
          stroke={getStarColor(starValue)}
          strokeWidth="1"
          viewBox="0 0 24 24"
          onClick={() => handleStarClick(starValue)}
          onMouseEnter={() => handleStarHover(starValue)}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      {showRatingValue && currentRating > 0 && (
        <span className="ml-2 text-sm text-gray-600 font-medium">
          {currentRating.toFixed(1)}
        </span>
      )}
      {isSubmitting && (
        <div className="ml-2 flex items-center">
          <div className="w-4 h-4 border-2 border-[#f84f39] border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-1 text-xs text-gray-500">Submitting...</span>
        </div>
      )}
    </div>
  )
}

export default StarRating 