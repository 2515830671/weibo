<template>
  <div class="profile">
    <!-- 个人资料头部 -->
    <div class="profile-header">
      <div class="cover-image">
        <el-upload
          class="upload-area"
          action="#"
          :show-file-list="false"
          :before-upload="handleCoverUpload"
          accept="image/*"
        >
          <div class="image-container">
            <img :src="userStore.userInfo?.coverImage || 'https://placeholder.co/1500x500'" alt="封面图片" />
            <div class="upload-overlay">
              <div class="upload-hint">
                <el-icon :size="24"><Camera /></el-icon>
                <span>更换封面图片</span>
              </div>
            </div>
          </div>
        </el-upload>
      </div>
      <div class="profile-info">
        <div class="avatar-container">
          <el-upload
            class="upload-area"
            action="#"
            :show-file-list="false"
            :before-upload="handleAvatarUpload"
            accept="image/*"
          >
            <div class="avatar-wrapper">
              <el-avatar :size="120" :src="userStore.userInfo?.avatar || 'https://placeholder.co/120'" />
              <div class="upload-overlay">
                <div class="upload-hint">
                  <el-icon :size="24"><Camera /></el-icon>
                </div>
              </div>
            </div>
          </el-upload>
        </div>
        <div class="profile-actions">
          <el-button type="primary" round @click="showEditDialog = true">编辑资料</el-button>
        </div>
        <h1 class="user-name">{{ userStore.userInfo?.username }}</h1>
        <p class="user-handle">@{{ userStore.userInfo?.username?.toLowerCase() }}</p>
        <p class="user-bio">{{ userStore.userInfo?.bio || '这个人很懒，什么都没写' }}</p>
        <div class="user-meta">
          <template v-if="userStore.userInfo?.location">
            <el-icon><Location /></el-icon>
            <span>{{ userStore.userInfo.location }}</span>
          </template>
          <template v-if="userStore.userInfo?.website">
            <el-icon><Link /></el-icon>
            <a :href="userStore.userInfo.website" target="_blank">{{ userStore.userInfo.website }}</a>
          </template>
          <template v-if="userStore.userInfo?.joinTime">
            <el-icon><Calendar /></el-icon>
            <span>{{ formatJoinTime }}</span>
          </template>
        </div>
        <div class="follow-stats">
          <a href="#" class="stat-item">
            <strong>1,234</strong>
            <span>正在关注</span>
          </a>
          <a href="#" class="stat-item">
            <strong>5,678</strong>
            <span>关注者</span>
          </a>
        </div>
      </div>
    </div>

    <!-- 编辑资料对话框 -->
    <EditProfileDialog
      v-model="showEditDialog"
      @submit="handleProfileUpdate"
    />

    <!-- 内容标签页 -->
    <div class="profile-tabs">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="帖子" name="posts">
          <div class="posts-list">
            <div v-for="post in userPosts" :key="post.id" class="post-item">
              <div class="post-header">
                <el-avatar :size="40" src="https://placeholder.co/40" />
                <div class="post-meta">
                  <span class="post-author">张三</span>
                  <span class="post-time">{{ post.time }}</span>
                </div>
              </div>
              <div class="post-content">
                {{ post.content }}
              </div>
              <div class="post-actions">
                <el-button text>
                  <el-icon><ChatRound /></el-icon>
                  {{ post.comments }}
                </el-button>
                <el-button text>
                  <el-icon><Share /></el-icon>
                  {{ post.shares }}
                </el-button>
                <el-button text>
                  <el-icon><Star /></el-icon>
                  {{ post.likes }}
                </el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="回复" name="replies">
          <el-empty description="暂无回复" />
        </el-tab-pane>
        <el-tab-pane label="媒体" name="media">
          <el-empty description="暂无媒体" />
        </el-tab-pane>
        <el-tab-pane label="喜欢" name="likes">
          <el-empty description="暂无喜欢的内容" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Location, Link, Calendar, ChatRound, Share, Star, Camera } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import EditProfileDialog from '@/components/EditProfileDialog.vue'

const userStore = useUserStore()
const showEditDialog = ref(false)
const activeTab = ref('posts')

const userPosts = ref([
  {
    id: 1,
    content: '今天天气真不错！准备出去走走～',
    time: '3小时前',
    comments: 12,
    shares: 5,
    likes: 23
  },
  {
    id: 2,
    content: '刚刚完成了一个很棒的项目！感谢团队的每一个成员！',
    time: '昨天',
    comments: 8,
    shares: 3,
    likes: 45
  },
  {
    id: 3,
    content: '分享一篇很棒的技术文章：Vue 3 的新特性解析',
    time: '2天前',
    comments: 15,
    shares: 12,
    likes: 67
  }
])

const formatJoinTime = computed(() => {
  if (!userStore.userInfo?.joinTime) return ''
  return new Date(userStore.userInfo.joinTime).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long'
  }) + '加入'
})

const handleProfileUpdate = () => {
  // 资料更新成功后的处理
  showEditDialog.value = false
}

