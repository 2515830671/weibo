<template>
  <div class="user-profile">
    <!-- 用户资料头部 -->
    <div class="profile-header">
      <div class="cover-image">
        <img :src="userInfo?.coverImage || 'https://placeholder.co/1500x500'" alt="封面图片" />
      </div>
      <div class="profile-info">
        <div class="avatar-container">
          <el-avatar :size="120" :src="userInfo?.avatar || 'https://placeholder.co/120'" />
        </div>
        <div class="profile-actions">
          <el-button
            v-if="userInfo?.id !== currentUser?.id"
            :type="isFollowing ? '' : 'primary'"
            round
            @click="toggleFollow"
          >
            {{ isFollowing ? '已关注' : '关注' }}
          </el-button>
        </div>
        <h1 class="user-name">{{ userInfo?.username }}</h1>
        <p class="user-handle">@{{ userInfo?.username?.toLowerCase() }}</p>
        <p class="user-bio">{{ userInfo?.bio || '这个人很懒，什么都没写' }}</p>
        <div class="user-meta">
          <template v-if="userInfo?.location">
            <el-icon><Location /></el-icon>
            <span>{{ userInfo.location }}</span>
          </template>
          <template v-if="userInfo?.website">
            <el-icon><Link /></el-icon>
            <a :href="userInfo.website" target="_blank">{{ userInfo.website }}</a>
          </template>
          <template v-if="userInfo?.joinTime">
            <el-icon><Calendar /></el-icon>
            <span>{{ formatJoinTime }}</span>
          </template>
        </div>
        <div class="follow-stats">
          <a href="#" class="stat-item">
            <strong>{{ userInfo?.following || 0 }}</strong>
            <span>正在关注</span>
          </a>
          <a href="#" class="stat-item">
            <strong>{{ userInfo?.followers || 0 }}</strong>
            <span>关注者</span>
          </a>
        </div>
      </div>
    </div>

    <!-- 内容标签页 -->
    <div class="profile-tabs">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="帖子" name="posts">
          <div class="posts-list">
            <div v-for="post in userPosts" :key="post.id" class="post-item">
              <div class="post-content">
                <p class="post-text">{{ post.content }}</p>
                <div v-if="post.image" class="post-image">
                  <el-image
                    :src="post.image"
                    :preview-src-list="[post.image]"
                    fit="cover"
                  />
                </div>
              </div>
              <div class="post-meta">
                <span class="post-time">{{ formatTime(post.createdAt) }}</span>
                <div class="post-stats">
                  <span>{{ post.comments }} 评论</span>
                  <span>{{ post.shares }} 转发</span>
                  <span>{{ post.likes }} 喜欢</span>
                </div>
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
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Location, Link, Calendar } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { formatTime } from '@/utils/time'

const route = useRoute()
const userStore = useUserStore()
const userId = computed(() => route.params.id as string)
const currentUser = computed(() => userStore.userInfo)

// 用户信息
const userInfo = ref({
  id: userId.value,
  username: '用户' + userId.value,
  avatar: 'https://placeholder.co/120',
  coverImage: 'https://placeholder.co/1500x500',
  bio: '这是一个测试用户',
  location: '北京',
  website: 'https://example.com',
  joinTime: new Date('2023-01-01'),
  following: 123,
  followers: 456
})

// 是否已关注
const isFollowing = ref(false)

// 当前标签页
const activeTab = ref('posts')

// 用户帖子列表
const userPosts = ref([
  {
    id: 1,
    content: '这是一条测试帖子',
    image: null,
    createdAt: new Date(),
    comments: 2,
    shares: 1,
    likes: 5
  },
  {
    id: 2,
    content: '这是另一条测试帖子，带图片',
    image: 'https://placeholder.co/800x400',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    comments: 3,
    shares: 2,
    likes: 8
  }
])

// 格式化加入时间
const formatJoinTime = computed(() => {
  if (!userInfo.value?.joinTime) return ''
  return new Date(userInfo.value.joinTime).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long'
  }) + '加入'
})

// 关注/取消关注
const toggleFollow = async () => {
  try {
    // TODO: 调用关注API
    await new Promise(resolve => setTimeout(resolve, 300))
    isFollowing.value = !isFollowing.value
    ElMessage.success(isFollowing.value ? '已关注' : '已取消关注')
  } catch (error) {
    ElMessage.error('操作失败，请重试')
  }
}

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    // TODO: 调用获取用户信息API
    await new Promise(resolve => setTimeout(resolve, 500))
    // 模拟API返回数据
    // userInfo.value = ...
  } catch (error) {
    ElMessage.error('获取用户信息失败')
  }
}

// 获取用户帖子
const fetchUserPosts = async () => {
  try {
    // TODO: 调用获取用户帖子API
    await new Promise(resolve => setTimeout(resolve, 500))
    // 模拟API返回数据
    // userPosts.value = ...
  } catch (error) {
    ElMessage.error('获取帖子失败')
  }
}

onMounted(() => {
  fetchUserInfo()
  fetchUserPosts()
})
</script>

<style scoped>
.user-profile {
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
}

.cover-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info {
  padding: 24px;
  position: relative;
}

.avatar-container {
  position: absolute;
  top: -80px;
  left: 24px;
}

.avatar-container .el-avatar {
  border: 6px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  padding: 24px 0;
}

.post-item {
  padding: 24px;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s ease;
}

.post-item:hover {
  background-color: #f8f9fa;
}

.post-content {
  margin-bottom: 16px;
}

.post-text {
  margin-bottom: 12px;
  line-height: 1.6;
  font-size: 1.05em;
  color: #333;
}

.post-image {
  border-radius: 12px;
  overflow: hidden;
}

.post-image :deep(.el-image) {
  width: 100%;
  max-height: 400px;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #666;
  font-size: 0.95em;
}

.post-stats {
  display: flex;
  gap: 16px;
}
</style> 