<template>
  <div class="message">
    <div class="message-header">
      <h2>消息</h2>
      <el-input
        v-model="searchQuery"
        placeholder="搜索私信..."
        prefix-icon="Search"
      />
    </div>

    <!-- 消息列表 -->
    <div class="message-list">
      <div v-for="chat in filteredChats" :key="chat.id" class="chat-item">
        <div class="chat-avatar" @click="goToUserProfile(chat.userId)">
          <el-avatar :size="50" :src="chat.avatar" />
        </div>
        <div class="chat-content" @click="openChat(chat)">
          <div class="chat-header">
            <span class="chat-name">{{ chat.name }}</span>
            <span class="chat-time">{{ formatTime(chat.lastMessage.time) }}</span>
          </div>
          <p class="chat-message">{{ chat.lastMessage.content }}</p>
        </div>
      </div>
    </div>

    <!-- 聊天窗口 -->
    <el-dialog
      v-model="chatDialogVisible"
      :title="currentChat?.name"
      width="600px"
      class="chat-dialog"
    >
      <div class="chat-messages" ref="messagesContainer">
        <div v-for="message in currentChat?.messages" :key="message.id" class="message-item">
          <div class="message-avatar" @click="goToUserProfile(message.userId)">
            <el-avatar :size="40" :src="message.avatar" />
          </div>
          <div class="message-content">
            <div class="message-info">
              <span class="message-name">{{ message.name }}</span>
              <span class="message-time">{{ formatTime(message.time) }}</span>
            </div>
            <div class="message-text">
              <template v-if="message.type === 'text'">
                {{ message.content }}
              </template>
              <template v-else-if="message.type === 'image'">
                <el-image
                  :src="message.content"
                  :preview-src-list="[message.content]"
                  fit="cover"
                  class="message-image"
                />
              </template>
            </div>
          </div>
        </div>
      </div>
      
      <div class="message-input">
        <el-input
          v-model="newMessage"
          type="textarea"
          :rows="3"
          placeholder="发送消息..."
          resize="none"
          @keyup.enter="sendMessage"
        />
        <div class="input-actions">
          <el-upload
            action="#"
            :show-file-list="false"
            :before-upload="handleImageUpload"
            accept="image/*"
          >
            <el-button :icon="Picture">图片</el-button>
          </el-upload>
          <el-button type="primary" @click="sendMessage">发送</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'
import { formatTime } from '@/utils/time'

const router = useRouter()
const searchQuery = ref('')
const chatDialogVisible = ref(false)
const newMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

