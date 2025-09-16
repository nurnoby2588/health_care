import multer from 'multer'
import path from 'path'
import { cwd } from 'process'
import { v2 as cloudinary } from 'cloudinary';
import ApiError from '../app/errors/ApiError';
import fs from 'fs'
import { ICloudinaryResponse } from '../app/interface/file';
// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dmcsbig3a',
  api_key: '585251334328575', // Replace with your actual API key
  api_secret: '7eC6i6KYmNOsW9hA3GpWwDAJkfo', // Replace with your actual API secret
});


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log(cwd())
    cb(null, path.join(process.cwd(), 'uploads'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const extension = file.originalname.substring(file.originalname.lastIndexOf('.'));
    cb(null, file.fieldname + '-' + uniqueSuffix + extension)
  }
})
const upload = multer({ storage: storage })

const CloudinaryUpload = async (filePath: any) => {
  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(
      filePath.path, {
      public_id: filePath.filename,
    }
    )
    .catch((error) => {
      throw new ApiError(error.http_code, error.message)
    });
  if (uploadResult) {
    // delete autometic aftar upload cloudinary
    fs.unlinkSync(filePath.path)
  }
  // Optimize delivery by resizing and applying auto-format and auto-quality
  // const optimizeUrl = cloudinary.url(filePath.filename, {
  //   fetch_format: 'auto',
  //   quality: 'auto'
  // });
  // Transform the image: auto-crop to square aspect_ratio
  // const autoCropUrl = cloudinary.url(filePath.filename, {
  //   crop: 'auto',
  //   gravity: 'auto',
  //   width: 500,
  //   height: 500,
  // });
  return uploadResult 

}
export const fileUploader = { upload, CloudinaryUpload }