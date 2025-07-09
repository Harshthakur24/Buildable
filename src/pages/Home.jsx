import { useAuth } from '../contexts/AuthContext'
import Footer from "../components/Footer"
import HeroSection from "../components/HeroSection"
import HeroSection2 from "../components/HeroSection2"
import List from "../components/List"
import Navbar from "../components/Navbar"
import OverlapCard from "../components/OverlapCard"
import ProjectSubmission from "../components/ProjectSubmission"
import ProjectGallery from "../components/ProjectGallery"

// Sample project data for demonstration
const sampleProjects = [
  {
    id: "1",
    title: "React Dashboard",
    description: "A beautiful, responsive dashboard built with React and TypeScript. Features real-time data visualization, user management, and dark mode support.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    demoUrl: "https://react-dashboard-demo.com",
    githubUrl: "https://github.com/user/react-dashboard",
    techStack: ["React", "TypeScript", "Tailwind CSS", "Chart.js"],
    featured: true,
    published: true,
    createdAt: new Date("2024-01-15"),
    user: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b002?w=64&h=64&fit=crop&crop=face"
    },
    ratings: [
      { rating: 5, userId: "u1" },
      { rating: 4, userId: "u2" },
      { rating: 5, userId: "u3" }
    ],
    projectCategories: [
      { category: { name: "Web Apps" } }
    ]
  },
  {
    id: "2",
    title: "AI Image Generator",
    description: "Generate stunning images from text prompts using cutting-edge AI models. Built with Python and deployed on the cloud.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
    demoUrl: "https://ai-image-gen.com",
    githubUrl: "https://github.com/user/ai-image-generator",
    techStack: ["Python", "FastAPI", "PyTorch", "Docker"],
    featured: false,
    published: true,
    createdAt: new Date("2024-01-10"),
    user: {
      name: "Alex Rodriguez",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
    },
    ratings: [
      { rating: 5, userId: "u1" },
      { rating: 5, userId: "u2" }
    ],
    projectCategories: [
      { category: { name: "AI/ML" } }
    ]
  },
  {
    id: "3",
    title: "Mobile Weather App",
    description: "A sleek weather app for iOS and Android with beautiful animations and accurate forecasts.",
    image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&h=400&fit=crop",
    demoUrl: "https://weather-app-demo.com",
    githubUrl: "https://github.com/user/weather-app",
    techStack: ["React Native", "Expo", "Weather API"],
    featured: false,
    published: true,
    createdAt: new Date("2024-01-05"),
    user: {
      name: "Maya Patel",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face"
    },
    ratings: [
      { rating: 4, userId: "u1" },
      { rating: 4, userId: "u2" },
      { rating: 3, userId: "u3" }
    ],
    projectCategories: [
      { category: { name: "Mobile Apps" } }
    ]
  },
  {
    id: "4",
    title: "VSCode Theme Extension",
    description: "A beautiful dark theme for Visual Studio Code with syntax highlighting optimized for modern web development.",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&h=400&fit=crop",
    demoUrl: null,
    githubUrl: "https://github.com/user/vscode-theme",
    techStack: ["JSON", "CSS", "JavaScript"],
    featured: false,
    published: true,
    createdAt: new Date("2024-01-01"),
    user: {
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"
    },
    ratings: [
      { rating: 5, userId: "u1" }
    ],
    projectCategories: [
      { category: { name: "Developer Tools" } }
    ]
  }
]

const Home = () => {
  const { isAuthenticated } = useAuth()

  const handleProjectRate = (projectId, rating) => {
    if (!isAuthenticated) {
      // Navigate to login page instead of opening modal
      window.location.href = '/login'
      return
    }
    console.log(`Rating project ${projectId} with ${rating} stars`)
    // TODO: Implement actual rating logic with API
  }

  return (
    <main>
      <Navbar />
      <HeroSection />
      <HeroSection2 />
      <OverlapCard />
      
      {/* Project Gallery Section */}
      <div className="bg-gray-50 py-16">
        <ProjectGallery 
          projects={sampleProjects}
          onProjectRate={handleProjectRate}
        />
      </div>
      
      {/* <Video/> */}
      <List/>
      <ProjectSubmission />
      <Footer />
    </main>
  )
}

export default Home 