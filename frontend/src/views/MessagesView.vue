<template>
  <div class="messages-container">
    <!-- 对话列表 -->
    <div class="conversations-list">
      <div class="list-header">
        <h2>消息</h2>
        <el-input
          v-model="searchQuery"
          placeholder="搜索私信"
          prefix-icon="Search"
          class="search-input"
        />
      </div>
      <div class="conversation-items">
        <div
          v-for="conversation in conversations"
          :key="conversation.id"
          class="conversation-item"
          :class="{ active: activeConversation?.id === conversation.id }"
          @click="selectConversation(conversation)"
        >
          <el-avatar :size="40" :src="conversation.avatar" />
          <div class="conversation-info">
            <div class="conversation-header">
              <span class="user-name">{{ conversation.userName }}</span>
              <span class="last-time">{{ formatTime(conversation.lastTime) }}</span>
            </div>
            <p class="last-message">{{ conversation.lastMessage }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 聊天窗口 -->
    <div class="chat-window" v-if="activeConversation">
      <div class="chat-header">
        <div class="chat-user-info">
          <el-avatar :size="40" :src="activeConversation.avatar" />
          <span class="user-name">{{ activeConversation.userName }}</span>
        </div>
        <el-dropdown>
          <el-button icon="More" circle />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>查看资料</el-dropdown-item>
              <el-dropdown-item>清空聊天记录</el-dropdown-item>
              <el-dropdown-item>举报</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <div class="chat-messages" ref="messagesContainer">
        <div
          v-for="message in activeConversation.messages"
          :key="message.id"
          class="message"
          :class="{ 'message-self': message.isSelf }"
        >
          <el-avatar
            :size="32"
            :src="message.isSelf ? userStore.userInfo?.avatar : activeConversation.avatar"
          />
          <div class="message-content">
            <!-- 文本消息 -->
            <div v-if="!message.image" class="message-text">{{ message.content }}</div>
            <!-- 图片消息 -->
            <div v-else class="message-image">
              <el-image
                :src="message.image"
                :preview-src-list="[message.image]"
                fit="cover"
                :initial-index="0"
              >
                <template #error>
                  <div class="image-error">
                    <el-icon><Picture /></el-icon>
                    <span>图片加载失败</span>
                  </div>
                </template>
              </el-image>
              <div v-if="message.content" class="message-text image-caption">
                {{ message.content }}
              </div>
            </div>
            <div class="message-time">{{ formatTime(message.time) }}</div>
          </div>
        </div>
      </div>

      <div class="chat-input">
        <!-- 图片预览 -->
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
            @click="removeImage"
          />
        </div>

        <el-input
          v-model="newMessage"
          type="textarea"
          :rows="3"
          :placeholder="selectedImage ? '添加图片说明...' : '发送消息...'"
          resize="none"
          @keyup.enter.native="sendMessage"
        />
        <div class="input-actions">
          <div class="action-left">
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
          </div>
          <el-button
            type="primary"
            :disabled="!newMessage.trim() && !selectedImage"
            @click="sendMessage"
          >
            发送
          </el-button>
        </div>
      </div>
    </div>

    <!-- 未选择对话时的提示 -->
    <div class="no-conversation" v-else>
      <el-empty description="选择一个对话开始聊天" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { Picture, VideoCamera, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface Message {
  id: number
  content: string
  image?: string
  time: Date
  isSelf: boolean
}

interface Conversation {
  id: number
  userName: string
  avatar: string
  lastMessage: string
  lastTime: Date
  messages: Message[]
}

const userStore = useUserStore()
const searchQuery = ref('')
const newMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const selectedImage = ref<string | null>(null)

// 模拟数据
const conversations = ref<Conversation[]>([
  {
    id: 1,
    userName: '张三',
    avatar: 'https://placeholder.co/40',
    lastMessage: '好的，明天见！',
    lastTime: new Date(Date.now() - 3600000),
    messages: [
      {
        id: 1,
        content: '你好，在吗？',
        time: new Date(Date.now() - 7200000),
        isSelf: false
      },
      {
        id: 2,
        content: '在的，什么事？',
        time: new Date(Date.now() - 7000000),
        isSelf: true
      },
      {
        id: 3,
        content: '明天下午有空吗？一起讨论项目',
        time: new Date(Date.now() - 3700000),
        isSelf: false
      },
      {
        id: 4,
        content: '好的，明天见！',
        time: new Date(Date.now() - 3600000),
        isSelf: true
      }
    ]
  },
  {
    id: 2,
    userName: '李四',
    avatar: 'https://placeholder.co/40',
    lastMessage: '收到了，谢谢！',
    lastTime: new Date(Date.now() - 86400000),
    messages: []
  }
])

const activeConversation = ref<Conversation | null>(conversations.value[0])

// 选择对话
const selectConversation = (conversation: Conversation) => {
  activeConversation.value = conversation
  scrollToBottom()
}

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

// 移除已选图片
const removeImage = () => {
  if (selectedImage.value) {
    URL.revokeObjectURL(selectedImage.value)
    selectedImage.value = null
  }
}

// 发送消息
const sendMessage = () => {
  if ((!newMessage.value.trim() && !selectedImage.value) || !activeConversation.value) return

  const message: Message = {
    id: Date.now(),
    content: newMessage.value.trim(),
    ...(selectedImage.value ? { image: selectedImage.value } : {}),
    time: new Date(),
    isSelf: true
  }

  activeConversation.value.messages.push(message)
  activeConversation.value.lastMessage = selectedImage.value ? '[图片]' : newMessage.value
  activeConversation.value.lastTime = new Date()
  
  newMessage.value = ''
  selectedImage.value = null
  scrollToBottom()
}

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
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
  
  return date.toLocaleDateString()
}

onMounted(() => {
  scrollToBottom()
})

// 组件卸载时清理图片URL
onUnmounted(() => {
  if (selectedImage.value) {
    URL.revokeObjectURL(selectedImage.value)
  }
})
</script>

<style scoped>
.messages-container {
  display: grid;
  grid-template-columns: 350px 1fr;
  height: calc(100vh - 32px);
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.conversations-list {
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
}

.list-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.list-header h2 {
  margin: 0 0 16px;
  font-size: 1.5em;
}

.search-input {
  margin-bottom: 8px;
}

.conversation-items {
  flex: 1;
  overflow-y: auto;
}

.conversation-item {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.conversation-item:hover {
  background-color: #f5f5f5;
}

.conversation-item.active {
  background-color: #e8f5fe;
}

.conversation-info {
  flex: 1;
  min-width: 0;
}

.conversation-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.user-name {
  font-weight: bold;
}

.last-time {
  font-size: 0.85em;
  color: #666;
}

.last-message {
  color: #666;
  font-size: 0.9em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
}

.chat-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  max-width: 70%;
}

.message-self {
  flex-direction: row-reverse;
  align-self: flex-end;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-text {
  padding: 12px 16px;
  background-color: #f0f2f5;
  border-radius: 16px;
  border-top-left-radius: 4px;
  line-height: 1.4;
}

.message-self .message-text {
  background-color: #1da1f2;
  color: white;
  border-radius: 16px;
  border-top-right-radius: 4px;
}

.message-time {
  font-size: 0.8em;
  color: #666;
  align-self: flex-end;
}

.chat-input {
  padding: 16px 24px;
  border-top: 1px solid #eee;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.input-actions .el-button {
  margin-right: 8px;
}

.no-conversation {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #f8f9fa;
}

.message-image {
  max-width: 300px;
  border-radius: 12px;
  overflow: hidden;
}

.message-image .el-image {
  width: 100%;
  border-radius: 12px;
  cursor: pointer;
}

.image-caption {
  margin-top: 8px;
  background-color: transparent !important;
  padding: 4px 0 !important;
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100px;
  background-color: #f8f9fa;
  color: #909399;
  font-size: 0.9em;
}

.image-error .el-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.image-preview {
  margin-bottom: 12px;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  max-height: 200px;
}

.image-preview .el-image {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0.8;
}

.action-left {
  display: flex;
  gap: 8px;
}

.upload-image {
  display: inline-block;
}
</style> 