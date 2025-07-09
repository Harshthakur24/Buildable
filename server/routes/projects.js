import { Router } from 'express'
import Joi from 'joi'
import { PrismaClient } from '@prisma/client'
import { protect, optional } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

// Validation schemas
const projectSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Project title must be at least 3 characters long',
    'string.max': 'Project title cannot exceed 100 characters',
    'any.required': 'Project title is required'
  }),
  description: Joi.string().min(20).max(2000).required().messages({
    'string.min': 'Description must be at least 20 characters long',
    'string.max': 'Description cannot exceed 2000 characters',
    'any.required': 'Project description is required'
  }),
  category: Joi.string().valid(
    'web-app', 'mobile-app', 'desktop-app', 'library', 'tool', 
    'game', 'ai-ml', 'blockchain', 'other'
  ).required().messages({
    'any.only': 'Please select a valid category',
    'any.required': 'Project category is required'
  }),
  status: Joi.string().valid('completed', 'in-progress', 'prototype').default('completed'),
  techStack: Joi.array().items(Joi.string().max(50)).max(20).default([]),
  images: Joi.array().items(Joi.string().uri()).max(10).default([]),
  githubUrl: Joi.string().uri().allow('').optional(),
  demoUrl: Joi.string().uri().allow('').optional()
})

const updateProjectSchema = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  description: Joi.string().min(20).max(2000).optional(),
  category: Joi.string().valid(
    'web-app', 'mobile-app', 'desktop-app', 'library', 'tool', 
    'game', 'ai-ml', 'blockchain', 'other'
  ).optional(),
  status: Joi.string().valid('completed', 'in-progress', 'prototype').optional(),
  techStack: Joi.array().items(Joi.string().max(50)).max(20).optional(),
  images: Joi.array().items(Joi.string().uri()).max(10).optional(),
  githubUrl: Joi.string().uri().allow('').optional(),
  demoUrl: Joi.string().uri().allow('').optional()
})

// Helper function to clean URLs
const cleanUrl = (url) => {
  if (!url || url.trim() === '') return null
  return url.trim()
}

// Helper function to process project data (parse JSON strings)
const processProject = (project) => ({
  ...project,
  techStack: JSON.parse(project.techStack || '[]'),
  images: JSON.parse(project.images || '[]')
})

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
router.get('/', optional, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      status, 
      search, 
      sortBy = 'createdAt', 
      order = 'desc' 
    } = req.query

    // Build where clause
    const where = {}
    if (category) where.category = category
    if (status) where.status = status
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const take = parseInt(limit)

    // Get projects with user info
    const projects = await prisma.project.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy]: order },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        status: true,
        techStack: true,
        images: true,
        githubUrl: true,
        demoUrl: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            github: true
          }
        },
        _count: {
          select: {
            ratings: true
          }
        }
      }
    })

    // Parse JSON strings back to arrays
    const processedProjects = projects.map(processProject)

    // Get total count for pagination
    const total = await prisma.project.count({ where })

    res.status(200).json({
      success: true,
      data: processedProjects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })

  } catch (error) {
    console.error('Get projects error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
router.get('/:id', optional, async (req, res) => {
  try {
    const { id } = req.params

    const project = await prisma.project.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        status: true,
        techStack: true,
        images: true,
        githubUrl: true,
        demoUrl: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            github: true
          }
        },
        ratings: {
          select: {
            rating: true,
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        }
      }
    })

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      })
    }

    // Calculate average rating
    const avgRating = project.ratings.length > 0
      ? project.ratings.reduce((sum, r) => sum + r.rating, 0) / project.ratings.length
      : 0

    res.status(200).json({
      success: true,
      data: {
        ...processProject(project),
        avgRating: Math.round(avgRating * 10) / 10,
        totalRatings: project.ratings.length
      }
    })

  } catch (error) {
    console.error('Get project error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { error, value } = projectSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      })
    }

    const { 
      title, 
      description, 
      category, 
      status, 
      techStack, 
      images, 
      githubUrl, 
      demoUrl 
    } = value

    // Create project
    const project = await prisma.project.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        category,
        status,
        techStack: JSON.stringify(techStack || []),
        images: JSON.stringify(images.filter(img => img) || []), // Remove empty images
        githubUrl: cleanUrl(githubUrl),
        demoUrl: cleanUrl(demoUrl),
        authorId: req.user.id
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        status: true,
        techStack: true,
        images: true,
        githubUrl: true,
        demoUrl: true,
        createdAt: true,
        author: {
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
      message: 'Project created successfully',
      data: processProject(project)
    })

  } catch (error) {
    console.error('Create project error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error during project creation'
    })
  }
})

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (own projects only)
router.put('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params
    const { error, value } = updateProjectSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      })
    }

    // Check if project exists and user owns it
    const existingProject = await prisma.project.findUnique({
      where: { id },
      select: { authorId: true }
    })

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      })
    }

    if (existingProject.authorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You can only update your own projects'
      })
    }

    // Build update data
    const updateData = {}
    Object.keys(value).forEach(key => {
      if (value[key] !== undefined) {
        if (key === 'title' || key === 'description') {
          updateData[key] = value[key].trim()
        } else if (key === 'githubUrl' || key === 'demoUrl') {
          updateData[key] = cleanUrl(value[key])
        } else if (key === 'techStack') {
          updateData[key] = JSON.stringify(value[key] || [])
        } else if (key === 'images') {
          updateData[key] = JSON.stringify(value[key].filter(img => img) || []) // Remove empty images
        } else {
          updateData[key] = value[key]
        }
      }
    })

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        status: true,
        techStack: true,
        images: true,
        githubUrl: true,
        demoUrl: true,
        createdAt: true,
        updatedAt: true,
        author: {
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
      message: 'Project updated successfully',
      data: processProject(updatedProject)
    })

  } catch (error) {
    console.error('Update project error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error during project update'
    })
  }
})

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (own projects only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params

    // Check if project exists and user owns it
    const existingProject = await prisma.project.findUnique({
      where: { id },
      select: { authorId: true, title: true }
    })

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      })
    }

    if (existingProject.authorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You can only delete your own projects'
      })
    }

    // Delete project (this will cascade delete related ratings)
    await prisma.project.delete({
      where: { id }
    })

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    })

  } catch (error) {
    console.error('Delete project error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error during project deletion'
    })
  }
})

// @desc    Get user's projects
// @route   GET /api/projects/user/:userId
// @access  Public
router.get('/user/:userId', optional, async (req, res) => {
  try {
    const { userId } = req.params
    const { page = 1, limit = 10 } = req.query

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const take = parseInt(limit)

    // Get user's projects
    const projects = await prisma.project.findMany({
      where: { authorId: userId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        status: true,
        techStack: true,
        images: true,
        githubUrl: true,
        demoUrl: true,
        createdAt: true,
        _count: {
          select: {
            ratings: true
          }
        }
      }
    })

    // Get total count
    const total = await prisma.project.count({
      where: { authorId: userId }
    })

    res.status(200).json({
      success: true,
      data: projects.map(processProject),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })

  } catch (error) {
    console.error('Get user projects error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

export default router 