<template>
  <el-dialog
    v-model="dialogVisible"
    title="注册"
    width="400px"
    :close-on-click-modal="false"
    center
    @close="handleClose"
  >
    <el-form
      ref="registerFormRef"
      :model="registerForm"
      :rules="rules"
      label-width="0"
      @submit.prevent="handleRegister"
    >
      <el-form-item prop="username">
        <el-input
          v-model="registerForm.username"
          placeholder="用户名"
          :prefix-icon="User"
          clearable
        />
      </el-form-item>
      <el-form-item prop="email">
        <el-input
          v-model="registerForm.email"
          placeholder="邮箱"
          :prefix-icon="Message"
          clearable
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="registerForm.password"
          type="password"
          placeholder="密码"
          :prefix-icon="Lock"
          show-password
        />
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input
          v-model="registerForm.confirmPassword"
          type="password"
          placeholder="确认密码"
          :prefix-icon="Lock"
          show-password
          @keyup.enter="handleRegister"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <div class="login-link">
          已有账号？
          <el-button link type="primary" @click="switchToLogin">立即登录</el-button>
        </div>
        <el-button type="primary" @click="handleRegister" :loading="loading">
          注册
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { User, Lock, Message } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'switch-to-login': []
  'register': [data: { username: string; email: string; password: string }]
}>()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const registerForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const registerFormRef = ref<FormInstance>()

const validatePass = (_rule: any, value: string, callback: (error?: Error) => void) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (registerForm.value.confirmPassword !== '') {
      if (registerFormRef.value) {
        registerFormRef.value.validateField('confirmPassword')
      }
    }
    callback()
  }
}

const validatePass2 = (_rule: any, value: string, callback: (error?: Error) => void) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.value.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: ['blur', 'change'] }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ],
  password: [
    { required: true, validator: validatePass, trigger: ['blur', 'change'] },
    { min: 6, message: '密码长度至少为 6 个字符', trigger: ['blur', 'change'] }
  ],
  confirmPassword: [
    { required: true, validator: validatePass2, trigger: ['blur', 'change'] }
  ]
}

const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  try {
    await registerFormRef.value.validate()
    loading.value = true
    // TODO: 调用注册API
    emit('register', {
      username: registerForm.value.username,
      email: registerForm.value.email,
      password: registerForm.value.password
    })
  } catch (error) {
    ElMessage.error('请检查输入是否正确')
    console.error('表单验证失败:', error)
  } finally {
    loading.value = false
  }
}

const switchToLogin = () => {
  dialogVisible.value = false
  emit('switch-to-login')
}

// 重置表单
const resetForm = () => {
  if (registerFormRef.value) {
    registerFormRef.value.resetFields()
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

.login-link {
  font-size: 0.9em;
  color: #666;
}

:deep(.el-input__wrapper) {
  padding-left: 8px;
}

:deep(.el-input__prefix) {
  margin-right: 8px;
}
</style> 