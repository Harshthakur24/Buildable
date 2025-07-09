# DevShowcase API Server

A robust REST API backend for the DevShowcase developer community platform, built with Node.js, Express, PostgreSQL, and Prisma.

## 🚀 Features

- **Authentication & Authorization** - JWT-based auth with bcrypt password hashing
- **Project Management** - Full CRUD operations for developer projects
- **Rating System** - 5-star rating system with comments and statistics
- **Category Management** - Organize projects by technology categories
- **File Upload** - Image upload with validation and optimization
- **User Profiles** - Complete user management with social links
- **Analytics** - Platform statistics and trending projects
- **Leaderboard** - Community ranking system
- **Search & Filtering** - Advanced project discovery
- **Rate Limiting** - API protection and abuse prevention
- **Data Validation** - Comprehensive input validation with Joi
- **Error Handling** - Centralized error management
- **Database Migrations** - Prisma schema management
- **Seed Data** - Sample data for development

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Validation**: Joi
- **File Upload**: Multer
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Morgan
- **Environment**: dotenv

## 📁 Project Structure

```
server/
├── config/           # Configuration files
│   └── database.js   # Database setup
├── docs/            # Documentation
│   └── API_DOCUMENTATION.md
├── middleware/      # Express middleware
│   ├── auth.js      # Authentication middleware
│   ├── errorHandler.js
│   └── notFound.js
├── routes/          # API route handlers
│   ├── auth.js      # Authentication routes
│   ├── users.js     # User management
│   ├── projects.js  # Project CRUD
│   ├── categories.js # Category management
│   ├── ratings.js   # Rating system
│   ├── upload.js    # File upload
│   └── analytics.js # Platform analytics
├── utils/           # Utility functions
│   └── seedData.js  # Database seeding
├── uploads/         # File storage (auto-created)
├── index.js         # Main server file
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd devshowcase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DATABASE_URL="postgresql://username:password@localhost:5432/devshowcase"
   
   # JWT Configuration
   JWT_SECRET="your-super-secret-jwt-key-here"
   JWT_EXPIRE="30d"
   
   # Server Configuration
   PORT=5000
   NODE_ENV="development"
   FRONTEND_URL="http://localhost:5173"
   BASE_URL="http://localhost:5000"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # (Optional) Seed with sample data
   node server/utils/seedData.js
   ```

5. **Start the development server**
   ```bash
   npm run server:dev
   ```

The API will be available at `http://localhost:5000`

### Production Setup

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   ```env
   NODE_ENV="production"
   DATABASE_URL="your-production-database-url"
   JWT_SECRET="your-production-jwt-secret"
   ```

3. **Start production server**
   ```bash
   npm run server
   ```

## 📊 Database Schema

The API uses PostgreSQL with Prisma ORM. Key models include:

- **User** - User accounts with authentication
- **Project** - Developer projects with metadata
- **Category** - Project categorization
- **Rating** - 5-star rating system
- **ProjectCategory** - Many-to-many project-category relation

### Schema Migration

```bash
# After schema changes
npm run db:push

# View database in browser
npm run db:studio
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Register** or **Login** to get a JWT token
2. Include token in requests: `Authorization: Bearer <token>`
3. Token expires in 30 days (configurable)

### Protected Routes

Most routes require authentication. Public routes include:
- `GET /api/projects` - Browse projects
- `GET /api/categories` - List categories
- `GET /api/users/:id` - View user profiles
- `GET /api/analytics/*` - Platform statistics

## 📡 API Endpoints

### Core Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/me` | Get current user | Yes |
| GET | `/api/projects` | List projects | No |
| POST | `/api/projects` | Create project | Yes |
| GET | `/api/projects/:id` | Get project details | No |
| PUT | `/api/projects/:id` | Update project | Yes (owner) |
| DELETE | `/api/projects/:id` | Delete project | Yes (owner) |
| POST | `/api/ratings/project/:id` | Rate project | Yes |
| GET | `/api/categories` | List categories | No |
| GET | `/api/users/leaderboard` | Top users | No |
| POST | `/api/upload/projects` | Upload image | Yes |

For complete API documentation, see [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)

## 🔍 Search & Filtering

The API supports advanced search and filtering:

```javascript
// Search projects
GET /api/projects?search=react&category=Web Apps&sortBy=rating&page=1&limit=12

// Filter by user
GET /api/projects?userId=user_id

// Get featured projects
GET /api/projects/featured?limit=6

// Search users
GET /api/users?search=john&sortBy=projects
```

## 📈 Analytics

Built-in analytics endpoints provide insights:

- **Platform Stats** - Total users, projects, ratings
- **Category Stats** - Project distribution by category
- **Trending Projects** - Projects with recent activity
- **Activity Analytics** - User registration and project creation trends
- **Leaderboard** - Top users by activity and ratings

## 🛡️ Security Features

- **Rate Limiting** - Prevents API abuse
- **Input Validation** - Joi schema validation
- **SQL Injection Protection** - Prisma ORM safety
- **XSS Prevention** - Helmet security headers
- **CORS Configuration** - Cross-origin request control
- **Password Hashing** - bcrypt with salt rounds
- **JWT Security** - Secure token generation

## 📝 Data Validation

All inputs are validated using Joi schemas:

```javascript
// Project creation validation
{
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  techStack: Joi.array().items(Joi.string()).optional(),
  categoryIds: Joi.array().items(Joi.string()).min(1).required()
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | Token expiration time | 30d |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |
| `FRONTEND_URL` | CORS origin URL | http://localhost:5173 |
| `BASE_URL` | API base URL | http://localhost:5000 |

### Rate Limiting

- **General endpoints**: 100 requests per 15 minutes
- **Auth endpoints**: 5 requests per 15 minutes
- **Upload endpoints**: 10 requests per hour

## 📊 Sample Data

Seed the database with sample data for development:

```bash
node server/utils/seedData.js
```

This creates:
- 8 project categories
- 3 sample users
- 6 sample projects with ratings
- Realistic rating distributions

## 🚨 Error Handling

The API uses centralized error handling with proper HTTP status codes:

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## 📦 File Upload

Supports image upload for:
- User avatars (`/api/upload/avatars`)
- Project images (`/api/upload/projects`)
- General files (`/api/upload/general`)

Features:
- File type validation (images only)
- Size limits (5MB max)
- Unique filename generation
- Organized storage structure

## 🔄 Database Seeding

The seeding script provides realistic test data:

```bash
# Clear database and add sample data
node server/utils/seedData.js

# Output:
# 🌱 Starting database seed...
# 🗑️  Cleared existing data
# 📂 Creating categories...
# 👥 Creating users...
# 🚀 Creating projects...
# ✅ Database seeded successfully!
```

## 🧪 Testing

### Manual Testing

Use the provided API documentation to test endpoints with tools like:
- Postman
- Insomnia
- cURL
- Thunder Client (VS Code)

### Sample Requests

```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Get projects
curl http://localhost:5000/api/projects?limit=5

# Upload image
curl -X POST http://localhost:5000/api/upload/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg"
```

## 🚀 Deployment

### Production Checklist

- [ ] Set strong `JWT_SECRET`
- [ ] Configure production database
- [ ] Set `NODE_ENV=production`
- [ ] Configure reverse proxy (nginx)
- [ ] Set up SSL/TLS
- [ ] Configure file storage (AWS S3, etc.)
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "run", "server"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- Create an issue for bugs or feature requests
- Check the [API Documentation](./docs/API_DOCUMENTATION.md) for detailed endpoint information
- Review the codebase for implementation examples

---

**DevShowcase API** - Empowering developers to showcase their work and build community! 🚀 