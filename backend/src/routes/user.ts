import { Router } from 'express'
import { prisma } from '../app'
import { auth } from '../middlewares/auth'
import { upload } from '../config/upload'
import { AppError } from '../middlewares/error'

export const userRoutes = Router()

// 获取用户信息
userRoutes.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        username: true,
        avatar: true,
        bio: true,
        location: true,
        website: true,
        coverImage: true,
        joinTime: true,
        _count: {
          select: {
            following: true,
            followers: true,
            posts: true
          }
        }
      }
    })

    if (!user) {
      throw new AppError(404, '用户不存在')
    }

    res.json({
      code: 200,
      data: user
    })
  } catch (error) {
    next(error)
  }
})

// 更新用户信息
userRoutes.put('/profile', auth, upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]), async (req, res, next) => {
  try {
    const userId = req.user!.id
    const { bio, location, website } = req.body
    const files = req.files as { [fieldname: string]: Express.Multer.File[] }

    const updateData: any = {
      bio,
      location,
      website
    }

    if (files.avatar) {
      updateData.avatar = files.avatar[0].filename
    }

    if (files.coverImage) {
      updateData.coverImage = files.coverImage[0].filename
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        avatar: true,
        bio: true,
        location: true,
        website: true,
        coverImage: true
      }
    })

    res.json({
      code: 200,
      data: user
    })
  } catch (error) {
    next(error)
  }
})

// 关注/取消关注
userRoutes.post('/:id/follow', auth, async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user!.id
    const targetId = parseInt(id)

    if (userId === targetId) {
      throw new AppError(400, '不能关注自己')
    }

    // 检查目标用户是否存在
    const targetUser = await prisma.user.findUnique({
      where: { id: targetId }
    })

    if (!targetUser) {
      throw new AppError(404, '用户不存在')
    }

    // 检查是否已关注
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetId
        }
      }
    })

    if (existingFollow) {
      // 取消关注
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetId
          }
        }
      })
    } else {
      // 添加关注
      await prisma.follow.create({
        data: {
          followerId: userId,
          followingId: targetId
        }
      })
    }

    res.json({
      code: 200,
      data: {
        following: !existingFollow
      }
    })
  } catch (error) {
    next(error)
  }
})

// 获取用户帖子列表
userRoutes.get('/:id/posts', async (req, res, next) => {
  try {
    const { id } = req.params
    const posts = await prisma.post.findMany({
      where: { authorId: parseInt(id) },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json({
      code: 200,
      data: posts
    })
  } catch (error) {
    next(error)
  }
}) 