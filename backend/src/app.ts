import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import { errorHandler } from './middlewares/error'
import { authRoutes } from './routes/auth'
import { userRoutes } from './routes/user'
import { postRoutes } from './routes/post'
import { topicRoutes } from './routes/topic'
import { notificationRoutes } from './routes/notification'
import { uploadConfig } from './config/upload'

// 创建Express应用
const app = express()

// 创建Prisma客户端
export const prisma = new PrismaClient()

// 中间件配置
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(uploadConfig.directory))

// 路由配置
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/posts', postRoutes)
app.use('/api/v1/topics', topicRoutes)
app.use('/api/v1/notifications', notificationRoutes)

// 错误处理中间件
app.use(errorHandler)

export default app 