// Database fallback middleware
// This prevents 500 errors when database is not available

export const databaseFallback = (req, res, next) => {
  // Check if this is a database-dependent route
  const dbRoutes = ['/api/auth', '/api/users', '/api/projects', '/api/categories', '/api/ratings', '/api/analytics']
  const isDbRoute = dbRoutes.some(route => req.path.startsWith(route))
  
  if (isDbRoute && (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'file:./dev.db')) {
    // If in production without proper database, return helpful error
    if (process.env.NODE_ENV === 'production') {
      return res.status(503).json({
        success: false,
        error: 'Database not configured',
        message: 'Please configure PostgreSQL database in environment variables',
        setup_guide: 'https://supabase.com for free PostgreSQL database'
      })
    }
  }
  
  next()
} 