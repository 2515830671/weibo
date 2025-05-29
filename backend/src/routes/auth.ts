import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../app'
import { config } from '../config'
import { AppError } from '../middlewares/error'

export const authRoutes = Router()

// 注册
authRoutes.post('/register', async (req, res, next) => {
  try {
    const { email, username, password } = req.body

    // 检查用户是否已存在
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    })

    if (existingUser) {
      throw new AppError(400, '邮箱或用户名已被使用')
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10)

    // 创建用户
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword
      }
    })

    // 生成 token
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    )

    res.status(201).json({
      code: 201,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        }
      }
    })
  } catch (error) {
    next(error)
  }
})

// 登录
authRoutes.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      throw new AppError(401, '用户名或密码错误')
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw new AppError(401, '用户名或密码错误')
    }

    // 生成 token
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    )

    res.json({
      code: 200,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        }
      }
    })
  } catch (error) {
    next(error)
  }
}) 