
// ============================================
// 11. lib/cloudinary.ts - File Upload Service
// ============================================

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * Uploads a file to Cloudinary.
 *
 * @param {File} file - the file to upload
 * @param {string} folder - the folder to upload the file to (defaults to 'dc-vi-academy')
 * @returns {Promise<string>} a promise that resolves to the secure URL of the uploaded file
 */
export async function uploadFile(
  file: File,
  folder: string = 'dc-vi-academy'
): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result!.secure_url)
        }
      ).end(buffer)
    })
  } catch (error) {
    console.error('Upload error:', error)
    throw error
  }
}

/**
 * Deletes a file from Cloudinary using the public ID.
 *
 * @param {string} publicId - the public ID of the file to delete
 * @returns {Promise<void>} a promise that resolves when the file has been deleted, or rejects with an error if there is a problem deleting the file
 */
export async function deleteFile(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Delete error:', error)
    throw error
  }
}
