<template>
  <div class="explore">
    <div v-if="!selectedTopic">
      <h2>探索</h2>
      
      <!-- 热门话题 -->
      <div class="section">
        <h3>热门话题</h3>
        <div class="trending-topics">
          <div
            v-for="topic in trendingTopics"
            :key="topic.id"
            class="topic-card"
            v-show="!hiddenTopics.includes(topic.id)"
            :data-topic-id="topic.id"
          >
            <div class="topic-header">
              <span class="topic-category">{{ topic.category }}</span>
              <el-dropdown trigger="click" @command="command => handleCommand(command, topic.id)">
                <el-button>
                  <el-icon><More /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="notInterested">不感兴趣</el-dropdown-item>
                    <el-dropdown-item command="report">举报</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="topic-content" @click="selectTopic(topic)">
              <h4 class="topic-title"># {{ topic.title }}</h4>
              <p class="topic-posts">{{ topic.posts }}条帖子</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 推荐用户 -->
      <div class="section">
        <h3>推荐关注</h3>
        <div class="recommended-users">
          <div v-for="user in recommendedUsers" :key="user.id" class="user-card">
            <el-avatar 
              :size="50" 
              :src="user.avatar" 
              @click="goToUserProfile(user.id)"
              class="clickable-avatar"
            />
            <div class="user-info">
              <h4 class="user-name" @click="goToUserProfile(user.id)">{{ user.name }}</h4>
              <p class="user-bio">{{ user.bio }}</p>
            </div>
            <el-button
              :type="user.isFollowing ? '' : 'primary'"
              round
              @click="toggleFollow(user.id)"
            >
              {{ user.isFollowing ? '已关注' : '关注' }}
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 话题详情 -->
    <div v-else class="topic-detail-container">
      <div class="back-header">
        <el-button icon="ArrowLeft" @click="selectedTopic = null">
          返回
        </el-button>
        <h2>话题详情</h2>
      </div>
      <TopicDetail :topic="selectedTopic" />
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
import { More, ArrowLeft } from '@element-plus/icons-vue'
import TopicDetail from '@/components/TopicDetail.vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 选中的话题
const selectedTopic = ref(null)

// 隐藏的话题ID列表
const hiddenTopics = ref<number[]>([])

// 热门话题数据
const trendingTopics = ref([
  {
    id: 1,
    category: '科技',
    title: 'Vue3',
    posts: 1234
  },
  {
    id: 2,
    category: '娱乐',
    title: '周末推荐',
    posts: 890
  },
  {
    id: 3,
    category: '体育',
    title: '世界杯',
    posts: 2345
  }
])

// 推荐用户数据
const recommendedUsers = ref([
  {
    id: 1,
    name: '科技达人',
    avatar: 'https://placeholder.co/50',
    bio: '分享最新科技资讯',
    isFollowing: false
  },
  {
    id: 2,
    name: '美食家',
    avatar: 'https://placeholder.co/50',
    bio: '美食探店｜美食分享',
    isFollowing: false
  },
  {
    id: 3,
    name: '旅行者',
    avatar: 'https://placeholder.co/50',
    bio: '带你看世界',
    isFollowing: false
  }
])

// 举报相关
const reportDialogVisible = ref(false)
const reportForm = ref({
  topicId: null as number | null,
  reason: '',
  description: ''
})

// 选择话题
const selectTopic = (topic: any) => {
  selectedTopic.value = topic
}

// 关注/取消关注用户
const toggleFollow = async (userId: number) => {
  try {
    // TODO: 调用关注API
    await new Promise(resolve => setTimeout(resolve, 300))

    const user = recommendedUsers.value.find(u => u.id === userId)
    if (user) {
      user.isFollowing = !user.isFollowing
      ElMessage.success(user.isFollowing ? '已关注' : '已取消关注')
    }
  } catch (error) {
    ElMessage.error('操作失败，请重试')
  }
}

// 处理话题操作
const handleCommand = async (command: string, topicId: number) => {
  if (command === 'notInterested') {
    try {
      // TODO: 调用不感兴趣API
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // 将话题ID添加到隐藏列表
      hiddenTopics.value.push(topicId)
      
      // 使用动画效果隐藏话题卡片
      const topicCard = document.querySelector(`[data-topic-id="${topicId}"]`)
      if (topicCard) {
        topicCard.classList.add('fade-out')
      }
      
      ElMessage.success('已将该话题从你的推荐中移除')
    } catch (error) {
      ElMessage.error('操作失败，请重试')
    }
  } else if (command === 'report') {
    reportForm.value.topicId = topicId
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

    // 隐藏被举报的话题
    if (reportForm.value.topicId) {
      hiddenTopics.value.push(reportForm.value.topicId)
    }

    reportDialogVisible.value = false
    reportForm.value = {
      topicId: null,
      reason: '',
      description: ''
    }
    ElMessage.success('举报已提交')
  } catch (error) {
    ElMessage.error('提交失败，请重试')
  }
}

// 跳转到用户主页
const goToUserProfile = (userId: number) => {
  router.push(`/user/${userId}`)
}
</script>

<style scoped>
.explore {
  padding: 24px;
}

.section {
  margin-bottom: 48px;
}

h2 {
  margin-bottom: 24px;
  font-size: 1.5em;
}

h3 {
  margin-bottom: 16px;
  font-size: 1.2em;
}

.trending-topics {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.topic-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.topic-card.fade-out {
  opacity: 0;
  transform: translateY(20px);
  pointer-events: none;
}

.topic-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.topic-category {
  color: #666;
  font-size: 0.9em;
}

.topic-title {
  margin: 0 0 8px;
  font-size: 1.2em;
}

.topic-posts {
  color: #666;
  font-size: 0.9em;
}

.recommended-users {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.user-info {
  flex: 1;
}

.user-name {
  margin: 0 0 4px;
  font-size: 1.1em;
}

.user-bio {
  color: #666;
  font-size: 0.9em;
}

.back-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.back-header h2 {
  margin: 0;
}

.topic-detail-container {
  background: #fff;
  border-radius: 16px;
  margin: -24px;
  min-height: calc(100vh - 48px);
}

.topic-content {
  cursor: pointer;
}

.topic-header .el-button {
  padding: 8px;
}

.clickable-avatar {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.clickable-avatar:hover {
  transform: scale(1.05);
}

.user-name {
  cursor: pointer;
  transition: color 0.2s ease;
}

.user-name:hover {
  color: #1da1f2;
}
</style> 