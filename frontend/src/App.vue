<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref, computed } from 'vue'
import { HomeFilled, Search, Bell, Message, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import LoginDialog from './components/LoginDialog.vue'
import RegisterDialog from './components/RegisterDialog.vue'
import { useUserStore } from './stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()
const showLoginDialog = ref(false)
const showRegisterDialog = ref(false)
const searchQuery = ref('')

const handleLogin = async (formData: { username: string; password: string }) => {
  try {
    await userStore.login({
      email: formData.username,
      password: formData.password
    })
    
    showLoginDialog.value = false
    ElMessage.success('登录成功')
    
    // 如果有重定向路径，登录后跳转
    const redirect = router.currentRoute.value.query.redirect as string
    if (redirect) {
      router.push(redirect)
    } else {
      // 如果没有重定向路径，刷新当前页面
      router.go(0)
    }
  } catch (error) {
    ElMessage.error('用户名或密码错误')
    console.error('登录失败:', error)
  }
}

const handleRegister = async (formData: { username: string; email: string; password: string }) => {
  try {
    // TODO: 调用注册API
    console.log('注册:', formData)
    // 模拟注册成功
    userStore.login({
      username: formData.username,
      email: formData.email,
      avatar: 'https://placeholder.co/40'
    })
    showRegisterDialog.value = false
    ElMessage.success('注册成功')
  } catch (error) {
    ElMessage.error('注册失败，请重试')
    console.error('注册失败:', error)
  }
}

const handleLogout = async () => {
  try {
    // TODO: 调用登出API
    userStore.logout()
    ElMessage.success('已退出登录')
    // 退出后返回首页
    router.push('/')
  } catch (error) {
    ElMessage.error('退出失败，请重试')
    console.error('退出失败:', error)
  }
}

const switchToRegister = () => {
  showLoginDialog.value = false
  showRegisterDialog.value = true
}

const switchToLogin = () => {
  showRegisterDialog.value = false
  showLoginDialog.value = true
}

const handleNavClick = (route: string) => {
  if (!userStore.isLoggedIn && route !== '/') {
    showLoginDialog.value = true
    return false
  }
  return true
}
</script>

<template>
  <div class="app-container">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <div class="logo">
        <el-icon :size="30"><HomeFilled /></el-icon>
      </div>
      <nav class="nav-menu">
        <router-link to="/" class="nav-item" @click="handleNavClick('/')">
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </router-link>
        <router-link
          v-if="userStore.isLoggedIn"
          to="/explore"
          class="nav-item"
          @click="handleNavClick('/explore')"
        >
          <el-icon><Search /></el-icon>
          <span>探索</span>
        </router-link>
        <router-link
          v-if="userStore.isLoggedIn"
          to="/notifications"
          class="nav-item"
          @click="handleNavClick('/notifications')"
        >
          <el-icon><Bell /></el-icon>
          <span>通知</span>
        </router-link>
        <router-link
          v-if="userStore.isLoggedIn"
          to="/messages"
          class="nav-item"
          @click="handleNavClick('/messages')"
        >
          <el-icon><Message /></el-icon>
          <span>消息</span>
        </router-link>
        <router-link
          v-if="userStore.isLoggedIn"
          to="/profile"
          class="nav-item"
          @click="handleNavClick('/profile')"
        >
          <el-icon><User /></el-icon>
          <span>个人资料</span>
        </router-link>
      </nav>
      
      <!-- 登录/注册按钮 -->
      <template v-if="!userStore.isLoggedIn">
        <el-button type="primary" class="auth-btn" round @click="showLoginDialog = true">
          登录
        </el-button>
        <el-button class="auth-btn" round @click="showRegisterDialog = true">
          注册
        </el-button>
      </template>
      
      <!-- 用户信息和退出按钮 -->
      <template v-else>
        <div class="user-info">
          <el-avatar :size="40" :src="userStore.userInfo?.avatar" />
          <span class="username">{{ userStore.userInfo?.username }}</span>
        </div>
        <el-button class="auth-btn" round @click="handleLogout">
          退出登录
        </el-button>
      </template>
    </div>
    
    <!-- 主内容区 -->
    <main class="main-content" :class="{ 'full-width': $route.path === '/messages' }">
      <router-view></router-view>
    </main>
    
    <!-- 右侧边栏 -->
    <div class="right-sidebar" v-if="userStore.isLoggedIn && $route.path !== '/messages'">
      <div class="search-container">
        <el-input
          v-model="searchQuery"
          placeholder="搜索"
          prefix-icon="Search"
        />
      </div>
      <div class="trending-section">
        <h3>热门话题</h3>
        <!-- 热门话题列表 -->
      </div>
      <div class="suggestions-section">
        <h3>推荐关注</h3>
        <!-- 推荐用户列表 -->
      </div>
    </div>
  </div>

  <!-- 登录对话框 -->
  <LoginDialog
    v-model="showLoginDialog"
    @login="handleLogin"
    @switch-to-register="switchToRegister"
  />

  <!-- 注册对话框 -->
  <RegisterDialog
    v-model="showRegisterDialog"
    @register="handleRegister"
    @switch-to-login="switchToLogin"
  />
</template>

<style scoped>
.app-container {
  display: grid;
  grid-template-columns: 300px minmax(600px, 1fr) 400px;
  min-height: 100vh;
  max-width: 1440px;
  margin: 0 auto;
  gap: 32px;
  padding: 0 24px;
}

/* 消息页面时隐藏右侧边栏，扩大主内容区 */
.main-content.full-width {
  max-width: 1200px;
  border-right: none;
}

/* 消息页面时调整布局 */
.app-container:has(.main-content.full-width) {
  grid-template-columns: 300px minmax(900px, 1fr);
}

.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 300px;
  padding: 24px 16px;
  border-right: 1px solid #eee;
}

.logo {
  margin-bottom: 32px;
  padding: 16px;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  text-decoration: none;
  color: #333;
  border-radius: 30px;
  transition: all 0.2s ease;
  font-size: 1.1em;
}

.nav-item:hover {
  background-color: #f5f5f5;
  transform: translateX(4px);
}

.nav-item.router-link-active {
  color: #000;
  font-weight: bold;
  background-color: #f0f0f0;
}

.nav-item.router-link-exact-active {
  color: #1da1f2;
  font-weight: bold;
  background-color: #e8f5fe;
}

.nav-item .el-icon {
  font-size: 24px;
}

.post-btn {
  width: 90%;
  margin-top: 32px;
  height: 56px;
  font-size: 1.2em;
}

.main-content {
  border-right: 1px solid #eee;
  min-height: 100vh;
  padding: 24px 48px;
  margin: 0 auto;
  width: 100%;
  max-width: 800px;
}

.right-sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 400px;
  padding: 24px 16px;
}

.search-container {
  margin-bottom: 32px;
}

.search-container :deep(.el-input__wrapper) {
  border-radius: 25px;
  padding: 8px 16px;
}

.trending-section,
.suggestions-section {
  background-color: #f8f9fa;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
}

h3 {
  margin-bottom: 20px;
  font-size: 1.3em;
  font-weight: bold;
}

.auth-btn {
  width: 90%;
  margin-top: 16px;
  height: 48px;
  font-size: 1.1em;
  }

.user-info {
    display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  margin-top: 32px;
  background-color: #f8f9fa;
  border-radius: 12px;
}

.username {
  font-weight: bold;
  font-size: 1.1em;
}
</style>