// 聊天列表数据
const chatList = ref([
  {
    id: 1,
    userId: 1,
    name: '张三',
    avatar: 'https://placeholder.co/50',
    lastMessage: {
      content: '好的，明天见！',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    messages: [
      {
        id: 1,
        userId: 1,
        name: '张三',
        avatar: 'https://placeholder.co/40',
        content: '你好，在吗？',
        type: 'text',
        time: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        id: 2,
        userId: 2,
        name: '我',
        avatar: 'https://placeholder.co/40',
        content: '在的，什么事？',
        type: 'text',
        time: new Date(Date.now() - 23 * 60 * 60 * 1000)
      },
      {
        id: 3,
        userId: 1,
        name: '张三',
        avatar: 'https://placeholder.co/40',
        content: '明天下午有空吗？讨论一下项目',
        type: 'text',
        time: new Date(Date.now() - 3 * 60 * 60 * 1000)
      },
      {
        id: 4,
        userId: 2,
        name: '我',
        avatar: 'https://placeholder.co/40',
        content: '有空，下午2点可以吗？',
        type: 'text',
        time: new Date(Date.now() - 2.5 * 60 * 60 * 1000)
      },
      {
        id: 5,
        userId: 1,
        name: '张三',
        avatar: 'https://placeholder.co/40',
        content: '好的，明天见！',
        type: 'text',
        time: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ]
  },
  {
    id: 2,
    userId: 2,
    name: '李四',
    avatar: 'https://placeholder.co/50',
    lastMessage: {
      content: '[图片]',
      time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    messages: [
      {
        id: 1,
        userId: 2,
        name: '李四',
        avatar: 'https://placeholder.co/40',
        content: 'https://placeholder.co/400x300',
        type: 'image',
        time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ]
  }
])

// 当前聊天对象
const currentChat = ref(null)

// 根据搜索关键词过滤聊天列表
const filteredChats = computed(() => {
  if (!searchQuery.value) return chatList.value
  const query = searchQuery.value.toLowerCase()
  return chatList.value.filter(chat => 
    chat.name.toLowerCase().includes(query) ||
    chat.lastMessage.content.toLowerCase().includes(query)
  )
})

// 打开聊天窗口
const openChat = (chat: any) => {
  currentChat.value = chat
  chatDialogVisible.value = true
  // 等待DOM更新后滚动到底部
  nextTick(() => {
    scrollToBottom()
  })
}

// 发送消息
const sendMessage = () => {
  if (!newMessage.value.trim()) return

  if (currentChat.value) {
    // 添加新消息
    currentChat.value.messages.push({
      id: Date.now(),
      userId: 2, // 当前用户ID
      name: '我',
      avatar: 'https://placeholder.co/40',
      content: newMessage.value,
      type: 'text',
      time: new Date()
    })

    // 更新最后一条消息
    currentChat.value.lastMessage = {
      content: newMessage.value,
      time: new Date()
    }

    // 清空输入框
    newMessage.value = ''

    // 滚动到底部
    nextTick(() => {
      scrollToBottom()
    })
  }
}

// 处理图片上传
const handleImageUpload = async (file: File) => {
  try {
    // TODO: 实现图片上传
    const imageUrl = URL.createObjectURL(file)
    
    if (currentChat.value) {
      // 添加图片消息
      currentChat.value.messages.push({
        id: Date.now(),
        userId: 2, // 当前用户ID
        name: '我',
        avatar: 'https://placeholder.co/40',
        content: imageUrl,
        type: 'image',
        time: new Date()
      })

      // 更新最后一条消息
      currentChat.value.lastMessage = {
        content: '[图片]',
        time: new Date()
      }

      // 滚动到底部
      nextTick(() => {
        scrollToBottom()
      })
    }
  } catch (error) {
    ElMessage.error('图片上传失败，请重试')
  }
  return false
}

// 滚动到底部
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 跳转到用户主页
const goToUserProfile = (userId: number) => {
  router.push(`/user/${userId}`)
}

onMounted(() => {
  // 初始化时滚动到底部
  nextTick(() => {
    scrollToBottom()
  })
})
</script>

<style scoped>
.message {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.message-header {
  margin-bottom: 24px;
}

.message-header h2 {
  margin-bottom: 16px;
  font-size: 1.5em;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chat-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  transition: background-color 0.2s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.chat-item:hover {
  background-color: #f8f9fa;
}

.chat-avatar {
  cursor: pointer;
}

.chat-content {
  flex: 1;
  cursor: pointer;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.chat-name {
  font-weight: bold;
  font-size: 1.1em;
}

.chat-time {
  color: #666;
  font-size: 0.9em;
}

.chat-message {
  color: #666;
  font-size: 0.95em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-dialog {
  --el-dialog-padding-primary: 0;
}

.chat-messages {
  height: 400px;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.message-item {
  display: flex;
  gap: 12px;
}

.message-avatar {
  cursor: pointer;
}

.message-content {
  flex: 1;
  max-width: 70%;
}

.message-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.message-name {
  font-weight: bold;
}

.message-time {
  color: #666;
  font-size: 0.9em;
}

.message-text {
  background: #f0f2f5;
  padding: 12px;
  border-radius: 12px;
  line-height: 1.5;
}

.message-image {
  max-width: 100%;
  border-radius: 12px;
}

.message-input {
  padding: 24px;
  border-top: 1px solid #eee;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}
</style> 