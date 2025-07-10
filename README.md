# Buildable - Developer Project Showcase

A modern platform for developers to showcase their projects and get community feedback through ratings and reviews.

## Features

- **Project Showcase**: Submit and display your development projects
- **Real-time Rating System**: Rate and review projects with comprehensive analytics
- **Cloudinary Integration**: Professional image hosting with CDN delivery
- **User Authentication**: Secure user registration and login
- **Responsive Design**: Beautiful UI that works on all devices
- **Project Categories**: Organize projects by technology and type

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Image Upload**: Cloudinary
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Animations**: Framer Motion

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd buildable
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the project root:

```env
# Cloudinary Configuration (Required for image uploads)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_name
```

### 4. Cloudinary Setup (Required)

1. **Create a Cloudinary Account**: Go to [Cloudinary](https://cloudinary.com) and sign up
2. **Get your Cloud Name**: Found in your Cloudinary dashboard
3. **Create an Upload Preset**:
   - Go to Settings → Upload → Upload Presets
   - Click "Add upload preset"
   - Set to "Unsigned" mode
   - Configure max file size (10MB recommended)
   - Set allowed formats: jpg, png, gif, webp
   - Save the preset

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ProjectCard.jsx     # Individual project display
│   ├── RatingModal.jsx     # Comprehensive rating interface
│   ├── ProjectGallery.jsx  # Project grid with filters
│   └── ...
├── pages/              # Page components
│   ├── Home.jsx           # Main homepage
│   ├── SubmitProject.jsx  # Project submission form
│   └── ...
├── contexts/           # React Context providers
│   └── AuthContext.jsx   # Authentication state
├── utils/              # Utility functions
│   ├── api.js            # API client and endpoints
│   └── cloudinary.js     # Cloudinary upload utilities
└── config/             # Configuration files
    └── cloudinary.js     # Cloudinary settings
```

## API Integration

The frontend connects to a backend API with the following endpoints:

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details

### Ratings
- `GET /api/ratings/project/:id/summary` - Get rating distribution
- `POST /api/ratings/project/:id` - Rate a project
- `PUT /api/ratings/project/:id` - Update rating
- `DELETE /api/ratings/project/:id` - Delete rating

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

## Features in Detail

### Project Submission
- **Rich Form**: Title, description, category, tech stack
- **Image Upload**: Direct to Cloudinary with progress tracking
- **Links**: GitHub repository and live demo URLs
- **Validation**: Form validation with error messages

### Rating System
- **Comprehensive Interface**: Modal with tabs for rating, distribution, and reviews
- **Real-time Updates**: Instant feedback on rating changes
- **User Management**: Update or delete your own ratings
- **Analytics**: View rating distribution and statistics

### Image Management
- **Cloudinary CDN**: Fast, optimized image delivery
- **Upload Progress**: Real-time progress tracking
- **Error Handling**: Graceful fallbacks for failed uploads
- **Format Support**: JPG, PNG, GIF, WebP

## Build and Deployment

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions:

1. Check the **Cloudinary Setup** section for image upload issues
2. Verify your environment variables are correctly set
3. Check browser console for error messages
4. Ensure your backend API is running and accessible

## Changelog

### Latest Updates
- ✅ **Cloudinary Integration**: Professional image hosting with CDN
- ✅ **Enhanced Rating System**: Comprehensive rating modal with analytics
- ✅ **Real API Integration**: Connected to backend database
- ✅ **Improved UI/UX**: Clean, modern design with smooth animations
- ✅ **File Upload System**: Drag-and-drop with progress tracking
