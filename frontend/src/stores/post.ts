import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Post, NewPost, Comment } from '@/types/post'

export const usePostStore = defineStore('post', () => {
  const posts = ref<Post[]>([])
  const loading = ref(false)
  const comments = ref<{ [key: number]: Comment[] }>({})

  // 加载帖子列表
  const loadPosts = async () => {
    loading.value = true
    try {
      // TODO: 调用API获取帖子列表
      await new Promise(resolve => setTimeout(resolve, 1000))
      posts.value = [
        {
          id: 1,
          username: '测试用户',
          avatar: 'https://placeholder.co/40',
          content: '这是一条测试帖子',
          createdAt: new Date(Date.now() - 3600000),
          likes: 10,
          comments: 2,
          shares: 2,
          liked: false
        },
        {
          id: 2,
          username: '测试用户2',
          avatar: 'https://placeholder.co/40',
          content: '这是另一条测试帖子，包含了图片。',
          image: 'https://placeholder.co/400x300',
          createdAt: new Date(Date.now() - 7200000),
          likes: 15,
          comments: 3,
          shares: 1,
          liked: true
        }
      ]
    } finally {
      loading.value = false
    }
  }

  // 添加新帖子
  const addPost = (post: NewPost) => {
    const newPost: Post = {
      ...post,
      id: Date.now(),
      createdAt: new Date(),
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false
    }
    posts.value.unshift(newPost)
  }

  // 点赞/取消点赞
  const toggleLike = async (postId: number) => {
    const post = posts.value.find(p => p.id === postId)
    if (!post) return

    // TODO: 调用API进行点赞/取消点赞
    await new Promise(resolve => setTimeout(resolve, 500))
    
    post.liked = !post.liked
    post.likes += post.liked ? 1 : -1
  }

  // 添加评论
  const addComment = async (postId: number, content: string) => {
    const post = posts.value.find(p => p.id === postId)
    if (!post) return

    // TODO: 调用API添加评论
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newComment: Comment = {
      id: Date.now(),
      postId,
      username: '测试用户', // 应该从用户状态获取
      avatar: 'https://placeholder.co/32',
      content,
      createdAt: new Date()
    }

    if (!comments.value[postId]) {
      comments.value[postId] = []
    }
    comments.value[postId].unshift(newComment)
    post.comments += 1
  }

  // 获取帖子评论
  const getComments = async (postId: number): Promise<Comment[]> => {
    // 如果已经加载过评论，直接返回缓存
    if (comments.value[postId]) {
      return comments.value[postId]
    }

    // TODO: 调用API获取评论列表
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newComments: Comment[] = [
      {
        id: 1,
        postId,
        username: '测试用户1',
        avatar: 'https://placeholder.co/32',
        content: '这是一条测试评论',
        createdAt: new Date(Date.now() - 3600000)
      },
      {
        id: 2,
        postId,
        username: '测试用户2',
        avatar: 'https://placeholder.co/32',
        content: '这是另一条测试评论',
        createdAt: new Date(Date.now() - 7200000)
      }
    ]

    comments.value[postId] = newComments
    return newComments
  }

  return {
    posts,
    loading,
    loadPosts,
    addPost,
    toggleLike,
    addComment,
    getComments
  }
}) 