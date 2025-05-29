<template>
  <div class="create-post">
    <div class="post-header">
      <el-avatar :size="40" :src="userStore.userInfo?.avatar" />
      <div class="post-input">
        <el-input
          v-model="postContent"
          type="textarea"
          :rows="3"
          placeholder="有什么新鲜事？"
          resize="none"
          :maxlength="280"
          show-word-limit
        />
      </div>
    </div>
    <div v-if="selectedImage" class="image-preview">
      <el-image :src="selectedImage" fit="cover">
        <template #error>
          <div class="image-error">
            <el-icon><Picture /></el-icon>
            <span>图片加载失败</span>
          </div>
        </template>
      </el-image>
      <el-button
        class="remove-image"
        circle
        type="danger"
        :icon="Delete"
        @click="selectedImage = null"
      />
    </div>
    <div class="post-footer">
      <div class="post-actions">
        <el-upload
          class="upload-image"
          action="#"
          :show-file-list="false"
          :before-upload="handleImageUpload"
          accept="image/*"
        >
          <el-button :icon="Picture" circle />
        </el-upload>
        <el-button :icon="VideoCamera" circle />
        <el-button :icon="LocationInformation" circle />
      </div>
      <div class="post-submit">
        <span class="char-count" :class="{ 'near-limit': postContent.length > 250 }">
          {{ postContent.length }}/280
        </span>
        <el-button
          type="primary"
          round
          :disabled="!postContent.trim() || postContent.length > 280"
          :loading="loading"
          @click="handlePost"
        >
          发布
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { Picture, VideoCamera, LocationInformation, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { usePostStore } from '@/stores/post'

const userStore = useUserStore()
const postStore = usePostStore()
const postContent = ref('')
const selectedImage = ref<string | null>(null)
const loading = ref(false)

// 处理图片上传
const handleImageUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return false
  }
  
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB')
    return false
  }
  
  // 创建本地预览URL
  selectedImage.value = URL.createObjectURL(file)
  return false // 阻止默认上传行为
}

// 发布帖子
const handlePost = async () => {
  if (!postContent.value.trim()) return
  
  try {
    loading.value = true
    // 添加新帖子
    postStore.addPost({
      username: userStore.userInfo?.username || '未知用户',
      avatar: userStore.userInfo?.avatar || 'https://placeholder.co/40',
      content: postContent.value,
      image: selectedImage.value
    })
    
    ElMessage.success('发布成功')
    postContent.value = '' // 清空输入
    selectedImage.value = null // 清空已选图片
  } catch (error) {
    ElMessage.error('发布失败，请重试')
    console.error('发布失败:', error)
  } finally {
    loading.value = false
  }
}

// 组件卸载时清理图片URL
onUnmounted(() => {
  if (selectedImage.value) {
    URL.revokeObjectURL(selectedImage.value)
  }
})
</script>

<style scoped>
.create-post {
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.post-header {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.post-input {
  flex: 1;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.post-actions {
  display: flex;
  gap: 8px;
}

.post-submit {
  display: flex;
  align-items: center;
  gap: 16px;
}

.char-count {
  color: #666;
  font-size: 0.9em;
}

.char-count.near-limit {
  color: #e6a23c;
}

:deep(.el-textarea__inner) {
  border: none;
  padding: 8px 0;
  font-size: 1.1em;
}

:deep(.el-textarea__inner:focus) {
  box-shadow: none;
}

:deep(.el-upload) {
  display: flex;
}

.upload-image :deep(.el-button) {
  color: #1da1f2;
}

.image-preview {
  position: relative;
  margin: 12px 0;
  border-radius: 8px;
  overflow: hidden;
  max-height: 300px;
}

.image-preview .el-image {
  width: 100%;
  max-height: 300px;
}

.remove-image {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0.8;
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  background-color: #f8f9fa;
  color: #909399;
}

.image-error .el-icon {
  font-size: 48px;
  margin-bottom: 8px;
}
</style> 