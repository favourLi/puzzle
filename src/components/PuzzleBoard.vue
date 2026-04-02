<template>
  <div
    class="puzzle-board"
    :style="boardStyle"
  >
    <PuzzlePiece
      v-for="piece in sortedPieces"
      :key="piece.id"
      :piece="piece"
      :image-url="getPieceImage(piece.id)"
      :grid-size="gridSize"
      @drag-start="handleDragStart"
      @drop="handleDrop"
      @drag-over="handleDragOver"
      :class="{ 'drag-over': isDragOver }"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import PuzzlePiece from './PuzzlePiece.vue'

const props = defineProps({
  pieces: {
    type: Array,
    required: true
  },
  pieceImages: {
    type: Array,
    required: true
  },
  gridSize: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['piece-moved'])

const draggedIndex = ref(null)
const isDragOver = ref(false)

// 按 currentIndex 排序，用于渲染
const sortedPieces = computed(() => {
  return [...props.pieces].sort((a, b) => a.currentIndex - b.currentIndex)
})

// 棋盘样式
const boardStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${props.gridSize}, 1fr)`,
  gap: '2px',
  width: '500px',
  height: '500px',
  backgroundColor: '#333',
  padding: '2px',
  borderRadius: '8px',
  boxSizing: 'border-box'
}))

// 获取拼图块图片
function getPieceImage(id) {
  return props.pieceImages?.find(p => p.id === id)?.url || ''
}

function handleDragStart(index) {
  draggedIndex.value = index
}

function handleDrop(targetIndex) {
  if (draggedIndex.value !== null && draggedIndex.value !== targetIndex) {
    emit('piece-moved', draggedIndex.value, targetIndex)
  }
  draggedIndex.value = null
  isDragOver.value = false
}

function handleDragOver(e) {
  e.preventDefault()
  isDragOver.value = true
}
</script>

<style scoped>
.puzzle-board {
  user-select: none;
  position: relative;
  z-index: 1;
}

/* 防止拖拽时容器变形 */
.puzzle-board:active {
  cursor: grabbing;
}

/* 拖拽时的视觉反馈 */
.puzzle-board.drag-over {
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
}
</style>