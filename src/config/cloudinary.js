// Cloudinary Configuration
// Make sure to set these environment variables in your .env file:
// VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
// VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dwkdf5cqv',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'buildable_preset'
}

// Validation to help developers
if (cloudinaryConfig.cloudName === 'dwkdf5cqv' && !import.meta.env.VITE_CLOUDINARY_CLOUD_NAME) {
  console.info('ℹ️ Cloudinary: Using default cloud name. Set VITE_CLOUDINARY_CLOUD_NAME in your .env file to override')
}

if (cloudinaryConfig.uploadPreset === 'buildable_preset') {
  console.warn('⚠️ Cloudinary: Please set VITE_CLOUDINARY_UPLOAD_PRESET in your .env file')
} 