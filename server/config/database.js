import { PrismaClient } from '@prisma/client'

// Create Prisma client instance
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  errorFormat: 'colorless'
})

// Handle graceful shutdown
const gracefulShutdown = async () => {
  console.log('🔄 Shutting down gracefully...')
  await prisma.$disconnect()
  console.log('✅ Database connection closed.')
  process.exit(0)
}

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)

// Connect to database
export const connectDatabase = async () => {
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    process.exit(1)
  }
}

export default prisma 