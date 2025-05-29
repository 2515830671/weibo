<template>
  <div class="notifications">
    <div class="notifications-header">
      <h2>通知</h2>
      <el-button text @click="markAllAsRead">全部标记为已读</el-button>
    </div>

    <div class="notifications-list">
      <div v-for="notification in notifications" :key="notification.id" class="notification-item">
        <div class="notification-avatar" @click="goToUserProfile(notification.userId)">
          <el-avatar :size="50" :src="notification.avatar" class="clickable-avatar" />
        </div>
        <div class="notification-content" @click="openPost(notification)">
          <div class="notification-header">
            <span class="notification-name">{{ notification.username }}</span>
            <span class="notification-time">{{ formatTime(notification.createdAt) }}</span>
          </div>
          <p class="notification-text">
            <span class="action-text">{{ getActionText(notification.type) }}</span>
            {{ notification.content }}
          </p>
          <div v-if="notification.postImage" class="notification-image">
            <el-image
              :src="notification.postImage"
              :preview-src-list="[notification.postImage]"
              fit="cover"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 帖子详情对话框 -->
    <el-dialog
      v-model="postDialogVisible"
      :title="selectedPost?.username + '的帖子'"
      width="800px"
      class="post-dialog"
      :append-to-body="true"
    >
      <PostDetail v-if="selectedPost" :post="selectedPost" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { formatTime } from '@/utils/time'
import PostDetail from '@/components/PostDetail.vue'

const router = useRouter()

// 通知列表数据
const notifications = ref([
  {
    id: 1,
    type: 'like',
    userId: 1,
    username: '张三',
    avatar: 'https://placeholder.co/50',
    content: '喜欢了你的帖子',
    postId: 1,
    postContent: '今天天气真不错！',
    postImage: null,
    createdAt: new Date(Date.now() - 3 * 60 * 1000)
  },
  {
    id: 2,
    type: 'share',
    userId: 2,
    username: '李四',
    avatar: 'https://placeholder.co/50',
    content: '转发了你的帖子',
    postId: 2,
    postContent: '分享一个很棒的发现！',
    postImage: 'https://placeholder.co/400x300',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
  },
  {
    id: 3,
    type: 'comment',
    userId: 3,
    username: '王五',
    avatar: 'https://placeholder.co/50',
    content: '在帖子中提到了你',
    postId: 3,
    postContent: '@用户名 快来看这个！',
    postImage: null,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  }
])

// 帖子详情相关
const postDialogVisible = ref(false)
const selectedPost = ref(null)

// 获取操作文本
const getActionText = (type: string) => {
  switch (type) {
    case 'like':
      return '喜欢了你的帖子'
    case 'share':
      return '转发了你的帖子'
    case 'comment':
      return '评论了你的帖子'
    case 'mention':
      return '在帖子中提到了你'
    default:
      return ''
  }
}

// 打开帖子详情
const openPost = (notification: any) => {
  selectedPost.value = {
    id: notification.postId,
    userId: notification.userId,
    username: notification.username,
    avatar: notification.avatar,
    content: notification.postContent,
    image: notification.postImage,
    createdAt: notification.createdAt,
    comments: 0,
    shares: 0,
    likes: 0,
    isLiked: false
  }
  postDialogVisible.value = true
}

// 跳转到用户主页
const goToUserProfile = (userId: number) => {
  router.push(`/user/${userId}`)
}

// 标记全部已读
const markAllAsRead = async () => {
  try {
    // TODO: 调用标记已读API
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success('已全部标记为已读')
  } catch (error) {
    ElMessage.error('操作失败，请重试')
  }
}
</script>

<style scoped>
.notifications {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.notifications-header h2 {
  font-size: 1.5em;
  margin: 0;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.notification-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  transition: background-color 0.2s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.notification-item:hover {
  background-color: #f8f9fa;
}

.notification-avatar {
  cursor: pointer;
}

.notification-content {
  flex: 1;
  cursor: pointer;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.notification-name {
  font-weight: bold;
  font-size: 1.1em;
}

.notification-time {
  color: #666;
  font-size: 0.9em;
}

.notification-text {
  margin-bottom: 12px;
  line-height: 1.5;
  color: #333;
}

.action-text {
  color: #1da1f2;
  margin-right: 4px;
}

.notification-image {
  border-radius: 12px;
  overflow: hidden;
}

.notification-image :deep(.el-image) {
  width: 100%;
  max-height: 200px;
}

.post-dialog {
  --el-dialog-padding-primary: 24px;
}

.clickable-avatar {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.clickable-avatar:hover {
  transform: scale(1.05);
}
</style> 