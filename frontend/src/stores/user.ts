import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, UserInfo, LoginForm, RegisterForm, UpdateProfileForm } from '@/types/user'

export interface UserInfo {
  id: number
  username: string
  email?: string
  avatar?: string
  bio?: string
  location?: string
  website?: string
  coverImage?: string
  joinTime?: Date
  following?: number
  followers?: number
}

export const useUserStore = defineStore('user', () => {
  // 从localStorage恢复状态
  const storedUserInfo = localStorage.getItem('userInfo')
  const storedToken = localStorage.getItem('token')

  console.log('初始化用户状态:', { storedUserInfo, storedToken })

  const userInfo = ref<UserInfo | null>(storedUserInfo ? JSON.parse(storedUserInfo) : null)
  const token = ref<string | null>(storedToken)
  
  // 计算属性：是否已登录
  const isLoggedIn = computed(() => {
    const loggedIn = !!token.value
    console.log('检查登录状态:', { loggedIn, token: token.value })
    return loggedIn
  })

  // 模拟文件上传
  const uploadFile = async (file: File): Promise<string> => {
    console.log('开始上传文件:', { name: file.name, type: file.type, size: file.size })
    return new Promise((resolve) => {
      // 模拟上传延迟
      setTimeout(() => {
        // 创建一个本地URL作为模拟的远程URL
        const url = URL.createObjectURL(file)
        console.log('文件上传完成，URL:', url)
        resolve(url)
      }, 1000)
    })
  }

  // 登录
  const login = async (form: LoginForm) => {
    // TODO: 调用登录API
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 模拟登录成功
    if (form.email === 'test@example.com' && form.password === 'test123') {
      const newUserInfo = {
        username: '测试用户',
        email: form.email,
        avatar: 'https://placeholder.co/40',
        bio: '热爱生活，分享美好',
        location: '北京',
        website: 'blog.zhangsan.com',
        coverImage: 'https://placeholder.co/1500x500',
        joinTime: new Date('2020-01-01')
      }
      userInfo.value = newUserInfo
      token.value = 'mock_token'
      
      // 保存到localStorage
      localStorage.setItem('userInfo', JSON.stringify(newUserInfo))
      localStorage.setItem('token', 'mock_token')
      localStorage.setItem('isLoggedIn', 'true')
      
      return true
    }
    
    throw new Error('用户名或密码错误')
  }

  // 注册
  const register = async (form: RegisterForm) => {
    // TODO: 调用注册API
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newUserInfo = {
      username: form.username,
      email: form.email,
      avatar: 'https://placeholder.co/40',
      joinTime: new Date()
    }
    userInfo.value = newUserInfo
    token.value = 'mock_token'

    // 保存到localStorage
    localStorage.setItem('userInfo', JSON.stringify(newUserInfo))
    localStorage.setItem('token', 'mock_token')
    localStorage.setItem('isLoggedIn', 'true')
  }

  // 更新个人资料
  const updateProfile = async (form: UpdateProfileForm) => {
    try {
      console.log('开始更新个人资料:', form)
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 更新本地状态
      userInfo.value = {
        ...userInfo.value,
        ...form
      }

      console.log('更新后的用户信息:', userInfo.value)

      // 更新localStorage
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      console.log('localStorage已更新')

      return true
    } catch (error) {
      console.error('更新个人资料失败:', error)
      throw new Error('更新失败，请重试')
    }
  }

  // 登出
  const logout = () => {
    userInfo.value = null
    token.value = null
    
    // 清除localStorage
    localStorage.removeItem('userInfo')
    localStorage.removeItem('token')
    localStorage.removeItem('isLoggedIn')
  }

  // 检查登录状态
  const checkAuth = () => {
    return isLoggedIn.value
  }

  // 设置用户信息
  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
    isLoggedIn.value = true
  }

  // 清除用户信息
  const clearUserInfo = () => {
    userInfo.value = null
    isLoggedIn.value = false
  }

  // 更新用户信息
  const updateUserInfo = (info: Partial<UserInfo>) => {
    if (userInfo.value) {
      userInfo.value = { ...userInfo.value, ...info }
    }
  }

  return {
    userInfo,
    token,
    isLoggedIn,
    login,
    register,
    updateProfile,
    uploadFile,
    logout,
    checkAuth,
    setUserInfo,
    clearUserInfo,
    updateUserInfo
  }
}) 