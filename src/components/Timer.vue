<template>
  <div class="timer">
    <span class="timer-icon">⏱️</span>
    <span class="timer-value">{{ formattedTime }}</span>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'

const props = defineProps({
  isRunning: {
    type: Boolean,
    default: false
  }
})

const elapsed = ref(0)
let interval = null

const formattedTime = computed(() => {
  const minutes = Math.floor(elapsed.value / 60)
  const seconds = elapsed.value % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

watch(() => props.isRunning, (running) => {
  if (running) {
    interval = setInterval(() => {
      elapsed.value++
    }, 1000)
  } else {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  }
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})
</script>

<style scoped>
.timer {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.timer-icon {
  font-size: 1.2rem;
}

.timer-value {
  font-family: 'Monaco', 'Consolas', monospace;
  min-width: 60px;
}
</style>
