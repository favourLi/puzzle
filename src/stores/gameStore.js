import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { splitImage } from '../utils/imageProcessor'
import { shufflePieces } from '../utils/shuffler'

export const useGameStore = defineStore('game', () => {
  // 游戏配置
  const difficulty = ref('easy')
  const gridSize = computed(() => {
    const sizes = { easy: 3, medium: 4, hard: 6 }
    return sizes[difficulty.value]
  })

  // 图片相关
  const image = ref(null)
  const imageWidth = ref(0)
  const imageHeight = ref(0)

  // 拼图状态
  const pieces = ref([])
  const pieceImages = ref([])

  // 游戏进度
  const moves = ref(0)
  const isPlaying = ref(false)
  const isComplete = ref(false)

  // 计时
  const startTime = ref(null)
  const endTime = ref(null)
  const elapsedTime = computed(() => {
    if (!startTime.value) return 0
    const end = endTime.value || Date.now()
    return Math.floor((end - startTime.value) / 1000)
  })

  function setDifficulty(newDifficulty) {
    difficulty.value = newDifficulty
  }

  function setImage(imageData) {
    image.value = imageData.url
    imageWidth.value = imageData.width
    imageHeight.value = imageData.height
  }

  async function startGame() {
    if (!image.value) return

    // 切割图片
    const result = await splitImage(image.value, gridSize.value)
    pieces.value = result.pieces
    pieceImages.value = result.pieceImages

    // 打乱拼图
    pieces.value = shufflePieces(pieces.value)

    // 重置状态
    moves.value = 0
    isComplete.value = false
    isPlaying.value = true
    startTime.value = Date.now()
    endTime.value = null
  }

  function movePiece(fromIndex, toIndex) {
    if (fromIndex === toIndex || isComplete.value) return

    // 找到在这两个位置的拼图块
    const fromPiece = pieces.value.find(p => p.currentIndex === fromIndex)
    const toPiece = pieces.value.find(p => p.currentIndex === toIndex)

    if (fromPiece && toPiece) {
      // 交换位置
      fromPiece.currentIndex = toIndex
      toPiece.currentIndex = fromIndex
      moves.value++

      // 检查是否完成
      checkCompletion()
    }
  }

  function checkCompletion() {
    const complete = pieces.value.every(
      piece => piece.currentIndex === piece.correctIndex
    )

    if (complete) {
      isComplete.value = true
      isPlaying.value = false
      endTime.value = Date.now()
    }
  }

  function restart() {
    if (!image.value) return

    // 重新打乱拼图
    pieces.value = shufflePieces([...pieces.value].map(p => ({
      ...p,
      currentIndex: p.correctIndex
    })))

    // 重置状态
    moves.value = 0
    isComplete.value = false
    isPlaying.value = true
    startTime.value = Date.now()
    endTime.value = null
  }

  function reset() {
    image.value = null
    imageWidth.value = 0
    imageHeight.value = 0
    pieces.value = []
    pieceImages.value = []
    moves.value = 0
    isPlaying.value = false
    isComplete.value = false
    startTime.value = null
    endTime.value = null
  }

  return {
    // 状态
    difficulty,
    gridSize,
    image,
    imageWidth,
    imageHeight,
    pieces,
    pieceImages,
    moves,
    isPlaying,
    isComplete,
    startTime,
    endTime,
    elapsedTime,
    // 方法
    setDifficulty,
    setImage,
    startGame,
    movePiece,
    restart,
    reset
  }
})
