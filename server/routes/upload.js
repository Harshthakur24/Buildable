import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// Ensure upload directory exists
const uploadDir = 'uploads'
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(uploadDir, req.params.type || 'general')
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`)
  }
})

// File filter for images only
const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed!'), false)
  }
}

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only one file at a time
  },
  fileFilter: fileFilter
})

// @desc    Upload single image
// @route   POST /api/upload/:type
// @access  Private
export const uploadImage = async (req, res, next) => {
  try {
    const { type } = req.params
    
    // Validate upload type
    const allowedTypes = ['avatars', 'projects', 'general']
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid upload type. Allowed types: avatars, projects, general'
      })
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      })
    }

    // Construct file URL
    const baseUrl = process.env.FRONTEND_URL || `http://localhost:${process.env.PORT || 5000}`
    const fileUrl = `${baseUrl}/uploads/${type}/${req.file.filename}`

    res.status(200).json({
      success: true,
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: fileUrl,
        path: req.file.path
      },
      message: 'File uploaded successfully'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Upload multiple images
// @route   POST /api/upload/:type/multiple
// @access  Private
export const uploadMultipleImages = async (req, res, next) => {
  try {
    const { type } = req.params
    
    // Validate upload type
    const allowedTypes = ['projects', 'general']
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid upload type. Allowed types: projects, general'
      })
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded'
      })
    }

    // Process uploaded files
    const baseUrl = process.env.FRONTEND_URL || `http://localhost:${process.env.PORT || 5000}`
    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      url: `${baseUrl}/uploads/${type}/${file.filename}`,
      path: file.path
    }))

    res.status(200).json({
      success: true,
      data: {
        files: uploadedFiles,
        count: uploadedFiles.length
      },
      message: `${uploadedFiles.length} files uploaded successfully`
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete uploaded file
// @route   DELETE /api/upload/:type/:filename
// @access  Private
export const deleteFile = async (req, res, next) => {
  try {
    const { type, filename } = req.params
    
    // Validate upload type
    const allowedTypes = ['avatars', 'projects', 'general']
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid upload type'
      })
    }

    // Construct file path
    const filePath = path.join(uploadDir, type, filename)
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      })
    }

    // Delete file
    fs.unlinkSync(filePath)

    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get file info
// @route   GET /api/upload/:type/:filename/info
// @access  Public
export const getFileInfo = async (req, res, next) => {
  try {
    const { type, filename } = req.params
    
    // Validate upload type
    const allowedTypes = ['avatars', 'projects', 'general']
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid upload type'
      })
    }

    // Construct file path
    const filePath = path.join(uploadDir, type, filename)
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      })
    }

    // Get file stats
    const stats = fs.statSync(filePath)
    const baseUrl = process.env.FRONTEND_URL || `http://localhost:${process.env.PORT || 5000}`

    res.status(200).json({
      success: true,
      data: {
        filename,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        url: `${baseUrl}/uploads/${type}/${filename}`,
        type
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Validate image URL
// @route   POST /api/upload/validate-url
// @access  Private
export const validateImageUrl = async (req, res, next) => {
  try {
    const { url } = req.body

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required'
      })
    }

    // Basic URL validation
    try {
      new URL(url)
    } catch {
      return res.status(400).json({
        success: false,
        error: 'Invalid URL format'
      })
    }

    // Check if URL points to an image (basic check)
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
    const hasImageExtension = imageExtensions.some(ext => 
      url.toLowerCase().includes(ext)
    )

    res.status(200).json({
      success: true,
      data: {
        url,
        isValid: true,
        hasImageExtension,
        recommendations: hasImageExtension 
          ? [] 
          : ['Consider using a direct link to an image file', 'Ensure the URL is publicly accessible']
      },
      message: 'URL validation completed'
    })
  } catch (error) {
    next(error)
  }
}

// Middleware for handling multer errors
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          error: 'File too large. Maximum size is 5MB.'
        })
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          error: 'Too many files. Maximum is 5 files.'
        })
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          error: 'Unexpected field name.'
        })
      default:
        return res.status(400).json({
          success: false,
          error: 'File upload error.'
        })
    }
  } else if (err) {
    return res.status(400).json({
      success: false,
      error: err.message
    })
  }
  next()
}

// Routes
router.post('/validate-url', protect, validateImageUrl)
router.post('/:type', protect, upload.single('image'), handleMulterError, uploadImage)
router.post('/:type/multiple', protect, upload.array('images', 5), handleMulterError, uploadMultipleImages)
router.delete('/:type/:filename', protect, deleteFile)
router.get('/:type/:filename/info', getFileInfo)

// Static file serving middleware
router.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

export default router 