// Cloudinary upload utility
import { cloudinaryConfig } from '../config/cloudinary'

export const uploadToCloudinary = async (file, onProgress) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', cloudinaryConfig.uploadPreset)
  
  try {
    const xhr = new XMLHttpRequest()
    
    return new Promise((resolve, reject) => {
      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100)
          onProgress(progress)
        }
      })
      
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
          resolve({
            url: response.secure_url,
            publicId: response.public_id,
            width: response.width,
            height: response.height
          })
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`))
        }
      })
      
      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'))
      })
      
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`)
      xhr.send(formData)
    })
  } catch (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }
}

// Helper function to extract public ID from Cloudinary URL
export const getPublicIdFromUrl = (url) => {
  const parts = url.split('/')
  const filename = parts[parts.length - 1]
  return filename.split('.')[0]
}

// Helper function to generate optimized Cloudinary URLs
export const getOptimizedImageUrl = (url, options = {}) => {
  const {
    width = 'auto',
    quality = 'auto',
    format = 'auto',
    crop = 'scale'
  } = options
  
  // Extract public ID from URL
  const publicId = getPublicIdFromUrl(url)
  
  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/w_${width},q_${quality},f_${format},c_${crop}/${publicId}`
} 