import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Import routes
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import projectRoutes from './routes/projects.js'
import categoryRoutes from './routes/categories.js'
import ratingRoutes from './routes/ratings.js'
import uploadRoutes from './routes/upload.js'
import analyticsRoutes from './routes/analytics.js'

// Import middleware
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'
import { databaseFallback } from './middleware/databaseFallback.js'

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const NODE_ENV = process.env.NODE_ENV || 'development'

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

// Auth rate limiting - more restrictive
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

// Middleware
app.use(helmet()) // Security headers
app.use(compression()) // Gzip compression
app.use(morgan('combined')) // Logging

// CORS setup
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'https://buildable-omega.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      console.log('Blocked by CORS:', origin)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Apply rate limiting
app.use(limiter)
app.use('/api/auth', authLimiter)

// Add database fallback middleware
app.use(databaseFallback)

// Serve static files from dist in production
if (NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist')
  app.use(express.static(distPath))
  
  // Serve uploaded files
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
}

// Health check with database status
app.get('/health', async (req, res) => {
  try {
    // Try to check database connection
    let dbStatus = 'unknown'
    try {
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()
      await prisma.$connect()
      dbStatus = 'connected'
      await prisma.$disconnect()
    } catch (dbError) {
      dbStatus = 'disconnected'
      console.error('Database health check failed:', dbError.message)
    }

    res.status(200).json({
      success: true,
      message: 'Buildable API is running!',
      timestamp: new Date().toISOString(),
      environment: NODE_ENV,
      database: dbStatus
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message
    })
  }
})

// API Documentation endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Buildable API v1.0.0',
    documentation: '/api/docs',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      projects: '/api/projects',
      categories: '/api/categories',
      ratings: '/api/ratings',
      upload: '/api/upload',
      analytics: '/api/analytics'
    }
  })
})

// Routes with error handling
try {
  app.use('/api/auth', authRoutes)
  app.use('/api/users', userRoutes)
  app.use('/api/projects', projectRoutes)
  app.use('/api/categories', categoryRoutes)
  app.use('/api/ratings', ratingRoutes)
  app.use('/api/upload', uploadRoutes)
  app.use('/api/analytics', analyticsRoutes)
} catch (error) {
  console.error('Error setting up routes:', error.message)
}

// Catch all handler: send back React's index.html file in production
if (NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    try {
      res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
    } catch {
      res.status(500).json({ error: 'Failed to serve application' })
    }
  })
}

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

// Start server (only if not in serverless environment)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`
🚀 Buildable Server started successfully!
📍 Environment: ${NODE_ENV}
🌐 Port: ${PORT}
🔗 API: http://localhost:${PORT}/api
❤️  Health: http://localhost:${PORT}/health
📚 Docs: http://localhost:${PORT}/api
${NODE_ENV === 'production' ? '🌍 Frontend: http://localhost:' + PORT : ''}
    `)
  })
}

export default app 