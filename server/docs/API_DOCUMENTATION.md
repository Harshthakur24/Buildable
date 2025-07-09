# DevShowcase API Documentation

A comprehensive REST API for the DevShowcase developer community platform.

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this format:
```json
{
  "success": true|false,
  "data": {},
  "message": "Optional message",
  "error": "Error message (only on errors)"
}
```

---

## Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "github": "johndoe",
  "website": "https://johndoe.com",
  "twitter": "johndoe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      // ... other user fields
    },
    "token": "jwt_token_here"
  },
  "message": "User registered successfully"
}
```

### Login User
```http
POST /auth/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User
```http
GET /auth/me
```
*Requires authentication*

### Update Profile
```http
PUT /auth/profile
```
*Requires authentication*

**Body:**
```json
{
  "name": "Updated Name",
  "bio": "New bio",
  "avatar": "https://avatar-url.com",
  "github": "newgithub",
  "website": "https://newwebsite.com",
  "twitter": "newtwitter"
}
```

### Change Password
```http
PUT /auth/password
```
*Requires authentication*

**Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

---

## Project Endpoints

### Get All Projects
```http
GET /projects?page=1&limit=12&category=Web%20Apps&featured=true&search=react&sortBy=newest&userId=user_id
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12)
- `category` (string): Filter by category name
- `featured` (boolean): Filter featured projects
- `search` (string): Search in title, description, tech stack
- `sortBy` (string): newest|oldest|rating
- `userId` (string): Filter by user ID

**Response:**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "project_id",
        "title": "Project Title",
        "description": "Project description",
        "image": "https://image-url.com",
        "demoUrl": "https://demo-url.com",
        "githubUrl": "https://github.com/user/repo",
        "techStack": ["React", "Node.js"],
        "featured": false,
        "avgRating": 4.5,
        "user": {
          "id": "user_id",
          "name": "User Name",
          "avatar": "https://avatar-url.com"
        },
        "projectCategories": [
          {
            "category": {
              "id": "category_id",
              "name": "Web Apps",
              "color": "#3b82f6",
              "icon": "🌐"
            }
          }
        ],
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "current": 1,
      "total": 5,
      "hasNext": true,
      "hasPrev": false,
      "totalItems": 50
    }
  }
}
```

### Get Single Project
```http
GET /projects/:id
```

### Create Project
```http
POST /projects
```
*Requires authentication*

**Body:**
```json
{
  "title": "My Awesome Project",
  "description": "A detailed description of the project",
  "image": "https://project-image.com",
  "demoUrl": "https://demo.com",
  "githubUrl": "https://github.com/user/project",
  "techStack": ["React", "Node.js", "PostgreSQL"],
  "categoryIds": ["category_id_1", "category_id_2"]
}
```

### Update Project
```http
PUT /projects/:id
```
*Requires authentication (project owner only)*

### Delete Project
```http
DELETE /projects/:id
```
*Requires authentication (project owner only)*

### Get Featured Projects
```http
GET /projects/featured?limit=6
```

---

## Rating Endpoints

### Get Project Ratings
```http
GET /ratings/project/:projectId?page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ratings": [
      {
        "id": "rating_id",
        "rating": 5,
        "comment": "Great project!",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "user": {
          "id": "user_id",
          "name": "User Name",
          "avatar": "https://avatar-url.com"
        }
      }
    ],
    "statistics": {
      "total": 25,
      "average": 4.2,
      "distribution": [
        { "stars": 5, "count": 10, "percentage": "40.0" },
        { "stars": 4, "count": 8, "percentage": "32.0" },
        { "stars": 3, "count": 5, "percentage": "20.0" },
        { "stars": 2, "count": 2, "percentage": "8.0" },
        { "stars": 1, "count": 0, "percentage": "0.0" }
      ]
    },
    "pagination": {
      "current": 1,
      "total": 3,
      "hasNext": true,
      "hasPrev": false,
      "totalItems": 25
    }
  }
}
```

### Rate a Project
```http
POST /ratings/project/:projectId
```
*Requires authentication*

**Body:**
```json
{
  "rating": 5,
  "comment": "Excellent work! Love the design."
}
```

### Update Rating
```http
PUT /ratings/:id
```
*Requires authentication (rating owner only)*

### Delete Rating
```http
DELETE /ratings/:id
```
*Requires authentication (rating owner only)*

### Get My Ratings
```http
GET /ratings/my-ratings?page=1&limit=10
```
*Requires authentication*

---

## Category Endpoints

### Get All Categories
```http
GET /categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "category_id",
      "name": "Web Apps",
      "color": "#3b82f6",
      "icon": "🌐",
      "projectCount": 25
    }
  ]
}
```

### Get Single Category
```http
GET /categories/:id?page=1&limit=12
```

### Create Category
```http
POST /categories
```
*Requires authentication*

**Body:**
```json
{
  "name": "New Category",
  "color": "#ff0000",
  "icon": "🔥"
}
```

