<script setup lang="ts">
import { ref } from 'vue'
import { Picture, VideoCamera, Location, ChatRound, Share, Star } from '@element-plus/icons-vue'
import CreatePost from '@/components/CreatePost.vue'
import PostList from '@/components/PostList.vue'
import { useUserStore } from '@/stores/user'

const newPost = ref('')
const userStore = useUserStore()

// 模拟数据
const posts = ref([
  {
    id: 1,
    author: '张三',
    username: 'zhangsan',
    avatar: 'https://placeholder.co/40',
    content: '今天天气真不错！',
    time: '3分钟前',
    comments: 12,
    shares: 5,
    likes: 23
  },
  {
    id: 2,
    author: '李四',
    username: 'lisi',
    avatar: 'https://placeholder.co/40',
    content: '刚刚学习了Vue 3，感觉很棒！',
    time: '10分钟前',
    comments: 8,
    shares: 2,
    likes: 15
  }
])
</script>

<template>
  <div class="home">
    <div class="page-header">
      <h1>首页</h1>
    </div>
    
    <CreatePost v-if="userStore.isLoggedIn" />
    <PostList />
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
}

.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #eee;
}

h1 {
  margin: 0;
  font-size: 1.5em;
  font-weight: bold;
}

.post-form {
  padding: 24px;
  border-bottom: 1px solid #eee;
  background-color: #fff;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.post-form-header {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.post-form-header :deep(.el-textarea__inner) {
  border: none;
  padding: 12px;
  resize: none;
  font-size: 1.1em;
  background-color: transparent;
}

.post-form-header :deep(.el-textarea__inner):focus {
  background-color: #f8f9fa;
  border-radius: 12px;
}

.post-form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.post-form-actions {
  display: flex;
  gap: 12px;
}

.post-form-actions .el-button {
  width: 40px;
  height: 40px;
}

.post-item {
  display: flex;
  gap: 16px;
  padding: 24px;
  border-bottom: 1px solid #eee;
  background-color: #fff;
  border-radius: 16px;
  margin-bottom: 16px;
  transition: all 0.2s ease;
}

.post-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}

.post-content {
  flex: 1;
}

.post-header {
  margin-bottom: 8px;
}

.post-author {
  font-weight: bold;
  font-size: 1.1em;
}

.post-username,
.post-time {
  color: #666;
  margin-left: 8px;
}

.post-text {
  margin-bottom: 16px;
  line-height: 1.6;
  font-size: 1.05em;
}

.post-actions {
  display: flex;
  gap: 48px;
}

.post-actions .el-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
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
</style>
