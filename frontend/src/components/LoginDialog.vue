<template>
  <el-dialog
    v-model="dialogVisible"
    title="登录"
    width="400px"
    :close-on-click-modal="false"
    center
    @close="handleClose"
  >
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="rules"
      label-width="0"
      @submit.prevent="handleLogin"
      status-icon
    >
      <el-form-item prop="username">
        <el-input
          v-model.trim="loginForm.username"
          placeholder="用户名/邮箱"
          :prefix-icon="User"
          clearable
          @input="validateField('username')"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model.trim="loginForm.password"
          type="password"
          placeholder="密码"
          :prefix-icon="Lock"
          show-password
          @input="validateField('password')"
          @keyup.enter="handleLogin"
        />
      </el-form-item>
      <div class="form-tips">
        默认测试账号：test@example.com / test123
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <div class="register-link">
          还没有账号？
          <el-button link type="primary" @click="switchToRegister">立即注册</el-button>
        </div>
        <el-button type="primary" @click="handleLogin" :loading="loading">
          登录
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'switch-to-register': []
  'login': [data: { username: string; password: string }]
}>()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const loginForm = ref({
  username: 'test@example.com',
  password: 'test123'
})

const loading = ref(false)
const loginFormRef = ref<FormInstance>()

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名/邮箱', trigger: 'change' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'change' },
    { min: 6, message: '密码长度至少为 6 个字符', trigger: 'change' }
  ]
}

// 实时验证单个字段
const validateField = async (field: string) => {
  if (!loginFormRef.value) return
  try {
    await loginFormRef.value.validateField(field)
  } catch (error) {
    console.error(`验证字段 ${field} 失败:`, error)
  }
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    loading.value = true
    emit('login', {
      username: loginForm.value.username,
      password: loginForm.value.password
    })
  } catch (error) {
    ElMessage.error('请检查输入是否正确')
    console.error('表单验证失败:', error)
  } finally {
    loading.value = false
  }
}

const switchToRegister = () => {
  dialogVisible.value = false
  emit('switch-to-register')
}

// 重置表单
const resetForm = () => {
  if (loginFormRef.value) {
    loginFormRef.value.resetFields()
  }
}

// 监听对话框关闭
const handleClose = () => {
  resetForm()
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.register-link {
  font-size: 0.9em;
  color: #666;
}

.form-tips {
  font-size: 0.85em;
  color: #999;
  margin-top: -10px;
  margin-bottom: 10px;
  padding-left: 10px;
}

:deep(.el-input__wrapper) {
  padding-left: 8px;
}

:deep(.el-input__prefix) {
  margin-right: 8px;
}
</style> 