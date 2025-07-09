import express from 'express'
import { PrismaClient } from '@prisma/client'
import { protect, optional } from '../middleware/auth.js'

const router = express.Router()
const prisma = new PrismaClient()

// @desc    Get platform statistics
// @route   GET /api/analytics/stats
// @access  Public
export const getPlatformStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalProjects,
      totalRatings,
      totalCategories,
      featuredProjects,
      recentProjects,
      topRatedProjects
    ] = await Promise.all([
      prisma.user.count(),
      prisma.project.count({ where: { published: true } }),
      prisma.rating.count(),
      prisma.category.count(),
      prisma.project.count({ where: { featured: true, published: true } }),
      prisma.project.count({
        where: {
          published: true,
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      }),
      prisma.project.findMany({
        where: { published: true },
        include: {
          ratings: {
            select: { rating: true }
          },
          _count: {
            select: { ratings: true }
          }
        },
        take: 3
      })
    ])

    // Calculate top rated projects
    const projectsWithRatings = topRatedProjects
      .map(project => {
        const avgRating = project.ratings.length > 0
          ? project.ratings.reduce((sum, r) => sum + r.rating, 0) / project.ratings.length
          : 0
        
        return {
          id: project.id,
          title: project.title,
          avgRating: parseFloat(avgRating.toFixed(1)),
          totalRatings: project._count.ratings
        }
      })
      .filter(p => p.totalRatings >= 3) // At least 3 ratings
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 3)

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalProjects,
          totalRatings,
          totalCategories,
          featuredProjects,
          recentProjects
        },
        topRatedProjects: projectsWithRatings,
        generatedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get category statistics
