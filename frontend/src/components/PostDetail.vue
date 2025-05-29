<template>
  <div class="post-detail">
    <!-- 帖子内容 -->
    <div class="post-main">
      <div class="post-header">
        <div class="post-user" @click="goToUserProfile(post.userId)">
          <el-avatar :size="50" :src="post.avatar" class="clickable-avatar" />
          <div class="user-info">
            <span class="user-name">{{ post.username }}</span>
            <span class="post-time">{{ formatTime(post.createdAt) }}</span>
          </div>
        </div>
        <el-dropdown trigger="click" @command="command => handlePostAction(command)">
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
            @click="toggleLike"
          >
            {{ post.likes }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- 评论区 -->
    <div class="comments-section">
      <div class="comment-form" v-if="isLoggedIn">
        <el-input
          v-model="commentText"
          type="textarea"
          :rows="3"
          placeholder="发表评论..."
          resize="none"
        />
        <div class="form-actions">
          <el-button type="primary" @click="submitComment">发表评论</el-button>
        </div>
      </div>

      <div class="comments-list">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <div class="comment-user" @click="goToUserProfile(comment.userId)">
            <el-avatar :size="40" :src="comment.avatar" class="clickable-avatar" />
            <div class="user-info">
              <span class="user-name">{{ comment.username }}</span>
              <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
            </div>
          </div>
          <p class="comment-text">{{ comment.content }}</p>
          <div class="comment-actions">
            <el-button text @click="replyToComment(comment)">回复</el-button>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { More, ChatRound, Share, Star, StarFilled } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { formatTime } from '@/utils/time'

const props = defineProps<{
  post: {
    id: number
    userId: number
    username: string
    avatar: string
    content: string
    image?: string
    createdAt: Date
    comments: number
    shares: number
    likes: number
    isLiked: boolean
  }
}>()

const router = useRouter()
const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.isLoggedIn)

// 评论相关
const commentText = ref('')
const comments = ref([
  {
    id: 1,
    userId: 2,
    username: '李四',
    avatar: 'https://placeholder.co/40',
    content: '支持一下！',
    createdAt: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: 2,
    userId: 3,
    username: '王五',
    avatar: 'https://placeholder.co/40',
    content: '写得很好！',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  }
])

// 举报相关
const reportDialogVisible = ref(false)
const reportForm = ref({
  reason: '',
  description: ''
})

// 处理帖子操作
const handlePostAction = (command: string) => {
  if (command === 'report') {
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
      reason: '',
      description: ''
    }
    ElMessage.success('举报已提交')
  } catch (error) {
    ElMessage.error('提交失败，请重试')
  }
}

// 点赞/取消点赞
const toggleLike = async () => {
  if (!isLoggedIn.value) {
    ElMessage.warning('请先登录')
    return
  }

  try {
    // TODO: 调用点赞API
    await new Promise(resolve => setTimeout(resolve, 300))
    props.post.isLiked = !props.post.isLiked
    props.post.likes += props.post.isLiked ? 1 : -1
  } catch (error) {
    ElMessage.error('操作失败，请重试')
  }
}

// 提交评论
const submitComment = async () => {
  if (!commentText.value.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }

  try {
    // TODO: 调用评论API
    await new Promise(resolve => setTimeout(resolve, 500))

    // 模拟添加评论
    comments.value.unshift({
      id: Date.now(),
      userId: userStore.userInfo?.id || 0,
      username: userStore.userInfo?.username || '',
      avatar: userStore.userInfo?.avatar || '',
      content: commentText.value,
      createdAt: new Date()
    })

    props.post.comments++
    commentText.value = ''
    ElMessage.success('评论成功')
  } catch (error) {
    ElMessage.error('评论失败，请重试')
  }
}

// 回复评论
const replyToComment = (comment: any) => {
  if (!isLoggedIn.value) {
    ElMessage.warning('请先登录')
    return
  }
  commentText.value = `@${comment.username} `
}

// 跳转到用户主页
const goToUserProfile = (userId: number) => {
  router.push(`/user/${userId}`)
}
</script>

<style scoped>
.post-detail {
  max-width: 800px;
  margin: 0 auto;
}

.post-main {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
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
  gap: 16px;
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
  margin-bottom: 24px;
}

.post-text {
  margin-bottom: 16px;
  line-height: 1.6;
  font-size: 1.1em;
  color: #333;
}

.post-image {
  border-radius: 12px;
  overflow: hidden;
}

.post-image :deep(.el-image) {
  width: 100%;
  max-height: 500px;
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

.comments-section {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.comment-form {
  margin-bottom: 24px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.comment-item {
  border-bottom: 1px solid #eee;
  padding-bottom: 24px;
}

.comment-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.comment-user {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  cursor: pointer;
}

.comment-time {
  color: #666;
  font-size: 0.9em;
}

.comment-text {
  line-height: 1.6;
  font-size: 1.05em;
  color: #333;
  margin-bottom: 12px;
}

.comment-actions {
  display: flex;
  gap: 16px;
}

.clickable-avatar {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.clickable-avatar:hover {
  transform: scale(1.05);
}
</style> 