### Update Category
```http
PUT /categories/:id
```
*Requires authentication*

### Delete Category
```http
DELETE /categories/:id
```
*Requires authentication*

---

## User Endpoints

### Get All Users
```http
GET /users?page=1&limit=12&search=john&sortBy=newest
```

### Get Single User
```http
GET /users/:id?projectsPage=1&projectsLimit=6
```

### Get User Dashboard
```http
GET /users/dashboard
```
*Requires authentication*

**Response:**
```json
{
  "success": true,
  "data": {
    "projects": [
      // User's projects with ratings and stats
    ],
    "statistics": {
      "totalProjects": 5,
      "publishedProjects": 4,
      "featuredProjects": 1,
      "totalRatingsReceived": 23,
      "totalRatingsGiven": 15,
      "averageRating": 4.3
    },
    "recentActivity": [
      // Recent ratings and activity
    ]
  }
}
```

### Get Leaderboard
```http
GET /users/leaderboard?limit=10&period=month
```

**Query Parameters:**
- `limit` (number): Number of users to return
- `period` (string): all|week|month|year

---

## Upload Endpoints

### Upload Image
```http
POST /upload/:type
```
*Requires authentication*

**Types:** `avatars`, `projects`, `general`

**Body:** Form data with `image` field

**Response:**
```json
{
  "success": true,
  "data": {
    "filename": "image-123456789.jpg",
    "originalName": "my-image.jpg",
    "size": 1024000,
    "mimetype": "image/jpeg",
    "url": "http://localhost:5000/uploads/projects/image-123456789.jpg",
    "path": "uploads/projects/image-123456789.jpg"
  },
  "message": "File uploaded successfully"
}
```

### Upload Multiple Images
```http
POST /upload/:type/multiple
```
*Requires authentication*

**Types:** `projects`, `general`

### Delete File
```http
DELETE /upload/:type/:filename
```
*Requires authentication*

### Get File Info
```http
GET /upload/:type/:filename/info
```

### Validate Image URL
```http
POST /upload/validate-url
```
*Requires authentication*

**Body:**
```json
{
  "url": "https://example.com/image.jpg"
}
```

---

## Analytics Endpoints

### Get Platform Statistics
```http
GET /analytics/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 156,
      "totalProjects": 234,
      "totalRatings": 1247,
      "totalCategories": 8,
      "featuredProjects": 12,
      "recentProjects": 45
    },
    "topRatedProjects": [
      {
        "id": "project_id",
        "title": "Project Title",
        "avgRating": 4.8,
        "totalRatings": 25
      }
    ],
    "generatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get Category Statistics
```http
GET /analytics/categories
```

### Get Trending Projects
```http
GET /analytics/trending?limit=10&period=week
```

### Get Activity Analytics
```http
GET /analytics/activity?period=month
```

### Get Search Analytics
```http
GET /analytics/search
```
*Requires authentication*

---

## Error Codes

- `400` - Bad Request (validation errors, missing fields)
- `401` - Unauthorized (invalid or missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate data)
- `422` - Unprocessable Entity (business logic errors)
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error

## Rate Limiting

- **General endpoints:** 100 requests per 15 minutes per IP
- **Authentication endpoints:** 5 requests per 15 minutes per IP
- **File upload endpoints:** 10 requests per hour per authenticated user

## Pagination

All list endpoints support pagination with these query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12, max: 100)

Pagination response format:
```json
{
  "pagination": {
    "current": 1,
    "total": 5,
    "hasNext": true,
    "hasPrev": false,
    "totalItems": 50
  }
}
```

## Validation Rules

### User Registration
- `name`: 2-50 characters
- `email`: Valid email format
- `password`: Minimum 6 characters
- `github`, `website`, `twitter`: Optional strings

### Project Creation
- `title`: 3-100 characters
- `description`: 10-1000 characters
- `techStack`: Array of strings
- `categoryIds`: Array of valid category IDs (minimum 1)
- `image`, `demoUrl`, `githubUrl`: Valid URLs (optional)

### Rating Creation
- `rating`: Integer 1-5
- `comment`: Maximum 500 characters (optional)

### Category Creation
- `name`: 2-50 characters, unique
- `color`: Valid hex color code (e.g., #FF0000)
- `icon`: Maximum 10 characters (emoji)

---

## Example Usage

### JavaScript/Node.js
```javascript
// Register a new user
const response = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  })
})

const data = await response.json()
const token = data.data.token

// Get projects with authentication
const projectsResponse = await fetch('http://localhost:5000/api/projects', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

const projects = await projectsResponse.json()
```

### cURL
```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Get projects
curl -X GET "http://localhost:5000/api/projects?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Create project
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My Project",
    "description": "A great project",
    "techStack": ["React", "Node.js"],
    "categoryIds": ["category_id_here"]
  }'
```

---

This API provides a complete backend solution for the DevShowcase platform with authentication, project management, rating system, file uploads, and analytics capabilities. 