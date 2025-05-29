export interface Post {
  id: number
  username: string
  avatar: string
  content: string
  image?: string
  createdAt: Date
  likes: number
  comments: number
  shares: number
  liked: boolean
}

export interface Comment {
  id: number
  postId: number
  username: string
  avatar: string
  content: string
  createdAt: Date
}

export type NewPost = Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments' | 'shares' | 'liked'>
export type NewComment = Omit<Comment, 'id' | 'createdAt'> 