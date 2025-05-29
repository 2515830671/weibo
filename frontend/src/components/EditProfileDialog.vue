<template>
  <el-dialog
    v-model="dialogVisible"
    title="编辑个人资料"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
      class="profile-form"
    >
      <!-- 封面图片 -->
      <div class="cover-upload">
        <el-upload
          class="upload-area"
          action="#"
          :show-file-list="false"
          :before-upload="file => handleImageUpload(file, 'cover')"
          accept="image/*"
        >
          <div class="image-container">
            <el-image
              :src="form.coverImage || defaultCover"
              fit="cover"
              class="cover-preview"
            />
            <div class="upload-overlay">
              <div class="upload-hint">
                <el-icon :size="24"><Camera /></el-icon>
                <span>更换封面图片</span>
              </div>
            </div>
          </div>
        </el-upload>
      </div>

      <!-- 头像 -->
      <div class="avatar-upload">
        <el-upload
          class="upload-area"
          action="#"
          :show-file-list="false"
          :before-upload="file => handleImageUpload(file, 'avatar')"
          accept="image/*"
        >
          <div class="image-container">
            <el-avatar
              :size="100"
              :src="form.avatar || defaultAvatar"
              class="avatar-preview"
            />
            <div class="upload-overlay">
              <div class="upload-hint">
                <el-icon :size="20"><Camera /></el-icon>
              </div>
            </div>
          </div>
        </el-upload>
      </div>

      <!-- 基本信息 -->
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" maxlength="20" show-word-limit />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" type="email" />
      </el-form-item>

      <el-form-item label="个人简介" prop="bio">
        <el-input
          v-model="form.bio"
          type="textarea"
          :rows="3"
          maxlength="160"
          show-word-limit
          resize="none"
          placeholder="介绍一下你自己吧（选填）"
        />
      </el-form-item>

      <el-form-item label="所在地" prop="location">
        <el-select
          v-model="form.location"
          filterable
          placeholder="选择所在地"
          class="location-select"
        >
          <el-option-group label="华北地区">
            <el-option value="北京" label="北京" />
            <el-option value="天津" label="天津" />
            <el-option value="河北" label="河北" />
            <el-option value="山西" label="山西" />
            <el-option value="内蒙古" label="内蒙古" />
          </el-option-group>
          <el-option-group label="东北地区">
            <el-option value="辽宁" label="辽宁" />
            <el-option value="吉林" label="吉林" />
            <el-option value="黑龙江" label="黑龙江" />
          </el-option-group>
          <el-option-group label="华东地区">
            <el-option value="上海" label="上海" />
            <el-option value="江苏" label="江苏" />
            <el-option value="浙江" label="浙江" />
            <el-option value="安徽" label="安徽" />
            <el-option value="福建" label="福建" />
            <el-option value="江西" label="江西" />
            <el-option value="山东" label="山东" />
          </el-option-group>
          <el-option-group label="华中地区">
            <el-option value="河南" label="河南" />
            <el-option value="湖北" label="湖北" />
            <el-option value="湖南" label="湖南" />
          </el-option-group>
          <el-option-group label="华南地区">
            <el-option value="广东" label="广东" />
            <el-option value="广西" label="广西" />
            <el-option value="海南" label="海南" />
          </el-option-group>
          <el-option-group label="西南地区">
            <el-option value="重庆" label="重庆" />
            <el-option value="四川" label="四川" />
            <el-option value="贵州" label="贵州" />
            <el-option value="云南" label="云南" />
            <el-option value="西藏" label="西藏" />
          </el-option-group>
          <el-option-group label="西北地区">
            <el-option value="陕西" label="陕西" />
            <el-option value="甘肃" label="甘肃" />
            <el-option value="青海" label="青海" />
            <el-option value="宁夏" label="宁夏" />
            <el-option value="新疆" label="新疆" />
          </el-option-group>
          <el-option-group label="特别行政区">
            <el-option value="香港" label="香港" />
            <el-option value="澳门" label="澳门" />
            <el-option value="台湾" label="台湾" />
          </el-option-group>
        </el-select>
      </el-form-item>

      <el-form-item label="备用邮箱" prop="website">
        <el-input
          v-model="form.website"
          type="email"
          placeholder="请输入备用邮箱（选填）"
        />
      </el-form-item>

      <!-- 加入时间（只读） -->
      <el-form-item label="加入时间">
        <div class="join-time">{{ formatJoinTime }}</div>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Camera } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user'
import type { UserInfo } from '@/types/user'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [data: any]
}>()

const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const defaultAvatar = 'https://placeholder.co/100'
const defaultCover = 'https://placeholder.co/1500x500'

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

interface FormData extends UserInfo {
  avatarFile?: File
  coverImageFile?: File
}

// 表单数据
const form = ref<FormData>({
  username: userStore.userInfo?.username || '',
  email: userStore.userInfo?.email || '',
  bio: userStore.userInfo?.bio || '',
  location: userStore.userInfo?.location || '',
  website: userStore.userInfo?.website || '',
  avatar: userStore.userInfo?.avatar || '',
  coverImage: userStore.userInfo?.coverImage || '',
  joinTime: userStore.userInfo?.joinTime || new Date('2020-01-01')
})

