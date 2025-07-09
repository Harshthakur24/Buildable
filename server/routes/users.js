import express from 'express'
import { PrismaClient } from '@prisma/client'
import { protect, optional } from '../middleware/auth.js'

const router = express.Router()
const prisma = new PrismaClient()

// @desc    Get all users (public profiles)
// @route   GET /api/users
// @access  Public
export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, search, sortBy = 'newest' } = req.query

    const skip = (page - 1) * limit
    const take = parseInt(limit)

    // Build where clause
    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { bio: { contains: search, mode: 'insensitive' } }
        ]
      })
    }

    // Build orderBy clause
    let orderBy = {}
    switch (sortBy) {
      case 'projects':
        orderBy = { projects: { _count: 'desc' } }
        break
      case 'ratings':
        orderBy = { ratings: { _count: 'desc' } }
        break
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' }
        break
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy,
        select: {
          id: true,
          name: true,
          avatar: true,
          bio: true,
          github: true,
          website: true,
          twitter: true,
          createdAt: true,
          _count: {
            select: {
              projects: true,
              ratings: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    res.status(200).json({
      success: true,
      data: {
        users,
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

// @desc    Get single user profile
// @route   GET /api/users/:id
// @access  Public
export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const { projectsPage = 1, projectsLimit = 6 } = req.query

    const projectsSkip = (projectsPage - 1) * projectsLimit
    const projectsTake = parseInt(projectsLimit)

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        avatar: true,
        bio: true,
        github: true,
        website: true,
        twitter: true,
        createdAt: true,
        _count: {
          select: {
            projects: true,
            ratings: true
          }
        }
      }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }

    // Get user's projects
    const [projects, totalProjects] = await Promise.all([
      prisma.project.findMany({
        where: {
          userId: id,
          published: true
        },
        skip: projectsSkip,
        take: projectsTake,
        include: {
          ratings: {
            select: {
              rating: true
            }
          },
          projectCategories: {
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                  color: true,
                  icon: true
                }
              }
            }
          },
          _count: {
            select: {
              ratings: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.project.count({
        where: {
          userId: id,
          published: true
        }
      })
    ])

    // Calculate average ratings for projects
    const projectsWithRatings = projects.map(project => {
      const avgRating = project.ratings.length > 0
        ? project.ratings.reduce((sum, r) => sum + r.rating, 0) / project.ratings.length
        : 0

      return {
        ...project,
        avgRating: parseFloat(avgRating.toFixed(1)),
        ratings: undefined
      }
    })

    // Calculate user statistics
    const userStats = await prisma.rating.aggregate({
      where: {
        project: {
          userId: id
        }
      },
      _avg: {
        rating: true
      },
      _count: {
        rating: true
      }
    })

    const projectsPages = Math.ceil(totalProjects / projectsLimit)

    res.status(200).json({
      success: true,
      data: {
        user: {
          ...user,
          stats: {
            totalProjects: user._count.projects,
            totalRatingsGiven: user._count.ratings,
            totalRatingsReceived: userStats._count.rating,
            averageRating: userStats._avg.rating ? parseFloat(userStats._avg.rating.toFixed(1)) : 0
          }
        },
        projects: projectsWithRatings,
        projectsPagination: {
          current: parseInt(projectsPage),
          total: projectsPages,
          hasNext: projectsPage < projectsPages,
          hasPrev: projectsPage > 1,
          totalItems: totalProjects
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get current user's dashboard data
// @route   GET /api/users/dashboard
// @access  Private
export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id

    // Get user's projects with ratings
    const projects = await prisma.project.findMany({
      where: { userId },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        },
        projectCategories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                color: true,
                icon: true
              }
            }
          }
        },
        _count: {
          select: {
            ratings: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate project statistics
    const projectsWithStats = projects.map(project => {
      const avgRating = project.ratings.length > 0
        ? project.ratings.reduce((sum, r) => sum + r.rating, 0) / project.ratings.length
        : 0

      return {
        ...project,
        avgRating: parseFloat(avgRating.toFixed(1)),
        recentRatings: project.ratings.slice(0, 3) // Latest 3 ratings
      }
    })

    // Get overall user statistics
    const [totalRatingsReceived, totalRatingsGiven, recentActivity] = await Promise.all([
      prisma.rating.count({
        where: {
          project: {
            userId
          }
        }
      }),
      prisma.rating.count({
        where: { userId }
      }),
      prisma.rating.findMany({
        where: {
          OR: [
            { userId },
            {
              project: {
                userId
              }
            }
          ]
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
          project: {
            select: {
              id: true,
              title: true,
              userId: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      })
    ])

    // Calculate average rating across all projects
    const overallStats = await prisma.rating.aggregate({
      where: {
        project: {
          userId
        }
      },
      _avg: {
        rating: true
      }
    })

    res.status(200).json({
      success: true,
      data: {
        projects: projectsWithStats,
        statistics: {
          totalProjects: projects.length,
          publishedProjects: projects.filter(p => p.published).length,
          featuredProjects: projects.filter(p => p.featured).length,
          totalRatingsReceived,
          totalRatingsGiven,
          averageRating: overallStats._avg.rating ? parseFloat(overallStats._avg.rating.toFixed(1)) : 0
        },
        recentActivity
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Public
export const getLeaderboard = async (req, res, next) => {
  try {
    const { limit = 10, period = 'all' } = req.query

    // Calculate date filter based on period
    let dateFilter = {}
    const now = new Date()
    switch (period) {
      case 'week':
        dateFilter = {
          createdAt: {
            gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          }
        }
        break
      case 'month':
        dateFilter = {
          createdAt: {
            gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          }
        }
        break
      case 'year':
        dateFilter = {
          createdAt: {
            gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
          }
        }
        break
      default:
        // all time
        break
    }

    // Get users with their project and rating statistics
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        avatar: true,
        bio: true,
        projects: {
          where: {
            published: true,
            ...dateFilter
          },
          include: {
            ratings: {
              select: {
                rating: true
              }
            }
          }
        },
        _count: {
          select: {
            ratings: {
              where: dateFilter
            }
          }
        }
      },
      take: parseInt(limit) * 2 // Get more to filter out inactive users
    })

    // Calculate leaderboard metrics
    const leaderboard = users
      .map(user => {
        const totalProjects = user.projects.length
        const totalRatings = user.projects.reduce((sum, project) => sum + project.ratings.length, 0)
        const avgRating = totalRatings > 0
          ? user.projects.reduce((sum, project) => {
              const projectAvg = project.ratings.length > 0
                ? project.ratings.reduce((pSum, r) => pSum + r.rating, 0) / project.ratings.length
                : 0
              return sum + projectAvg
            }, 0) / user.projects.filter(p => p.ratings.length > 0).length
          : 0

        const score = (totalProjects * 10) + (totalRatings * 5) + (avgRating * 20)

        return {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          bio: user.bio,
          stats: {
            totalProjects,
            totalRatings,
            ratingsGiven: user._count.ratings,
            averageRating: parseFloat(avgRating.toFixed(1))
          },
          score: parseFloat(score.toFixed(1))
        }
      })
      .filter(user => user.stats.totalProjects > 0) // Only users with projects
      .sort((a, b) => b.score - a.score)
      .slice(0, parseInt(limit))
      .map((user, index) => ({
        ...user,
        rank: index + 1
      }))

    res.status(200).json({
      success: true,
      data: {
        leaderboard,
        period,
        generatedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    next(error)
  }
}

// Routes
router.get('/leaderboard', getLeaderboard)
router.get('/dashboard', protect, getDashboard)
router.get('/:id', optional, getUser)
router.get('/', getUsers)

export default router 