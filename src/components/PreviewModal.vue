<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <img :src="image" alt="原图预览" class="preview-image" />
      <button class="close-btn" @click="$emit('close')">✕</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  image: {
    type: String,
    required: true
  }
})

defineEmits(['close'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  background: white;
  border-radius: 12px;
  padding: 10px;
}

.preview-image {
  max-width: 100%;
  max-height: 80vh;
  border-radius: 8px;
}

.close-btn {
  position: absolute;
  top: -15px;
  right: -15px;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #f0f0f0;
}
</style>
