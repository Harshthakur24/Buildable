// Cloudinary upload utility through backend
export const uploadToCloudinary = async (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const formData = new FormData()
    formData.append('image', file)

    // Setup upload progress handler
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const progress = (e.loaded / e.total) * 100
        onProgress(progress)
      }
    }

    // Setup completion handler
    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText)
          if (response.success) {
            resolve(response.data)
          } else {
            reject(new Error(response.error || 'Upload failed'))
          }
        } catch (error) {
          reject(new Error(`Invalid response from server: ${error.message}`))
        }
      } else {
        reject(new Error(`Upload Failed: ${xhr.statusText}`))
      }
    }

    // Setup error handler
    xhr.onerror = () => reject(new Error('Network error occurred'))

    // Send the request
    xhr.open('POST', '/api/upload/projects')
    xhr.send(formData)
  })
}

// Helper function to extract public ID from Cloudinary URL
export const getPublicId = (url) => {
  if (!url) return null
  const parts = url.split('/')
  return parts[parts.length - 1].split('.')[0]
}

// Helper function to get the original URL
export const getOptimizedImageUrl = (url) => {
  if (!url) return null
  return url // Return original URL since optimization is now handled by backend
} 