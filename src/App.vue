<template>
  <div class="app-container">
    <header class="header">
      <h1>🧩 拼图游戏</h1>
    </header>

    <main class="main-content">
      <!-- 游戏未开始时显示设置界面 -->
      <div v-if="!gameStore.isPlaying && !gameStore.isComplete" class="setup-container">
        <!-- 难度选择 - 始终可选 -->
        <div class="setup-section">
          <h3>选择难度</h3>
          <DifficultySelector
            :current="gameStore.difficulty"
            :disabled="false"
            @change="handleDifficultyChange"
          />
        </div>

        <!-- 图片选择 -->
        <div class="setup-section">
          <h3>选择图片</h3>
          <ImageSelector v-if="!gameStore.image" @select="handleImageSelect" />

          <!-- 已选择图片，显示预览和开始按钮 -->
          <div v-else class="image-preview">
            <img :src="gameStore.image" alt="预览图" class="preview-img" />
            <div class="preview-actions">
              <button @click="handleStartGame" class="btn btn-primary btn-large">
                🎮 开始游戏
              </button>
              <button @click="handleNewImage" class="btn btn-secondary">
                📁 换一张图片
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 游戏进行中或完成时显示游戏界面 -->
      <div v-else class="game-container">
        <div class="game-header">
          <div class="difficulty-display">
            难度: {{ difficultyText }}
          </div>
          <Timer :isRunning="gameStore.isPlaying" />
          <div class="moves">移动次数: {{ gameStore.moves }}</div>
        </div>

        <PuzzleBoard
          v-if="gameStore.pieces.length > 0"
          :pieces="gameStore.pieces"
          :pieceImages="gameStore.pieceImages"
          :gridSize="gameStore.gridSize"
          :image="gameStore.image"
          @piece-moved="handlePieceMoved"
        />

        <div class="game-actions">
          <button @click="handlePreview" class="btn btn-secondary">👁️ 预览原图</button>
          <button @click="handleRestart" class="btn btn-secondary">🔄 重新开始</button>
          <button @click="handleGiveUp" class="btn btn-warning">😵 放弃游戏</button>
          <button @click="handleNewImage" class="btn btn-primary">📁 选择新图片</button>
        </div>

        <!-- 预览弹窗 -->
        <PreviewModal
          v-if="showPreview"
          :image="gameStore.image"
          @close="showPreview = false"
        />

        <!-- 完成弹窗 -->
        <CompletionModal
          v-if="gameStore.isComplete"
          :time="gameStore.elapsedTime"
          :moves="gameStore.moves"
          :difficulty="gameStore.difficulty"
          @restart="handleRestart"
          @new-image="handleNewImage"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from './stores/gameStore'
import ImageSelector from './components/ImageSelector.vue'
import DifficultySelector from './components/DifficultySelector.vue'
import PuzzleBoard from './components/PuzzleBoard.vue'
import Timer from './components/Timer.vue'
import PreviewModal from './components/PreviewModal.vue'
import CompletionModal from './components/CompletionModal.vue'

const gameStore = useGameStore()
const showPreview = ref(false)

const difficultyText = computed(() => {
  const texts = { easy: '简单 (3×3)', medium: '中等 (4×4)', hard: '复杂 (6×6)' }
  return texts[gameStore.difficulty]
})

function handleImageSelect(imageData) {
  gameStore.setImage(imageData)
}

function handleDifficultyChange(difficulty) {
  gameStore.setDifficulty(difficulty)
}

function handleStartGame() {
  gameStore.startGame()
}

function handlePieceMoved(fromIndex, toIndex) {
  gameStore.movePiece(fromIndex, toIndex)
}

function handlePreview() {
  showPreview.value = true
}

function handleRestart() {
  gameStore.restart()
}

function handleGiveUp() {
  gameStore.reset()
}

function handleNewImage() {
  gameStore.reset()
}
</script>

<style scoped>
.app-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  text-align: center;
}

.header h1 {
  font-size: 2rem;
  font-weight: 600;
}

.main-content {
  padding: 20px;
}

.setup-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.setup-section {
  text-align: center;
}

.setup-section h3 {
  margin-bottom: 15px;
  color: #333;
  font-size: 1.1rem;
}

.image-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.preview-img {
  max-width: 300px;
  max-height: 300px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.preview-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.game-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.difficulty-display {
  font-size: 1rem;
  color: #666;
  background: #f0f0f0;
  padding: 6px 12px;
  border-radius: 6px;
}

.moves {
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
}

.game-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 20px;
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

.btn-large {
  padding: 15px 40px;
  font-size: 1.2rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-warning {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
}

.btn-warning:hover {
  background: linear-gradient(135deg, #ff5252 0%, #e53935 100%);
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background: #e0e0e0;
}
</style>
