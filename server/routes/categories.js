import express from 'express'
import { PrismaClient } from '@prisma/client'
import Joi from 'joi'
import { protect } from '../middleware/auth.js'

const router = express.Router()
const prisma = new PrismaClient()

// Validation schema
const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).default('#6b66da'),
  icon: Joi.string().max(10).default('🚀')
})

const updateCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).optional(),
  icon: Joi.string().max(10).optional()
})

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            projectCategories: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    const categoriesWithCount = categories.map(category => ({
      ...category,
      projectCount: category._count.projectCategories,
      _count: undefined
    }))

    res.status(200).json({
      success: true,
      data: categoriesWithCount
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single category with projects
// @route   GET /api/categories/:id
// @access  Public
export const getCategory = async (req, res, next) => {
  try {
    const { id } = req.params
    const { page = 1, limit = 12 } = req.query

    const skip = (page - 1) * limit
    const take = parseInt(limit)

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        projectCategories: {
          skip,
          take,
          include: {
            project: {
              where: { published: true },
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true
                  }
                },
                ratings: {
                  select: {
                    rating: true
                  }
                },
                _count: {
                  select: {
                    ratings: true
                  }
                }
              }
            }
          },
          orderBy: {
            project: {
              createdAt: 'desc'
            }
          }
        },
        _count: {
          select: {
            projectCategories: true
          }
        }
      }
    })

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      })
    }

    // Format projects with ratings
    const projects = category.projectCategories.map(pc => {
      const project = pc.project
      const avgRating = project.ratings.length > 0
        ? project.ratings.reduce((sum, r) => sum + r.rating, 0) / project.ratings.length
        : 0

      return {
        ...project,
        avgRating: parseFloat(avgRating.toFixed(1)),
        ratings: undefined
      }
    })

    const totalProjects = category._count.projectCategories
    const totalPages = Math.ceil(totalProjects / limit)

    res.status(200).json({
      success: true,
      data: {
        category: {
          id: category.id,
          name: category.name,
          color: category.color,
          icon: category.icon,
          projectCount: totalProjects
        },
        projects,
        pagination: {
          current: parseInt(page),
          total: totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
          totalItems: totalProjects
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create category
// @route   POST /api/categories
// @access  Private (Admin only for now)
export const createCategory = async (req, res, next) => {
  try {
    // Validate request body
    const { error, value } = createCategorySchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      })
    }

    // Check if category already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name: value.name }
    })

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        error: 'Category with this name already exists'
      })
    }

    const category = await prisma.category.create({
      data: value
    })

    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin only for now)
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params

    // Validate request body
    const { error, value } = updateCategorySchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      })
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    })

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      })
    }

    // Check if name is already taken by another category
    if (value.name) {
      const duplicateCategory = await prisma.category.findFirst({
        where: {
          name: value.name,
          id: { not: id }
        }
      })

      if (duplicateCategory) {
        return res.status(400).json({
          success: false,
          error: 'Category with this name already exists'
        })
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: value
    })

    res.status(200).json({
      success: true,
      data: updatedCategory,
      message: 'Category updated successfully'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin only for now)
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            projectCategories: true
          }
        }
      }
    })

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      })
    }

    // Check if category has projects
    if (category._count.projectCategories > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete category with associated projects'
      })
    }

    await prisma.category.delete({
      where: { id }
    })

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

// Routes
router.get('/', getCategories)
router.get('/:id', getCategory)
router.post('/', protect, createCategory)
router.put('/:id', protect, updateCategory)
router.delete('/:id', protect, deleteCategory)

export default router 