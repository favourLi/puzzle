<template>
  <div class="modal-overlay">
    <div class="completion-modal">
      <div class="celebration">🎉</div>
      <h2>恭喜完成！</h2>

      <div class="stats">
        <div class="stat-item">
          <span class="stat-label">难度</span>
          <span class="stat-value">{{ difficultyText }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">用时</span>
          <span class="stat-value">{{ formattedTime }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">移动次数</span>
          <span class="stat-value">{{ moves }} 次</span>
        </div>
      </div>

      <div class="rating">
        <span v-for="i in 3" :key="i" class="star" :class="{ filled: i <= stars }">⭐</span>
      </div>

      <div class="actions">
        <button class="btn btn-secondary" @click="$emit('restart')">再玩一次</button>
        <button class="btn btn-primary" @click="$emit('new-image')">选择新图片</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  time: {
    type: Number,
    required: true
  },
  moves: {
    type: Number,
    required: true
  },
  difficulty: {
    type: String,
    required: true
  }
})

defineEmits(['restart', 'new-image'])

const difficultyText = computed(() => {
  const texts = { easy: '简单', medium: '中等', hard: '复杂' }
  return texts[props.difficulty]
})

const formattedTime = computed(() => {
  const minutes = Math.floor(props.time / 60)
  const seconds = props.time % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const stars = computed(() => {
  const thresholds = {
    easy: [30, 60],      // < 30s: 3星, < 60s: 2星, else: 1星
    medium: [90, 180],   // < 90s: 3星, < 180s: 2星
    hard: [180, 300]     // < 180s: 3星, < 300s: 2星
  }
  const [three, two] = thresholds[props.difficulty]

  if (props.time < three) return 3
  if (props.time < two) return 2
  return 1
})
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
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.completion-modal {
  background: white;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.celebration {
  font-size: 4rem;
  margin-bottom: 10px;
  animation: bounce 0.6s ease infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 20px;
}

.stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.rating {
  font-size: 2rem;
  margin-bottom: 25px;
}

.star {
  filter: grayscale(100%);
  transition: filter 0.3s ease;
}

.star.filled {
  filter: grayscale(0%);
}

.actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}
</style>