// 处理封面图片上传
const handleCoverUpload = async (file: File) => {
  // 检查登录状态
  if (!userStore.isLoggedIn) {
    ElMessage.error('请先登录')
    return false
  }

  // 检查用户信息
  if (!userStore.userInfo?.username || !userStore.userInfo?.email) {
    ElMessage.error('用户信息不完整，请重新登录')
    return false
  }

  // 检查文件类型
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    ElMessage.error('只支持 JPG、PNG、GIF 格式的图片')
    return false
  }
  
  // 检查文件大小（最大5MB）
  const isLtMax = file.size / 1024 / 1024 < 5
  if (!isLtMax) {
    ElMessage.error('图片大小不能超过 5MB')
    return false
  }
  
  try {
    ElMessage.info('正在上传封面图片...')
    
    // 上传文件并获取URL
    const imageUrl = await userStore.uploadFile(file)
    console.log('封面图片上传成功，URL:', imageUrl)
    
    // 更新用户信息
    const updateData = {
      username: userStore.userInfo.username,
      email: userStore.userInfo.email,
      coverImage: imageUrl
    }
    console.log('准备更新用户信息:', updateData)
    
    await userStore.updateProfile(updateData)
    console.log('用户信息更新成功')
    
    ElMessage.success('封面图片更新成功')
    return false // 阻止默认上传
  } catch (error) {
    console.error('图片上传失败:', error)
    ElMessage.error(error instanceof Error ? error.message : '图片上传失败，请重试')
    return false
  }
}

// 处理头像上传
const handleAvatarUpload = async (file: File) => {
  // 检查登录状态
  if (!userStore.isLoggedIn) {
    ElMessage.error('请先登录')
    return false
  }

  // 检查用户信息
  if (!userStore.userInfo?.username || !userStore.userInfo?.email) {
    ElMessage.error('用户信息不完整，请重新登录')
    return false
  }

  // 检查文件类型
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    ElMessage.error('只支持 JPG、PNG、GIF 格式的图片')
    return false
  }
  
  // 检查文件大小（最大2MB）
  const isLtMax = file.size / 1024 / 1024 < 2
  if (!isLtMax) {
    ElMessage.error('图片大小不能超过 2MB')
    return false
  }
  
  try {
    ElMessage.info('正在上传头像...')
    
    // 上传文件并获取URL
    const imageUrl = await userStore.uploadFile(file)
    console.log('头像上传成功，URL:', imageUrl)
    
    // 更新用户信息
    const updateData = {
      username: userStore.userInfo.username,
      email: userStore.userInfo.email,
      avatar: imageUrl
    }
    console.log('准备更新用户信息:', updateData)
    
    await userStore.updateProfile(updateData)
    console.log('用户信息更新成功')
    
    ElMessage.success('头像更新成功')
    return false // 阻止默认上传
  } catch (error) {
    console.error('图片上传失败:', error)
    ElMessage.error(error instanceof Error ? error.message : '图片上传失败，请重试')
    return false
  }
}
</script>

<style scoped>
.profile {
  max-width: 100%;
  margin: 0 auto;
}

.profile-header {
  position: relative;
  margin-bottom: 24px;
  background-color: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.cover-image {
  height: 240px;
  overflow: hidden;
  position: relative;
}

.cover-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s;
}

.image-container:hover .upload-overlay,
.avatar-wrapper:hover .upload-overlay {
  opacity: 1;
}

.upload-hint {
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.upload-hint span {
  font-size: 14px;
}

.avatar-container {
  position: absolute;
  top: -80px;
  left: 24px;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
  border: 6px solid #fff;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  cursor: pointer;
}

.avatar-wrapper:hover {
  transform: scale(1.05);
}

.avatar-wrapper .upload-overlay {
  border-radius: 50%;
}

.avatar-wrapper .upload-hint {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
}

.profile-info {
  padding: 24px;
  position: relative;
}

.profile-actions {
  float: right;
  margin-top: 8px;
}

.profile-actions .el-button {
  padding: 12px 32px;
  font-size: 1.05em;
}

.user-name {
  font-size: 24px;
  font-weight: bold;
  margin: 48px 0 4px;
}

.user-handle {
  color: #666;
  margin-bottom: 16px;
  font-size: 1.1em;
}

.user-bio {
  margin-bottom: 16px;
  line-height: 1.6;
  font-size: 1.05em;
  color: #333;
}

.user-meta {
  display: flex;
  align-items: center;
  gap: 24px;
  color: #666;
  margin-bottom: 24px;
  font-size: 1.05em;
}

.user-meta .el-icon {
  margin-right: 8px;
  font-size: 18px;
}

.user-meta a {
  color: #1da1f2;
  text-decoration: none;
  transition: color 0.2s ease;
}

.user-meta a:hover {
  color: #1991db;
}

.follow-stats {
  display: flex;
  gap: 32px;
}

.stat-item {
  text-decoration: none;
  color: inherit;
  transition: color 0.2s ease;
  font-size: 1.05em;
}

.stat-item:hover {
  color: #1da1f2;
}

.stat-item strong {
  margin-right: 8px;
}

.stat-item span {
  color: #666;
}

.profile-tabs {
  background: #fff;
  border-radius: 16px;
  padding: 0 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.profile-tabs :deep(.el-tabs__nav-wrap) {
  padding: 0 16px;
}

.profile-tabs :deep(.el-tabs__item) {
  font-size: 1.1em;
  padding: 16px 24px;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 0;
}

.post-item {
  padding: 24px;
  border-bottom: 1px solid #eee;
  transition: all 0.2s ease;
}

.post-item:hover {
  background-color: #f8f9fa;
  border-radius: 12px;
}

.post-header {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.post-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.post-author {
  font-weight: bold;
  font-size: 1.1em;
}

.post-time {
  color: #666;
  font-size: 0.95em;
}

.post-content {
  margin-bottom: 16px;
  line-height: 1.6;
  font-size: 1.05em;
  color: #333;
}

.post-actions {
  display: flex;
  gap: 48px;
}

.post-actions .el-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.2s ease;
}

.post-actions .el-button:hover {
  background-color: rgba(29, 161, 242, 0.1);
  color: #1da1f2;
}

.post-actions .el-icon {
  font-size: 18px;
}

:deep(.el-empty) {
  padding: 48px 0;
}
</style> 