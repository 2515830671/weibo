import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config'
import { AppError } from './error'
import { prisma } from '../app'

// 扩展 Request 类型
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number
        email: string
        username: string
      }
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 获取 token
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError(401, 'No token provided')
    }

    const token = authHeader.split(' ')[1]

    // 验证 token
    const decoded = jwt.verify(token, config.jwt.secret) as {
      id: number
      email: string
      username: string
    }

    // 检查用户是否存在
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, username: true }
    })

    if (!user) {
      throw new AppError(401, 'User not found')
    }

    // 将用户信息添加到请求对象
    req.user = user
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError(401, 'Invalid token'))
    } else {
      next(error)
    }
  }
} 