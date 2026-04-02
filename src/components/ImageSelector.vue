<template>
  <div class="image-selector">
    <div class="upload-area" @click="triggerFileInput">
      <div class="upload-icon">📁</div>
      <p class="upload-text">点击选择图片</p>
      <p class="upload-hint">支持 JPG、PNG、WebP 格式，最大 5MB</p>
    </div>
    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/png,image/webp,image/gif"
      @change="handleFileChange"
      hidden
    />
    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { readImageFile } from '../utils/imageProcessor'

const emit = defineEmits(['select'])
const fileInput = ref(null)
const error = ref('')

function triggerFileInput() {
  fileInput.value?.click()
}

async function handleFileChange(event) {
  const file = event.target.files?.[0]
  if (!file) return

  error.value = ''

  try {
    const imageData = await readImageFile(file)
    emit('select', imageData)
  } catch (e) {
    error.value = e.message
  }

  // 清空 input，允许选择同一文件
  event.target.value = ''
}
</script>

<style scoped>
.image-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
}

.upload-area {
  width: 100%;
  max-width: 400px;
  padding: 60px 40px;
  border: 3px dashed #ccc;
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
}

.upload-area:hover {
  border-color: #667eea;
  background: #f5f0ff;
}

.upload-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.upload-text {
  font-size: 4px solid #667eea;
  transform: scale(1.02);
}

.upload-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.upload-text {
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.upload-hint {
  font-size: 0.9rem;
  color: #666;
}

.error-message {
  margin-top: 15px;
  color: #e74c3c;
  font-size: 0.9rem;
}
</style>
