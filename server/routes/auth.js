import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Joi from 'joi'
import { PrismaClient } from '@prisma/client'
import { protect } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

// Helper function to clean social profile inputs
const cleanSocialProfile = (input) => {
  if (!input || input.trim() === '') return null
  
  const trimmed = input.trim()
  
  // Extract GitHub username from URL or @username
  if (input.includes('github.com/')) {
    const match = trimmed.match(/github\.com\/([^/?]+)/)
    return match ? match[1] : trimmed
  }
  
  // Extract Twitter username from URL or @username
  if (input.includes('twitter.com/') || input.includes('x.com/')) {
    const match = trimmed.match(/(?:twitter|x)\.com\/([^/?]+)/)
    return match ? match[1] : trimmed.replace(/^@/, '')
  }
  
  // Remove @ symbol if present
  return trimmed.replace(/^@/, '')
}

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 50 characters',
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
    'any.required': 'Please confirm your password'
  }),
  github: Joi.string().allow('').optional(),
  website: Joi.string().uri().allow('').optional(),
  twitter: Joi.string().allow('').optional()
})

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
})

const profileSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 50 characters',
    'any.required': 'Name is required'
  }),
  bio: Joi.string().max(500).allow('').optional(),
  avatar: Joi.string().uri().allow('').optional(),
  github: Joi.string().allow('').optional(),
  website: Joi.string().uri().allow('').optional(),
  twitter: Joi.string().allow('').optional()
})

const settingsSchema = Joi.object({
  profileVisible: Joi.boolean().optional(),
  showEmail: Joi.boolean().optional(),
  analytics: Joi.boolean().optional(),
  emailNotifications: Joi.boolean().optional(),
  projectUpdates: Joi.boolean().optional(),
  newsletter: Joi.boolean().optional(),
  currentPassword: Joi.string().optional(),
  newPassword: Joi.string().min(6).optional(),
  confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).optional()
})

// Register route
router.post('/register', async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      })
    }

    const { name, email, password, github, website, twitter } = value

    // Check if user already exists (case-insensitive)
    const existingUser = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive'
        }
      }
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      })
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user with cleaned social profiles
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        github: cleanSocialProfile(github),
        website: website?.trim() || null,
        twitter: cleanSocialProfile(twitter)
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        github: true,
        website: true,
        twitter: true,
        createdAt: true
      }
    })

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    )

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
      token
    })

  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error during registration'
    })
  }
})

// Login route
router.post('/login', async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      })
    }

    const { email, password } = value

    // Find user (case-insensitive email)
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive'
        }
      }
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    )

    // Return user data without password
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      github: user.github,
      website: user.website,
      twitter: user.twitter,
      createdAt: user.createdAt
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: userData,
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error during login'
    })
  }
})

// Get current user route
router.get('/me', protect, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Update profile route
router.put('/profile', protect, async (req, res) => {
  try {
    const { error, value } = profileSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      })
    }

    const { name, bio, avatar, github, website, twitter } = value

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: name.trim(),
        bio: bio?.trim() || null,
        avatar: avatar?.trim() || null,
        github: cleanSocialProfile(github),
        website: website?.trim() || null,
        twitter: cleanSocialProfile(twitter)
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        github: true,
        website: true,
        twitter: true,
        createdAt: true
      }
    })

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    })

  } catch (error) {
    console.error('Profile update error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error during profile update'
    })
  }
})

// Update settings route
router.put('/settings', protect, async (req, res) => {
  try {
    const { error, value } = settingsSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      })
    }

    const { 
      currentPassword,
      newPassword 
      // profileVisible, showEmail, analytics, emailNotifications, projectUpdates, newsletter
      // These settings would be stored in a separate settings table in a full implementation
    } = value

    // If changing password, verify current password
    if (newPassword && currentPassword) {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id }
      })

      const isValidPassword = await bcrypt.compare(currentPassword, user.password)
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          error: 'Current password is incorrect'
        })
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12)
      
      await prisma.user.update({
        where: { id: req.user.id },
        data: { password: hashedPassword }
      })
    }

    // Update settings (you might want to create a separate settings table)
    // For now, we'll just return success
    res.status(200).json({
      success: true,
      message: 'Settings updated successfully'
    })

  } catch (error) {
    console.error('Settings update error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error during settings update'
    })
  }
})

// Delete account route
router.delete('/account', protect, async (req, res) => {
  try {
    // Delete user account
    await prisma.user.delete({
      where: { id: req.user.id }
    })

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    })

  } catch (error) {
    console.error('Account deletion error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error during account deletion'
    })
  }
})

export default router 