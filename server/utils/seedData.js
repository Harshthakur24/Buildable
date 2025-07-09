import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Sample categories data
const categories = [
  { name: 'Web Apps', color: '#3b82f6', icon: '🌐' },
  { name: 'Mobile Apps', color: '#10b981', icon: '📱' },
  { name: 'AI/ML', color: '#8b5cf6', icon: '🤖' },
  { name: 'Developer Tools', color: '#f59e0b', icon: '🛠️' },
  { name: 'Games', color: '#ef4444', icon: '🎮' },
  { name: 'APIs', color: '#06b6d4', icon: '🔌' },
  { name: 'Open Source', color: '#84cc16', icon: '📦' },
  { name: 'Design Tools', color: '#ec4899', icon: '🎨' }
]

// Sample users data
const sampleUsers = [
  {
    name: 'Alex Rodriguez',
    email: 'alex@example.com',
    password: 'password123',
    bio: 'Full-stack developer passionate about building amazing user experiences.',
    github: 'alexrodriguez',
    website: 'https://alexdev.com',
    twitter: 'alexrodriguez_dev'
  },
  {
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    password: 'password123',
    bio: 'Frontend developer & UI/UX designer. Love creating beautiful interfaces.',
    github: 'sarahchen',
    website: 'https://sarahchen.design'
  },
  {
    name: 'Maya Patel',
    email: 'maya@example.com',
    password: 'password123',
    bio: 'Mobile app developer specializing in React Native and Flutter.',
    github: 'mayapatel',
    twitter: 'maya_codes'
  }
]

// Sample projects data
const sampleProjects = [
  {
    title: 'TaskFlow - Project Management App',
    description: 'A modern project management application built with React and Node.js. Features real-time collaboration, task tracking, and team analytics.',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop',
    demoUrl: 'https://taskflow-demo.com',
    githubUrl: 'https://github.com/user/taskflow',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Socket.io', 'TypeScript'],
    featured: true,
    published: true,
    categories: ['Web Apps', 'Developer Tools']
  },
  {
    title: 'WeatherWise Mobile App',
    description: 'Beautiful weather app with detailed forecasts, weather maps, and location-based alerts. Built with React Native.',
    image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&h=400&fit=crop',
    demoUrl: 'https://weatherwise-app.com',
    githubUrl: 'https://github.com/user/weatherwise',
    techStack: ['React Native', 'Expo', 'Weather API', 'Redux'],
    featured: false,
    published: true,
    categories: ['Mobile Apps']
  },
  {
    title: 'AI Code Assistant',
    description: 'An intelligent code completion and review tool powered by machine learning. Helps developers write better code faster.',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop',
    githubUrl: 'https://github.com/user/ai-code-assistant',
    techStack: ['Python', 'TensorFlow', 'FastAPI', 'Docker'],
    featured: true,
    published: true,
    categories: ['AI/ML', 'Developer Tools']
  },
  {
    title: 'RetroGame Engine',
    description: 'A lightweight 2D game engine for creating retro-style games. Built with JavaScript and WebGL.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop',
    demoUrl: 'https://retrogame-engine.com',
    githubUrl: 'https://github.com/user/retrogame-engine',
    techStack: ['JavaScript', 'WebGL', 'Canvas API'],
    featured: false,
    published: true,
    categories: ['Games', 'Open Source']
  },
  {
    title: 'DesignSync - Figma Plugin',
    description: 'A Figma plugin that automatically syncs design tokens with your codebase. Streamlines the design-to-development workflow.',
    image: 'https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=600&h=400&fit=crop',
    githubUrl: 'https://github.com/user/designsync',
    techStack: ['TypeScript', 'Figma API', 'Node.js'],
    featured: false,
    published: true,
    categories: ['Design Tools', 'Developer Tools']
  },
  {
    title: 'GraphQL Analytics API',
    description: 'A powerful GraphQL API for analytics and reporting. Features real-time data aggregation and custom dashboard creation.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    demoUrl: 'https://graphql-analytics.com',
    githubUrl: 'https://github.com/user/graphql-analytics',
    techStack: ['GraphQL', 'Node.js', 'PostgreSQL', 'Redis'],
    featured: true,
    published: true,
    categories: ['APIs', 'Developer Tools']
  }
]

// Function to seed the database
export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...')

    // Clear existing data
    await prisma.rating.deleteMany()
    await prisma.projectCategory.deleteMany()
    await prisma.project.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()

    console.log('🗑️  Cleared existing data')

    // Create categories
    console.log('📂 Creating categories...')
    const createdCategories = []
    for (const category of categories) {
      const created = await prisma.category.create({
        data: category
      })
      createdCategories.push(created)
      console.log(`   ✅ Created category: ${category.name}`)
    }

    // Create users
    console.log('👥 Creating users...')
    const createdUsers = []
    for (const user of sampleUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 12)
      const created = await prisma.user.create({
        data: {
          ...user,
          password: hashedPassword
        }
      })
      createdUsers.push(created)
      console.log(`   ✅ Created user: ${user.name}`)
    }

    // Create projects
    console.log('🚀 Creating projects...')
    for (let i = 0; i < sampleProjects.length; i++) {
      const project = sampleProjects[i]
      const user = createdUsers[i % createdUsers.length]
      
      // Find categories for this project
      const projectCategories = createdCategories.filter(cat => 
        project.categories.includes(cat.name)
      )

      const { categories: _, ...projectData } = project
      
      const created = await prisma.project.create({
        data: {
          ...projectData,
          userId: user.id,
          projectCategories: {
            create: projectCategories.map(cat => ({
              categoryId: cat.id
            }))
          }
        }
      })
      console.log(`   ✅ Created project: ${project.title}`)

      // Add sample ratings
      const numRatings = Math.floor(Math.random() * 5) + 3 // 3-7 ratings
      for (let j = 0; j < numRatings; j++) {
        const ratingUser = createdUsers[Math.floor(Math.random() * createdUsers.length)]
        if (ratingUser.id !== user.id) { // Don't let users rate their own projects
          try {
            await prisma.rating.create({
              data: {
                rating: Math.floor(Math.random() * 5) + 1, // 1-5 stars
                comment: Math.random() > 0.5 ? 'Great project! Really well executed.' : undefined,
                userId: ratingUser.id,
                projectId: created.id
              }
            })
          } catch (error) {
            // Skip if user already rated this project
          }
        }
      }
    }

    console.log('✅ Database seeded successfully!')
    console.log('\n📊 Seed Summary:')
    console.log(`   Categories: ${categories.length}`)
    console.log(`   Users: ${sampleUsers.length}`)
    console.log(`   Projects: ${sampleProjects.length}`)
    console.log('   Ratings: Added randomly to projects')
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run seed if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Seeding completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error)
      process.exit(1)
    })
}

export default seedDatabase 