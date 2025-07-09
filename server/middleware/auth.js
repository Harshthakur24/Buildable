import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const protect = async (req, res, next) => {
  try {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      })
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          bio: true,
          github: true,
          website: true,
          twitter: true,
          createdAt: true
        }
      })

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'User not found'
        })
      }

      req.user = user
      next()
    } catch (_err) {
      return res.status(401).json({
        success: false,
        error: `Not authorized to access this route (1) ${_err}`
      })
    }
  } catch (_error) {
    return res.status(500).json({
      success: false,
      error: `Server error in authentication (2) ${_error}`
    })
  }
}

export const optional = async (req, res, next) => {
  try {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
            bio: true,
            github: true,
            website: true,
            twitter: true,
            createdAt: true
          }
        })
        
        if (user) {
          req.user = user
        }
      } catch (_err) {
        return res.status(401).json({
          success: false,
          error: `Not authorized to access this route (3) ${_err}`
        })
      }
    }
    
    next()
  } catch (_error) {
    return res.status(500).json({
      success: false,
      error: `Server error in authentication (4) ${_error}`
    })
  }
} 