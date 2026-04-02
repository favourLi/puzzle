<template>
  <div class="difficulty-selector">
    <button
      v-for="option in options"
      :key="option.value"
      :class="['difficulty-btn', { active: current === option.value, disabled }]"
      :disabled="disabled"
      @click="$emit('change', option.value)"
    >
      <span class="label">{{ option.label }}</span>
      <span class="grid">{{ option.grid }}</span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  current: {
    type: String,
    default: 'easy'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['change'])

const options = [
  { value: 'easy', label: '简单', grid: '3×3' },
  { value: 'medium', label: '中等', grid: '4×4' },
  { value: 'hard', label: '复杂', grid: '6×6' }
]
</script>

<style scoped>
.difficulty-selector {
  display: flex;
  gap: 10px;
}

.difficulty-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.difficulty-btn:hover:not(.disabled) {
  border-color: #667eea;
}

.difficulty-btn.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.difficulty-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.label {
  font-size: 0.9rem;
  font-weight: 500;
}

.grid {
  font-size: 0.75rem;
  opacity: 0.7;
}
</style>