// @route   GET /api/analytics/categories
// @access  Public
export const getCategoryStats = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        projectCategories: {
          include: {
            project: {
              where: { published: true },
              include: {
                ratings: {
                  select: { rating: true }
                }
              }
            }
          }
        }
      }
    })

    const categoryStats = categories.map(category => {
      const projects = category.projectCategories.map(pc => pc.project)
      const totalProjects = projects.length
      const totalRatings = projects.reduce((sum, p) => sum + p.ratings.length, 0)
      const avgRating = totalRatings > 0
        ? projects.reduce((sum, p) => {
            const projectAvg = p.ratings.length > 0
              ? p.ratings.reduce((pSum, r) => pSum + r.rating, 0) / p.ratings.length
              : 0
            return sum + projectAvg
          }, 0) / projects.filter(p => p.ratings.length > 0).length || 0
        : 0

      return {
        id: category.id,
        name: category.name,
        color: category.color,
        icon: category.icon,
        stats: {
          totalProjects,
          totalRatings,
          averageRating: parseFloat(avgRating.toFixed(1))
        }
      }
    })

    // Sort by total projects
    categoryStats.sort((a, b) => b.stats.totalProjects - a.stats.totalProjects)

    res.status(200).json({
      success: true,
      data: categoryStats
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get trending projects
// @route   GET /api/analytics/trending
// @access  Public
export const getTrendingProjects = async (req, res, next) => {
  try {
    const { limit = 10, period = 'week' } = req.query

    // Calculate date range
    const now = new Date()
    let startDate
    switch (period) {
      case 'day':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
    }

    // Get projects with recent ratings
    const projects = await prisma.project.findMany({
      where: {
        published: true,
        ratings: {
          some: {
            createdAt: {
              gte: startDate
            }
          }
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        ratings: {
          where: {
            createdAt: {
              gte: startDate
            }
          },
          select: {
            rating: true,
            createdAt: true
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
      take: parseInt(limit) * 2 // Get more to filter
    })

    // Calculate trending score
    const trendingProjects = projects
      .map(project => {
        const recentRatings = project.ratings
        const totalRecentRatings = recentRatings.length
        const avgRecentRating = totalRecentRatings > 0
          ? recentRatings.reduce((sum, r) => sum + r.rating, 0) / totalRecentRatings
          : 0

        // Trending score = recent ratings count * average rating * recency factor
        const recencyFactor = 1.5 // Boost for recent activity
        const trendingScore = totalRecentRatings * avgRecentRating * recencyFactor

        return {
          ...project,
          trendingScore,
          recentStats: {
            recentRatings: totalRecentRatings,
            avgRecentRating: parseFloat(avgRecentRating.toFixed(1))
          },
          ratings: undefined // Remove ratings from response
        }
      })
      .filter(p => p.recentStats.recentRatings >= 2) // At least 2 recent ratings
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, parseInt(limit))

    res.status(200).json({
      success: true,
      data: {
        projects: trendingProjects,
        period,
        generatedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get user activity analytics
// @route   GET /api/analytics/activity
// @access  Public
export const getActivityAnalytics = async (req, res, next) => {
  try {
    const { period = 'month' } = req.query

    // Calculate date range
    const now = new Date()
    let startDate
    let groupBy
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        groupBy = 'day'
        break
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        groupBy = 'day'
        break
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        groupBy = 'month'
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        groupBy = 'day'
        break
    }

    // Get activity data
    const [userRegistrations, projectCreations, ratingsGiven] = await Promise.all([
      prisma.user.findMany({
        where: {
          createdAt: {
            gte: startDate
          }
        },
        select: {
          createdAt: true
        }
      }),
      prisma.project.findMany({
        where: {
          createdAt: {
            gte: startDate
          }
        },
        select: {
          createdAt: true
        }
      }),
      prisma.rating.findMany({
        where: {
          createdAt: {
            gte: startDate
          }
        },
        select: {
          createdAt: true
        }
      })
    ])

    // Group data by time period
    const groupData = (data, groupBy) => {
      const grouped = {}
      data.forEach(item => {
        let key
        if (groupBy === 'day') {
          key = item.createdAt.toISOString().split('T')[0]
        } else {
          key = `${item.createdAt.getFullYear()}-${String(item.createdAt.getMonth() + 1).padStart(2, '0')}`
        }
        grouped[key] = (grouped[key] || 0) + 1
      })
      return grouped
    }

    const activityData = {
      userRegistrations: groupData(userRegistrations, groupBy),
      projectCreations: groupData(projectCreations, groupBy),
      ratingsGiven: groupData(ratingsGiven, groupBy)
    }

    res.status(200).json({
      success: true,
      data: {
        activity: activityData,
        period,
        groupBy,
        summary: {
          totalUserRegistrations: userRegistrations.length,
          totalProjectCreations: projectCreations.length,
          totalRatingsGiven: ratingsGiven.length
        },
        generatedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get search analytics (if user is authenticated)
// @route   GET /api/analytics/search
// @access  Private
export const getSearchAnalytics = async (req, res, next) => {
  try {
    // This is a placeholder for search analytics
    // In a real app, you'd track search queries and popular terms
    
    const mockSearchData = {
      popularTechs: [
        { name: 'React', searches: 145 },
        { name: 'Node.js', searches: 128 },
        { name: 'TypeScript', searches: 98 },
        { name: 'Python', searches: 87 },
        { name: 'Next.js', searches: 76 }
      ],
      popularCategories: [
        { name: 'Web Apps', searches: 203 },
        { name: 'Mobile Apps', searches: 156 },
        { name: 'AI/ML', searches: 134 },
        { name: 'APIs', searches: 89 },
        { name: 'Games', searches: 67 }
      ],
      searchTrends: {
        totalSearches: 1247,
        uniqueSearchers: 456,
        avgSearchesPerUser: 2.7
      }
    }

    res.status(200).json({
      success: true,
      data: mockSearchData,
      message: 'This is mock data. Implement actual search tracking for real analytics.'
    })
  } catch (error) {
    next(error)
  }
}

// Routes
router.get('/stats', getPlatformStats)
router.get('/categories', getCategoryStats)
router.get('/trending', getTrendingProjects)
router.get('/activity', getActivityAnalytics)
router.get('/search', protect, getSearchAnalytics)

export default router 