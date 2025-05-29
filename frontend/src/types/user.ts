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

export interface LoginForm {
  username: string
  password: string
  remember?: boolean
}

export interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface User extends UserInfo {
  id: number
  createdAt: Date
}

export interface UpdateProfileForm {
  username?: string
  email?: string
  bio?: string
  location?: string
  website?: string
  avatar?: File
  coverImage?: File
} 