// 表单验证规则
const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
    { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, message: '只能包含中文、英文、数字和下划线', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { 
      pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: '请输入正确的邮箱地址',
      trigger: ['blur', 'change']
    }
  ],
  bio: [], // 个人简介不做验证，可以为空
  location: [], // 所在地不做验证，可以为空
  website: [
    { 
      pattern: /^$|^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: '请输入正确的邮箱地址格式',
      trigger: ['blur', 'change']
    }
  ]
}

// 格式化加入时间
const formatJoinTime = computed(() => {
  return new Date(form.value.joinTime).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long'
  })
})

// 处理图片上传
const handleImageUpload = async (file: File, type: 'avatar' | 'cover') => {
  // 检查文件类型
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    ElMessage.error('只支持 JPG、PNG、GIF 格式的图片')
    return false
  }
  
  const maxSize = type === 'avatar' ? 2 : 5 // 头像最大2MB，封面最大5MB
  const isLtMax = file.size / 1024 / 1024 < maxSize
  if (!isLtMax) {
    ElMessage.error(`图片大小不能超过 ${maxSize}MB`)
    return false
  }
  
  try {
    // 创建本地预览URL
    const imageUrl = URL.createObjectURL(file)
    
    // 创建一个 Promise 来处理图片加载
    await new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('图片加载失败'))
      img.src = imageUrl
    })
    
    // 更新表单数据
    if (type === 'avatar') {
      form.value.avatar = imageUrl
      form.value.avatarFile = file
    } else {
      form.value.coverImage = imageUrl
      form.value.coverImageFile = file
    }
    
    return false // 阻止默认上传
  } catch (error) {
    ElMessage.error('图片加载失败，请重试')
    console.error('图片处理失败:', error)
    return false
  }
}

// 提交表单前的验证
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    // 构建要提交的数据
    const updateData = {
      username: form.value.username.trim(),
      email: form.value.email.trim()
    } as any

    // 添加可选字段
    if (form.value.bio?.trim()) {
      updateData.bio = form.value.bio.trim()
    }
    if (form.value.location) {
      updateData.location = form.value.location
    }
    if (form.value.website?.trim()) {
      updateData.website = form.value.website.trim()
    }

    // 处理图片文件
    if (form.value.avatarFile) {
      const formData = new FormData()
      formData.append('avatar', form.value.avatarFile)
      // TODO: 上传头像到服务器
      // const avatarUrl = await uploadImage(formData)
      // updateData.avatar = avatarUrl
      updateData.avatar = form.value.avatar // 临时使用本地URL
    }
    
    if (form.value.coverImageFile) {
      const formData = new FormData()
      formData.append('cover', form.value.coverImageFile)
      // TODO: 上传封面到服务器
      // const coverUrl = await uploadImage(formData)
      // updateData.coverImage = coverUrl
      updateData.coverImage = form.value.coverImage // 临时使用本地URL
    }
    
    // 调用API更新用户信息
    await userStore.updateProfile(updateData)
    
    ElMessage.success('保存成功')
    dialogVisible.value = false
    emit('submit', updateData)
  } catch (error) {
    if (error instanceof Error) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('保存失败，请重试')
    }
    console.error('保存失败:', error)
  } finally {
    loading.value = false
  }
}

// 重置表单时的处理
const handleClose = () => {
  if (formRef.value) {
    formRef.value.resetFields()
    // 清理已上传的图片URL
    if (form.value.avatar && form.value.avatar.startsWith('blob:')) {
      URL.revokeObjectURL(form.value.avatar)
    }
    if (form.value.coverImage && form.value.coverImage.startsWith('blob:')) {
      URL.revokeObjectURL(form.value.coverImage)
    }
  }
}

// 监听对话框关闭
watch(dialogVisible, (newVal) => {
  if (!newVal) {
    handleClose()
  }
})
</script>

<style scoped>
.profile-form {
  margin-top: 20px;
}

.cover-upload {
  position: relative;
  width: 100%;
  height: 200px;
  margin-bottom: 60px;
  border-radius: 12px;
  overflow: hidden;
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.cover-preview {
  width: 100%;
  height: 100%;
}

.upload-area {
  width: 100%;
  height: 100%;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s;
}

.upload-hint {
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.upload-hint span {
  font-size: 14px;
}

.image-container:hover .upload-overlay {
  opacity: 1;
}

.avatar-upload {
  position: absolute;
  top: 150px;
  left: 40px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.avatar-upload:hover {
  transform: scale(1.05);
}

.avatar-preview {
  border: 4px solid #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.avatar-upload .upload-overlay {
  border-radius: 50%;
}

.avatar-upload .upload-hint {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
}

.join-time {
  color: #666;
  line-height: 32px;
}

:deep(.el-upload) {
  display: block;
  width: 100%;
  height: 100%;
}

:deep(.el-dialog__body) {
  padding-top: 0;
}

.location-select {
  width: 100%;
}

:deep(.el-select-dropdown__item) {
  padding: 0 20px;
}

:deep(.el-select-group__wrap:not(:last-of-type)) {
  padding-bottom: 0;
}

:deep(.el-select-group__title) {
  padding-left: 20px;
  font-size: 14px;
  color: #909399;
  font-weight: bold;
}
</style> 