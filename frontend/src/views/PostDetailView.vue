<template>
  <div class="post-detail-view">
    <div class="back-header">
      <el-button icon="ArrowLeft" @click="router.back()">
        返回
      </el-button>
      <h2>帖子详情</h2>
    </div>

    <PostDetail v-if="post" :post="post" />

    <div v-else class="loading-state">
      <el-skeleton :rows="10" animated />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import PostDetail from '@/components/PostDetail.vue'

const route = useRoute()
const router = useRouter()
const postId = route.params.id

// 帖子数据
const post = ref(null)

// 获取帖子详情
const fetchPostDetail = async () => {
  try {
    // TODO: 调用获取帖子详情API
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 模拟API返回数据
    post.value = {
      id: Number(postId),
      userId: 1,
      username: '张三',
      avatar: 'https://placeholder.co/50',
      content: '这是一条测试帖子',
      image: 'https://placeholder.co/800x400',
      createdAt: new Date(),
      comments: 2,
      shares: 1,
      likes: 5,
      isLiked: false
    }
  } catch (error) {
    ElMessage.error('获取帖子失败')
  }
}

onMounted(() => {
  fetchPostDetail()
})
</script>

<style scoped>
.post-detail-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.back-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.back-header h2 {
  margin: 0;
  font-size: 1.5em;
}

.loading-state {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}
</style> 