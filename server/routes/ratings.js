import express from 'express'
import { PrismaClient } from '@prisma/client'
import Joi from 'joi'
import { protect } from '../middleware/auth.js'

const router = express.Router()
const prisma = new PrismaClient()

// Validation schema
const createRatingSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().max(500).optional()
})

const updateRatingSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).optional(),
  comment: Joi.string().max(500).optional()
})

// @desc    Get ratings for a project
// @route   GET /api/ratings/project/:projectId
// @access  Public
export const getProjectRatings = async (req, res, next) => {
  try {
    const { projectId } = req.params
    const { page = 1, limit = 10 } = req.query

    const skip = (page - 1) * limit
    const take = parseInt(limit)

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    })

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      })
    }

    const [ratings, total, stats] = await Promise.all([
      // Get ratings with pagination
      prisma.rating.findMany({
        where: { projectId },
        skip,
        take,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      // Get total count
      prisma.rating.count({
        where: { projectId }
      }),
      // Get rating statistics
      prisma.rating.groupBy({
        by: ['rating'],
        where: { projectId },
        _count: {
          rating: true
        }
      })
    ])

    // Calculate statistics
    const totalRatings = total
    const avgRating = totalRatings > 0
      ? await prisma.rating.aggregate({
          where: { projectId },
          _avg: { rating: true }
        }).then(result => parseFloat(result._avg.rating?.toFixed(1) || '0'))
      : 0

    // Format rating distribution
    const ratingDistribution = [1, 2, 3, 4, 5].map(star => {
      const stat = stats.find(s => s.rating === star)
      return {
        stars: star,
        count: stat?._count.rating || 0,
        percentage: totalRatings > 0 ? ((stat?._count.rating || 0) / totalRatings * 100).toFixed(1) : '0.0'
      }
    })

    const totalPages = Math.ceil(total / limit)

    res.status(200).json({
      success: true,
      data: {
        ratings,
        statistics: {
          total: totalRatings,
          average: avgRating,
          distribution: ratingDistribution
        },
        pagination: {
          current: parseInt(page),
          total: totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
          totalItems: total
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Rate a project
// @route   POST /api/ratings/project/:projectId
// @access  Private
export const rateProject = async (req, res, next) => {
  try {
    const { projectId } = req.params

    // Validate request body
    const { error, value } = createRatingSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      })
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    })

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      })
    }

    // Check if user is trying to rate their own project
    if (project.userId === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'You cannot rate your own project'
      })
    }

    // Check if user has already rated this project
    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_projectId: {
          userId: req.user.id,
          projectId
        }
      }
    })

    if (existingRating) {
      return res.status(400).json({
        success: false,
        error: 'You have already rated this project. Use PUT to update your rating.'
      })
    }

    // Create rating
    const rating = await prisma.rating.create({
      data: {
        ...value,
        userId: req.user.id,
        projectId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    res.status(201).json({
      success: true,
      data: rating,
      message: 'Rating submitted successfully'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update a rating
// @route   PUT /api/ratings/:id
// @access  Private
export const updateRating = async (req, res, next) => {
  try {
    const { id } = req.params

    // Validate request body
    const { error, value } = updateRatingSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      })
    }

    // Check if rating exists and belongs to user
    const existingRating = await prisma.rating.findUnique({
      where: { id }
    })

    if (!existingRating) {
      return res.status(404).json({
        success: false,
        error: 'Rating not found'
      })
    }

    if (existingRating.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this rating'
      })
    }

    // Update rating
    const updatedRating = await prisma.rating.update({
      where: { id },
      data: value,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    res.status(200).json({
      success: true,
      data: updatedRating,
      message: 'Rating updated successfully'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete a rating
// @route   DELETE /api/ratings/:id
// @access  Private
export const deleteRating = async (req, res, next) => {
  try {
    const { id } = req.params

    // Check if rating exists and belongs to user
    const rating = await prisma.rating.findUnique({
      where: { id }
    })

    if (!rating) {
      return res.status(404).json({
        success: false,
        error: 'Rating not found'
      })
    }

    if (rating.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this rating'
      })
    }

    await prisma.rating.delete({
      where: { id }
    })

    res.status(200).json({
      success: true,
      message: 'Rating deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get user's ratings
// @route   GET /api/ratings/my-ratings
// @access  Private
export const getMyRatings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const skip = (page - 1) * limit
    const take = parseInt(limit)

    const [ratings, total] = await Promise.all([
      prisma.rating.findMany({
        where: { userId: req.user.id },
        skip,
        take,
        include: {
          project: {
            select: {
              id: true,
              title: true,
              image: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.rating.count({
        where: { userId: req.user.id }
      })
    ])

    const totalPages = Math.ceil(total / limit)

    res.status(200).json({
      success: true,
      data: {
        ratings,
        pagination: {
          current: parseInt(page),
          total: totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
          totalItems: total
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

// Routes
router.get('/project/:projectId', getProjectRatings)
router.post('/project/:projectId', protect, rateProject)
router.put('/:id', protect, updateRating)
router.delete('/:id', protect, deleteRating)
router.get('/my-ratings', protect, getMyRatings)

export default router 