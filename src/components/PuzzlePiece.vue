<template>
  <div
    class="puzzle-piece"
    :style="pieceStyle"
    draggable="true"
    @dragstart="onDragStart"
    @dragover.prevent
    @drop="onDrop"
    @dragenter="onDragEnter"
    @dragleave="onDragLeave"
  >
    <img :src="imageUrl" :alt="`拼图块 ${piece.id + 1}`" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  piece: {
    type: Object,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  gridSize: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['drag-start', 'drop'])

const isDragOver = ref(false)

const pieceStyle = computed(() => ({
  border: isDragOver.value ? '2px solid #667eea' : '1px solid #333',
  borderRadius: '4px',
  overflow: 'hidden',
  cursor: 'grab',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box'
}))

function onDragStart(e) {
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('text/plain', props.piece.currentIndex)
  emit('drag-start', props.piece.currentIndex)
}

function onDragEnter(e) {
  e.preventDefault()
  isDragOver.value = true
}

function onDragLeave() {
  isDragOver.value = false
}

function onDrop(e) {
  e.preventDefault()
  isDragOver.value = false
  emit('drop', props.piece.currentIndex)
}
</script>

<style scoped>
.puzzle-piece {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  box-sizing: border-box;
  transform: none; /* 防止拖拽时的默认变换 */
}

.puzzle-piece img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  position: relative;
}

/* 拖拽时的样式 */
.puzzle-piece.dragging {
  opacity: 0.5;
  cursor: grabbing;
}

/* 拖拽目标位置的高亮 */
.puzzle-piece.drag-over {
  border-color: #667eea !important;
  background: rgba(102, 126, 234, 0.1);
}
</style>