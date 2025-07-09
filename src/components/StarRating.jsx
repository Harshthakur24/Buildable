/* eslint-disable react/prop-types */
import { useState } from 'react'

const StarRating = ({ rating = 0, onRatingChange, readonly = false, size = "md" }) => {
  const [hoveredRating, setHoveredRating] = useState(0)
  
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5", 
    lg: "w-6 h-6"
  }
  
  const handleStarClick = (starValue) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starValue)
    }
  }
  
  const handleStarHover = (starValue) => {
    if (!readonly) {
      setHoveredRating(starValue)
    }
  }
  
  const handleMouseLeave = () => {
    if (!readonly) {
      setHoveredRating(0)
    }
  }
  
  const getStarColor = (starValue) => {
    const currentRating = hoveredRating || rating
    if (starValue <= currentRating) {
      return "#f84f39" // Filled star
    }
    return "#e2e8f0" // Empty star
  }
  
  return (
    <div className="flex items-center gap-1" onMouseLeave={handleMouseLeave}>
      {[1, 2, 3, 4, 5].map((starValue) => (
        <svg
          key={starValue}
          className={`${sizeClasses[size]} ${!readonly ? 'cursor-pointer' : ''} transition-colors duration-150`}
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
      {rating > 0 && (
        <span className="ml-2 text-sm text-gray-600 font-medium">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

export default StarRating 