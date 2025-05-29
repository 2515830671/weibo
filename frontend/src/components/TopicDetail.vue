<template>
  <div class="topic-detail">
    <div class="topic-header">
      <h2 class="topic-title"># {{ topic.title }}</h2>
      <p class="topic-meta">
        <span class="topic-category">{{ topic.category }}</span>
        <span class="topic-posts">{{ topic.posts }}条帖子</span>
      </p>
    </div>

    <div class="posts-list">
      <div v-for="post in topicPosts" :key="post.id" class="post-item">
        <div class="post-header">
          <div class="post-user" @click="goToUserProfile(post.userId)">
            <el-avatar :size="40" :src="post.avatar" class="clickable-avatar" />
            <div class="user-info">
              <span class="user-name">{{ post.username }}</span>
              <span class="post-time">{{ formatTime(post.createdAt) }}</span>
            </div>
          </div>
          <el-dropdown trigger="click" @command="command => handlePostAction(command, post.id)">
            <el-button>
              <el-icon><More /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="report">举报</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

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

        <div class="post-actions">
          <div class="action-item">
            <el-button :icon="ChatRound">
              {{ post.comments }}
            </el-button>
          </div>
          <div class="action-item">
            <el-button :icon="Share">
              {{ post.shares }}
            </el-button>
          </div>
          <div class="action-item">
            <el-button
              :icon="post.isLiked ? Star : StarFilled"
              :class="{ 'is-liked': post.isLiked }"
              @click="toggleLike(post.id)"
            >
              {{ post.likes }}
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 举报对话框 -->
    <el-dialog
      v-model="reportDialogVisible"
      title="举报"
      width="400px"
    >
      <el-form :model="reportForm">
        <el-form-item label="举报原因">
          <el-radio-group v-model="reportForm.reason">
            <el-radio label="spam">垃圾信息</el-radio>
            <el-radio label="inappropriate">不当内容</el-radio>
            <el-radio label="violence">暴力内容</el-radio>
            <el-radio label="harassment">骚扰行为</el-radio>
            <el-radio label="other">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="reportForm.reason === 'other'" label="详细说明">
          <el-input
            v-model="reportForm.description"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="reportDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitReport">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { More, ChatRound, Share, Star, StarFilled } from '@element-plus/icons-vue'
import { formatTime } from '@/utils/time'

const props = defineProps<{
  topic: {
    id: number
    title: string
    category: string
    posts: number
  }
}>()

const router = useRouter()

// 话题帖子列表
const topicPosts = ref([
  {
    id: 1,
    userId: 1,
    username: '张三',
    avatar: 'https://placeholder.co/40',
    content: '这是一条测试帖子',
    image: null,
    createdAt: new Date(),
    comments: 2,
    shares: 1,
    likes: 5,
    isLiked: false
  },
  {
    id: 2,
    userId: 2,
    username: '李四',
    avatar: 'https://placeholder.co/40',
    content: '这是另一条测试帖子，带图片',
    image: 'https://placeholder.co/800x400',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    comments: 3,
    shares: 2,
    likes: 8,
    isLiked: true
  }
])

// 举报相关
const reportDialogVisible = ref(false)
const reportForm = ref({
  postId: null as number | null,
  reason: '',
  description: ''
})

// 处理帖子操作
const handlePostAction = (command: string, postId: number) => {
  if (command === 'report') {
    reportForm.value.postId = postId
    reportDialogVisible.value = true
  }
}

// 提交举报
const submitReport = async () => {
  if (!reportForm.value.reason) {
    ElMessage.warning('请选择举报原因')
    return
  }

  try {
    // TODO: 调用举报API
    await new Promise(resolve => setTimeout(resolve, 1000))

    reportDialogVisible.value = false
    reportForm.value = {
      postId: null,
      reason: '',
      description: ''
    }
    ElMessage.success('举报已提交')
  } catch (error) {
    ElMessage.error('提交失败，请重试')
  }
}

// 点赞/取消点赞
const toggleLike = async (postId: number) => {
  try {
    // TODO: 调用点赞API
    await new Promise(resolve => setTimeout(resolve, 300))

    const post = topicPosts.value.find(p => p.id === postId)
    if (post) {
      post.isLiked = !post.isLiked
      post.likes += post.isLiked ? 1 : -1
    }
  } catch (error) {
    ElMessage.error('操作失败，请重试')
  }
}

// 跳转到用户主页
const goToUserProfile = (userId: number) => {
  router.push(`/user/${userId}`)
}
</script>

<style scoped>
.topic-detail {
  padding: 24px;
}

.topic-header {
  margin-bottom: 24px;
}

.topic-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.topic-meta {
  display: flex;
  gap: 16px;
  color: #666;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.post-item {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.post-user {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: bold;
  font-size: 1.1em;
}

.post-time {
  color: #666;
  font-size: 0.9em;
}

.post-content {
  margin-bottom: 16px;
}

.post-text {
  margin-bottom: 12px;
  line-height: 1.6;
  font-size: 1.05em;
}

.post-image {
  border-radius: 12px;
  overflow: hidden;
}

.post-image :deep(.el-image) {
  width: 100%;
  max-height: 400px;
}

.post-actions {
  display: flex;
  gap: 32px;
}

.action-item {
  display: flex;
  align-items: center;
}

.action-item .el-button {
  color: #666;
}

.action-item .el-button.is-liked {
  color: #1da1f2;
}

.clickable-avatar {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.clickable-avatar:hover {
  transform: scale(1.05);
}
</style> 