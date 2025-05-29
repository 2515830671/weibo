<template>
  <div class="post-list">
    <div v-for="post in postStore.posts" :key="post.id" class="post-item">
      <div class="post-avatar">
        <el-avatar :size="40" :src="post.avatar" />
      </div>
      <div class="post-content">
        <div class="post-header">
          <span class="post-author">{{ post.username }}</span>
          <span class="post-time">{{ formatTime(post.createdAt) }}</span>
        </div>
        <div class="post-text">{{ post.content }}</div>
        <div v-if="post.image" class="post-image">
          <el-image
            :src="post.image"
            :preview-src-list="[post.image]"
            fit="cover"
          />
        </div>
        <div class="post-actions">
          <el-button :icon="ChatRound" circle @click="openCommentDialog(post)">
            <span class="action-count">{{ post.comments }}</span>
          </el-button>
          <el-button :icon="Share" circle>
            <span class="action-count">{{ post.shares }}</span>
          </el-button>
          <el-button
            :icon="post.liked ? StarFilled : Star"
            circle
            :class="{ 'liked': post.liked }"
            @click="handleLike(post.id)"
          >
            <span class="action-count">{{ post.likes }}</span>
          </el-button>
        </div>
      </div>
    </div>
    <div v-if="postStore.loading" class="loading-more">
      <el-spinner />
    </div>

    <!-- 评论对话框 -->
    <comment-dialog
      v-model="showCommentDialog"
      :post="selectedPost"
      @submit="handleCommentSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onMounted } from 'vue'
import { ChatRound, Share, Star, StarFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { usePostStore } from '@/stores/post'
import CommentDialog from './CommentDialog.vue'

const postStore = usePostStore()
const showCommentDialog = ref(false)
const selectedPost = ref(null)

// 格式化时间
const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`
  
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}天前`
  
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}个月前`
  
  return `${Math.floor(months / 12)}年前`
}

// 点赞/取消点赞
const handleLike = async (postId: number) => {
  try {
    await postStore.toggleLike(postId)
    ElMessage.success('操作成功')
  } catch (error) {
    ElMessage.error('操作失败，请重试')
  }
}

// 打开评论对话框
const openCommentDialog = (post: any) => {
  selectedPost.value = post
  showCommentDialog.value = true
}

// 处理评论提交
const handleCommentSubmit = async (comment: string) => {
  if (!selectedPost.value) return
  
  try {
    // TODO: 调用评论API
    await postStore.addComment(selectedPost.value.id, comment)
    ElMessage.success('评论成功')
  } catch (error) {
    ElMessage.error('评论失败，请重试')
  }
}

// 组件挂载时加载帖子
onMounted(async () => {
  try {
    await postStore.loadPosts()
  } catch (error) {
    ElMessage.error('加载帖子失败，请刷新页面重试')
  }
})
</script>

<style scoped>
.post-list {
  display: flex;
  flex-direction: column;
}

.post-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s ease;
}

.post-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.post-content {
  flex: 1;
}

.post-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.post-author {
  font-weight: bold;
}

.post-time {
  color: #666;
  font-size: 0.9em;
}

.post-text {
  margin-bottom: 12px;
  line-height: 1.5;
}

.post-image {
  margin-bottom: 12px;
  border-radius: 16px;
  overflow: hidden;
}

.post-image :deep(.el-image) {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
}

.post-actions {
  display: flex;
  gap: 32px;
}

.post-actions .el-button {
  margin: 0;
}

.action-count {
  margin-left: 4px;
  font-size: 0.9em;
  color: #666;
}

.liked {
  color: #e6a23c;
}

.loading-more {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}
</style> 