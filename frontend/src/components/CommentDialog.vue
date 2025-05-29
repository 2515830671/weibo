<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="500px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="post-preview" v-if="post">
      <div class="post-header">
        <el-avatar :size="40" :src="post.avatar" />
        <div class="post-info">
          <div class="post-author">{{ post.username }}</div>
          <div class="post-time">{{ formatTime(post.createdAt) }}</div>
        </div>
      </div>
      <div class="post-content">{{ post.content }}</div>
      <div v-if="post.image" class="post-image">
        <el-image :src="post.image" fit="cover" />
      </div>
    </div>

    <div class="comments-section">
      <div class="comments-list" v-if="comments.length > 0">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <el-avatar :size="32" :src="comment.avatar" />
          <div class="comment-content">
            <div class="comment-header">
              <span class="comment-author">{{ comment.username }}</span>
              <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
            </div>
            <div class="comment-text">{{ comment.content }}</div>
          </div>
        </div>
      </div>
      <div v-else class="no-comments">
        暂无评论，来发表第一条评论吧
      </div>
    </div>

    <div class="comment-form">
      <el-input
        v-model="newComment"
        type="textarea"
        :rows="2"
        placeholder="发表评论..."
        :maxlength="200"
        show-word-limit
        resize="none"
      />
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          :disabled="!newComment.trim()"
          @click="handleSubmit"
        >
          发表评论
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { usePostStore } from '@/stores/post'
import type { Post, Comment } from '@/types/post'

const props = defineProps<{
  modelValue: boolean
  post?: Post
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [comment: string]
}>()

const userStore = useUserStore()
const postStore = usePostStore()
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const title = computed(() => props.post ? `评论 ${props.post.username} 的帖子` : '评论')
const newComment = ref('')
const loading = ref(false)
const comments = ref<Comment[]>([])

// 加载评论
const loadComments = async () => {
  if (!props.post) return
  
  try {
    comments.value = await postStore.getComments(props.post.id)
  } catch (error) {
    ElMessage.error('加载评论失败，请重试')
    console.error('加载评论失败:', error)
  }
}

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

// 提交评论
const handleSubmit = async () => {
  if (!newComment.value.trim() || !props.post) return
  
  try {
    loading.value = true
    await postStore.addComment(props.post.id, newComment.value)
    
    // 重新加载评论列表
    await loadComments()
    
    emit('submit', newComment.value)
    newComment.value = ''
    ElMessage.success('评论成功')
  } catch (error) {
    ElMessage.error('评论失败，请重试')
    console.error('评论失败:', error)
  } finally {
    loading.value = false
  }
}

// 监听对话框显示状态，加载评论
watch(() => props.modelValue, async (newVal) => {
  if (newVal && props.post) {
    await loadComments()
  }
})

// 关闭对话框时清空评论
const handleClose = () => {
  newComment.value = ''
}
</script>

<style scoped>
.post-preview {
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 16px;
}

.post-header {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.post-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.post-author {
  font-weight: bold;
}

.post-time {
  font-size: 0.9em;
  color: #666;
}

.post-content {
  margin-bottom: 12px;
  line-height: 1.5;
}

.post-image {
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
}

.post-image :deep(.el-image) {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
}

.comments-section {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 16px;
  padding: 0 16px;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment-item {
  display: flex;
  gap: 12px;
}

.comment-content {
  flex: 1;
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.comment-author {
  font-weight: bold;
  font-size: 0.95em;
}

.comment-time {
  font-size: 0.85em;
  color: #666;
}

.comment-text {
  font-size: 0.95em;
  line-height: 1.4;
}

.no-comments {
  text-align: center;
  color: #999;
  padding: 32px 0;
}

.comment-form {
  padding: 0 16px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.el-dialog__body) {
  padding-top: 16px;
  padding-bottom: 16px;
}
</style> 