import { Router } from 'express'
import { prisma } from '../app'
import { auth } from '../middlewares/auth'
import { upload } from '../config/upload'
import { AppError } from '../middlewares/error'

export const postRoutes = Router()

// 获取帖子列表
postRoutes.get('/', async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
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

// 创建帖子
postRoutes.post('/', auth, upload.single('image'), async (req, res, next) => {
  try {
    const { content } = req.body
    const userId = req.user!.id
    const image = req.file?.filename

    const post = await prisma.post.create({
      data: {
        content,
        image,
        authorId: userId
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    })

    res.status(201).json({
      code: 201,
      data: post
    })
  } catch (error) {
    next(error)
  }
})

// 获取帖子详情
postRoutes.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      }
    })

    if (!post) {
      throw new AppError(404, '帖子不存在')
    }

    res.json({
      code: 200,
      data: post
    })
  } catch (error) {
    next(error)
  }
})

// 点赞/取消点赞
postRoutes.post('/:id/like', auth, async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user!.id

    // 检查是否已点赞
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: parseInt(id)
        }
      }
    })

    if (existingLike) {
      // 取消点赞
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId: parseInt(id)
          }
        }
      })
    } else {
      // 添加点赞
      await prisma.like.create({
        data: {
          userId,
          postId: parseInt(id)
        }
      })
    }

    res.json({
      code: 200,
      data: {
        liked: !existingLike
      }
    })
  } catch (error) {
    next(error)
  }
})

// 评论帖子
postRoutes.post('/:id/comment', auth, async (req, res, next) => {
  try {
    const { id } = req.params
    const { content } = req.body
    const userId = req.user!.id

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: userId,
        postId: parseInt(id)
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    })

    res.status(201).json({
      code: 201,
      data: comment
    })
  } catch (error) {
    next(error)
  }
}) 