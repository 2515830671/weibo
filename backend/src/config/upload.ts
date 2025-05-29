import multer from 'multer'
import path from 'path'
import crypto from 'crypto'
import { config } from '.'

// 配置文件存储
const storage = multer.diskStorage({
  destination: config.upload.directory,
  filename: (req, file, callback) => {
    // 生成随机文件名
    const hash = crypto.randomBytes(6).toString('hex')
    const fileName = `${hash}-${Date.now()}${path.extname(file.originalname)}`
    callback(null, fileName)
  }
})

// 文件过滤器
const fileFilter = (req: any, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif'
  ]

  if (allowedMimes.includes(file.mimetype)) {
    callback(null, true)
  } else {
    callback(new Error('Invalid file type. Only JPEG, PNG and GIF image files are allowed.'))
  }
}

export const uploadConfig = {
  directory: config.upload.directory,
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize // 默认10MB
  }
}

export const upload = multer(uploadConfig) 